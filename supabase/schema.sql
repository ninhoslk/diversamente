-- ===================================================
-- SCRIPT DE BANCO DE DADOS SUPABASE PARA DIVERSAMENTE
-- Cole este script no Editor SQL do seu painel do Supabase:
-- https://supabase.com/dashboard/project/cgixormdpoqadwxtlycb/sql
-- ===================================================

-- 1. TABELA DE PERFIS DE USUÁRIOS (vinculada ao Supabase Auth)
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

CREATE POLICY "Leitura de perfil próprio" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND papel = 'admin'
  ));

CREATE POLICY "Admin pode gerenciar perfis" ON public.profiles
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND papel = 'admin'
  ));

-- 2. TABELA DE CONFIGURAÇÃO DO SITE (ELEMENTOR)
CREATE TABLE IF NOT EXISTS public.site_config (
  id TEXT PRIMARY KEY DEFAULT 'main',
  config JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura publica das configuracoes do site" ON public.site_config
  FOR SELECT USING (true);

CREATE POLICY "Permitir alteracao das configuracoes do site" ON public.site_config
  FOR ALL USING (true);

-- 3. TABELA DE MATERIAIS PEDAGÓGICOS
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

CREATE POLICY "Leitura de materiais publica" ON public.materials
  FOR SELECT USING (true);

CREATE POLICY "Insercao de materiais" ON public.materials
  FOR ALL USING (true);

-- 4. INSTRUÇÕES PARA ARMAZENAMENTO DE PDFS E MÍDIAS (SUPABASE STORAGE)
-- No painel do Supabase (https://supabase.com/dashboard/project/cgixormdpoqadwxtlycb/storage/buckets):
-- A) Criar um novo Bucket com o nome 'materiais'
-- B) Marque a opção 'Public bucket' para que os PDFs e vídeos sejam servidos via CDN rápida.
-- C) A URL dos seus PDFs ficará assim:
--    https://cgixormdpoqadwxtlycb.supabase.co/storage/v1/object/public/materiais/[nome-do-arquivo.pdf]
