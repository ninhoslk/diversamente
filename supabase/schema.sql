-- ===================================================
-- SCRIPT DE BANCO DE DADOS SUPABASE PARA DIVERSAMENTE
-- Cole este script no Editor SQL do seu painel do Supabase.
--
-- Este script substitui o modelo anterior (que usava RLS totalmente
-- aberto e um "bucket" público) por um modelo real de autenticação e
-- autorização:
--   - login via Supabase Auth (auth.users), sem senhas em texto puro;
--   - papel do usuário (admin/professor/aluno/pai) guardado em profiles;
--   - leitura de materiais só para usuários autenticados;
--   - escrita (criar/editar/apagar materiais e usuários) só para admin;
--   - arquivos de PDF em um bucket PRIVADO, sem nenhuma política pública
--     de leitura/escrita — o acesso só acontece via URLs assinadas de
--     curta duração, geradas pelo servidor (rotas em app/api/**).
-- ===================================================

-- ---------------------------------------------------
-- 0. FUNÇÃO AUXILIAR: o usuário autenticado é admin?
-- ---------------------------------------------------
-- SECURITY DEFINER evita recursão de RLS ao consultar profiles dentro
-- das próprias políticas de profiles/materials/site_config.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND papel = 'admin'
  );
$$;

-- ---------------------------------------------------
-- 1. TABELA DE PERFIS DE USUÁRIOS
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  papel TEXT NOT NULL CHECK (papel IN ('admin', 'professor', 'aluno', 'pai', 'visitante')),
  categoria_id TEXT DEFAULT 'todas',
  categoria_nome TEXT DEFAULT 'Todas as salas / anos',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura de perfil próprio" ON public.profiles;
DROP POLICY IF EXISTS "Admin pode gerenciar perfis" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;

-- Cada usuário só lê o próprio perfil; admin lê todos (necessário para o painel de usuários).
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (id = auth.uid() OR public.is_admin());

-- Toda escrita em profiles acontece pelo servidor com a service_role key
-- (rotas app/api/admin/usuarios), então não há política de INSERT/UPDATE/DELETE
-- liberada para anon/authenticated — apenas service_role (que ignora RLS).

REVOKE ALL ON public.profiles FROM anon;
GRANT SELECT ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- Provisiona automaticamente um perfil mínimo quando um usuário é criado
-- via Supabase Auth (o servidor então atualiza papel/categoria via upsert).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email, papel)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email), NEW.email, 'aluno')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ---------------------------------------------------
-- 2. TABELA DE MATERIAIS PEDAGÓGICOS (PDFs, vídeos, jogos)
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  trilha TEXT NOT NULL,
  categoria TEXT NOT NULL,
  publico TEXT NOT NULL CHECK (publico IN ('crianca', 'aluno', 'educador', 'familia')),
  tipo TEXT NOT NULL CHECK (tipo IN ('pdf', 'video', 'jogo')),
  url TEXT,                 -- link externo (vídeo, jogo, ou PDF hospedado fora do Storage)
  storage_path TEXT,        -- caminho no bucket privado "materiais" (upload direto de PDF)
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT materials_tem_conteudo CHECK (url IS NOT NULL OR storage_path IS NOT NULL)
);

-- Migração para quem já tinha a tabela "materials" de uma versão anterior do schema
-- (CREATE TABLE IF NOT EXISTS acima não adiciona colunas a uma tabela já existente):
ALTER TABLE public.materials ALTER COLUMN url DROP NOT NULL;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS storage_path TEXT;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.materials DROP CONSTRAINT IF EXISTS materials_tem_conteudo;
ALTER TABLE public.materials ADD CONSTRAINT materials_tem_conteudo CHECK (url IS NOT NULL OR storage_path IS NOT NULL);

ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura de materiais publica" ON public.materials;
DROP POLICY IF EXISTS "Insercao de materiais" ON public.materials;
DROP POLICY IF EXISTS "materials_select" ON public.materials;
DROP POLICY IF EXISTS "materials_write" ON public.materials;

-- Confere, para o usuário autenticado atual, se ele pode ver uma linha de
-- materials com o (trilha, categoria, publico) informados. Espelha em SQL a
-- mesma regra usada em lib/catalog.ts (usuarioPodeAcessarCategoria +
-- publicosPermitidosParaPapel) e já aplicada na rota de URL assinada de PDF
-- (app/api/materiais/[id]/pdf-url/route.ts), agora também no nível de RLS —
-- assim a restrição vale para QUALQUER consulta à tabela (inclusive a
-- consulta direta feita pelo cliente em lib/app-provider.tsx), não só para a
-- UI. SECURITY DEFINER evita recursão de RLS ao ler profiles.
CREATE OR REPLACE FUNCTION public.usuario_pode_ver_material(p_trilha TEXT, p_categoria TEXT, p_publico TEXT)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND (
        p.papel = 'admin'
        OR (
          p.papel IN ('professor', 'aluno', 'pai')
          -- restrição de turma/ano: "todas" (ou vazio) libera tudo; senão precisa
          -- bater com a trilha inteira ou a categoria (ano/turma) específica
          AND (p.categoria_id IS NULL OR p.categoria_id = 'todas' OR p.categoria_id = p_trilha OR p.categoria_id = p_categoria)
          AND (
            p.papel = 'professor'
            OR (p.papel = 'aluno' AND p_publico IN ('aluno', 'crianca'))
            OR (p.papel = 'pai' AND p_publico IN ('familia', 'aluno', 'crianca'))
          )
        )
      )
  );
$$;

-- Só usuários autenticados que têm permissão de papel + turma/ano para aquele
-- material específico podem lê-lo. Antes, qualquer autenticado lia a tabela
-- inteira (o filtro por turma/ano só existia na UI) — um aluno restrito a uma
-- turma conseguia ver metadados e URLs de vídeo/jogo de qualquer outra turma
-- consultando a tabela "materials" diretamente pelo cliente Supabase.
CREATE POLICY "materials_select" ON public.materials
  FOR SELECT USING (public.usuario_pode_ver_material(trilha, categoria, publico));

-- Só admin pode criar, editar ou apagar materiais.
CREATE POLICY "materials_write" ON public.materials
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

REVOKE ALL ON public.materials FROM anon;
GRANT SELECT ON public.materials TO authenticated;
GRANT ALL ON public.materials TO service_role;

-- Garante que mudanças em materials cheguem via Realtime (sincronização entre abas/usuários).
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.materials;
EXCEPTION WHEN duplicate_object THEN
  NULL; -- já estava incluída
END $$;


-- ---------------------------------------------------
-- 3. CONFIGURAÇÃO DE LAYOUT DO SITE (Elementor / aparência)
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_config (
  id TEXT PRIMARY KEY DEFAULT 'main',
  config JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir leitura publica das configuracoes do site" ON public.site_config;
DROP POLICY IF EXISTS "Permitir alteracao das configuracoes do site" ON public.site_config;
DROP POLICY IF EXISTS "site_config_select" ON public.site_config;
DROP POLICY IF EXISTS "site_config_write" ON public.site_config;

-- A aparência do site é pública (necessário para renderizar a home para visitantes).
CREATE POLICY "site_config_select" ON public.site_config
  FOR SELECT USING (true);

-- Só admin pode alterar a aparência do site.
CREATE POLICY "site_config_write" ON public.site_config
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

GRANT SELECT ON public.site_config TO anon, authenticated;
GRANT ALL ON public.site_config TO service_role;

-- Garante que mudanças em site_config cheguem via Realtime (sincronização entre
-- abas/usuários) — assim, edições feitas no Elementor aparecem para todos os
-- visitantes na hora, sem precisar recarregar a página.
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.site_config;
EXCEPTION WHEN duplicate_object THEN
  NULL; -- já estava incluída
END $$;


-- ---------------------------------------------------
-- 4. BUCKET PRIVADO PARA OS ARQUIVOS DE PDF
-- ---------------------------------------------------
-- Cria (ou atualiza) o bucket como privado. IMPORTANTE: se o bucket
-- "materiais" já existir como público no seu projeto, este comando o
-- marca como privado — qualquer link antigo com getPublicUrl deixará
-- de funcionar (o que é o comportamento esperado e desejado).
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('materiais', 'materiais', false, 157286400, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 157286400,
  allowed_mime_types = ARRAY['application/pdf'];

-- Nenhuma política de storage.objects é criada para anon/authenticated:
-- de propósito. Sem política de SELECT/INSERT/UPDATE/DELETE liberada,
-- o bucket só pode ser acessado pela chave service_role (usada
-- exclusivamente nas rotas de servidor em app/api/materiais/**), que
-- ignora RLS. Leitura pelo aluno acontece só por URL assinada de
-- curta duração (createSignedUrl), nunca por acesso direto ao objeto.
