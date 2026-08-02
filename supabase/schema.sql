-- ===================================================
-- SCRIPT DE BANCO DE DADOS SUPABASE PARA DIVERSAMENTE
-- Cole este script no Editor SQL do seu painel do Supabase:
-- https://supabase.com/dashboard/project/cgixormdpoqadwxtlycb/sql
-- ===================================================

-- 1. TABELA DE CONFIGURAÇÃO DO SITE (ELEMENTOR)
CREATE TABLE IF NOT EXISTS public.site_config (
  id TEXT PRIMARY KEY DEFAULT 'main',
  config JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Limpar politicas antigas se existirem para evitar conflitos
DROP POLICY IF EXISTS "Permitir leitura publica das configuracoes do site" ON public.site_config;
DROP POLICY IF EXISTS "Permitir alteracao das configuracoes do site" ON public.site_config;

-- Criar politicas limpas
CREATE POLICY "Permitir leitura publica das configuracoes do site" ON public.site_config
  FOR SELECT USING (true);

CREATE POLICY "Permitir alteracao das configuracoes do site" ON public.site_config
  FOR ALL USING (true);

-- Permissões explícitas de acesso
GRANT ALL ON public.site_config TO anon, authenticated, postgres, service_role;


-- 2. TABELA DE MATERIAIS PEDAGÓGICOS
CREATE TABLE IF NOT EXISTS public.materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  trilha TEXT NOT NULL,
  categoria TEXT NOT NULL,
  publico TEXT NOT NULL CHECK (publico IN ('crianca', 'aluno', 'educador', 'familia')),
  tipo TEXT NOT NULL CHECK (tipo IN ('pdf', 'video', 'jogo')),
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura de materiais publica" ON public.materials;
DROP POLICY IF EXISTS "Insercao de materiais" ON public.materials;

CREATE POLICY "Leitura de materiais publica" ON public.materials
  FOR SELECT USING (true);

CREATE POLICY "Insercao de materiais" ON public.materials
  FOR ALL USING (true);

GRANT ALL ON public.materials TO anon, authenticated, postgres, service_role;


-- 3. TABELA DE PERFIS DE USUÁRIOS
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

CREATE POLICY "Leitura de perfil próprio" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Admin pode gerenciar perfis" ON public.profiles
  FOR ALL USING (true);

GRANT ALL ON public.profiles TO anon, authenticated, postgres, service_role;
