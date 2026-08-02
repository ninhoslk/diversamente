export type TipoMaterial = "pdf" | "video" | "jogo"

export type PublicoSlug = "crianca" | "aluno" | "educador" | "familia"

export type Trilha = {
  slug: string
  nome: string
  descricao: string
  gradient: string
}

export type Categoria = {
  slug: string
  nome: string
  trilha: string
  publicos: PublicoSlug[]
}

export type Material = {
  id: string
  titulo: string
  descricao: string
  tipo: TipoMaterial
  url: string
  trilha: string
  categoria: string
  publico: PublicoSlug
  criadoEm: string
}

export const TRILHAS: Trilha[] = [
  {
    slug: "educacao-infantil",
    nome: "Educação Infantil",
    descricao: "Berçário, Maternal e Pré-alfabetização com materiais lúdicos e sensoriais.",
    gradient: "from-holo-pink via-holo-lilac to-holo-blue",
  },
  {
    slug: "fundamental-1",
    nome: "Ensino Fundamental I",
    descricao: "Do 1º ao 5º ano, com trilhas para aluno, educador e família.",
    gradient: "from-holo-blue via-holo-mint to-holo-yellow",
  },
]

export const PUBLICOS: Record<PublicoSlug, string> = {
  crianca: "Criança",
  aluno: "Aluno",
  educador: "Material do Educador",
  familia: "Família",
}

export const CATEGORIAS: Categoria[] = [
  { slug: "bercario", nome: "Berçário", trilha: "educacao-infantil", publicos: ["educador", "familia"] },
  { slug: "maternal", nome: "Maternal", trilha: "educacao-infantil", publicos: ["crianca", "educador", "familia"] },
  {
    slug: "pre-alfabetizacao",
    nome: "Pré-alfabetização",
    trilha: "educacao-infantil",
    publicos: ["crianca", "educador", "familia"],
  },
  { slug: "1-ano", nome: "1º Ano", trilha: "fundamental-1", publicos: ["aluno", "educador", "familia"] },
  { slug: "2-ano", nome: "2º Ano", trilha: "fundamental-1", publicos: ["aluno", "educador", "familia"] },
  { slug: "3-ano", nome: "3º Ano", trilha: "fundamental-1", publicos: ["aluno", "educador", "familia"] },
  { slug: "4-ano", nome: "4º Ano", trilha: "fundamental-1", publicos: ["aluno", "educador", "familia"] },
  { slug: "5-ano", nome: "5º Ano", trilha: "fundamental-1", publicos: ["aluno", "educador", "familia"] },
]

export const TIPOS: { slug: TipoMaterial; label: string }[] = [
  { slug: "pdf", label: "PDFs" },
  { slug: "video", label: "Vídeos" },
  { slug: "jogo", label: "Jogos" },
]

export function getTrilha(slug: string) {
  return TRILHAS.find((t) => t.slug === slug)
}

export function getCategoria(trilha: string, slug: string) {
  return CATEGORIAS.find((c) => c.trilha === trilha && c.slug === slug)
}

export function getCategorias(trilha: string) {
  return CATEGORIAS.filter((c) => c.trilha === trilha)
}

/** Materiais de demonstração — serão substituídos pelos registros do Supabase. */
export const MATERIAIS_INICIAIS: Material[] = [
  {
    id: "m1",
    titulo: "Guia de estimulação sensorial 0 a 18 meses",
    descricao: "Sequência de atividades sensoriais para a rotina do berçário.",
    tipo: "pdf",
    url: "",
    trilha: "educacao-infantil",
    categoria: "bercario",
    publico: "educador",
    criadoEm: "2026-05-12",
  },
  {
    id: "m2",
    titulo: "Rotina de acolhimento em casa",
    descricao: "Orientações para a família reforçar vínculos no primeiro ano.",
    tipo: "pdf",
    url: "",
    trilha: "educacao-infantil",
    categoria: "bercario",
    publico: "familia",
    criadoEm: "2026-05-14",
  },
  {
    id: "m3",
    titulo: "Canções de roda para o Maternal",
    descricao: "Playlist comentada com gestos e movimentos.",
    tipo: "video",
    url: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    trilha: "educacao-infantil",
    categoria: "maternal",
    publico: "crianca",
    criadoEm: "2026-05-20",
  },
  {
    id: "m4",
    titulo: "Jogo das formas e cores",
    descricao: "Atividade interativa de pareamento para a criança.",
    tipo: "jogo",
    url: "https://example.com/jogo-formas",
    trilha: "educacao-infantil",
    categoria: "maternal",
    publico: "crianca",
    criadoEm: "2026-05-22",
  },
  {
    id: "m5",
    titulo: "Consciência fonológica: plano de aula",
    descricao: "Roteiro completo de 8 encontros de pré-alfabetização.",
    tipo: "pdf",
    url: "",
    trilha: "educacao-infantil",
    categoria: "pre-alfabetizacao",
    publico: "educador",
    criadoEm: "2026-06-01",
  },
  {
    id: "m6",
    titulo: "Caça-sílabas divertido",
    descricao: "Jogo de formação de palavras com sílabas simples.",
    tipo: "jogo",
    url: "https://example.com/caca-silabas",
    trilha: "educacao-infantil",
    categoria: "pre-alfabetizacao",
    publico: "crianca",
    criadoEm: "2026-06-03",
  },
  {
    id: "m7",
    titulo: "Caderno de atividades — 1º Ano",
    descricao: "40 páginas de atividades de leitura e escrita.",
    tipo: "pdf",
    url: "",
    trilha: "fundamental-1",
    categoria: "1-ano",
    publico: "aluno",
    criadoEm: "2026-06-08",
  },
  {
    id: "m8",
    titulo: "Como acompanhar a lição de casa",
    descricao: "Vídeo curto com orientações práticas para a família.",
    tipo: "video",
    url: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    trilha: "fundamental-1",
    categoria: "1-ano",
    publico: "familia",
    criadoEm: "2026-06-09",
  },
  {
    id: "m9",
    titulo: "Sequência didática de multiplicação",
    descricao: "Planejamento com avaliação formativa para o 3º ano.",
    tipo: "pdf",
    url: "",
    trilha: "fundamental-1",
    categoria: "3-ano",
    publico: "educador",
    criadoEm: "2026-06-15",
  },
  {
    id: "m10",
    titulo: "Desafio da tabuada",
    descricao: "Jogo de velocidade para praticar multiplicação.",
    tipo: "jogo",
    url: "https://example.com/desafio-tabuada",
    trilha: "fundamental-1",
    categoria: "3-ano",
    publico: "aluno",
    criadoEm: "2026-06-16",
  },
  {
    id: "m11",
    titulo: "Projeto de leitura — 5º Ano",
    descricao: "Roteiro de clube do livro com fichas de acompanhamento.",
    tipo: "pdf",
    url: "",
    trilha: "fundamental-1",
    categoria: "5-ano",
    publico: "educador",
    criadoEm: "2026-06-28",
  },
  {
    id: "m12",
    titulo: "Experimentos científicos em casa",
    descricao: "Cinco experimentos seguros para fazer com a família.",
    tipo: "video",
    url: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    trilha: "fundamental-1",
    categoria: "5-ano",
    publico: "familia",
    criadoEm: "2026-06-30",
  },
]
