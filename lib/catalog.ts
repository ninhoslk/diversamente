export type TipoMaterial = "pdf" | "video" | "jogo" | "manual" | "projeto" | "audio"

export type PublicoSlug = "crianca" | "aluno" | "educador" | "familia"

export type Trilha = {
  slug: string
  nome: string
  descricao: string
  gradient: string
  /** Selo curto exibido no card para destacar trilhas especiais/novas (ex.: "🌱 Novo"). */
  badge?: string
  /** Tipos de material extras (além de pdf/vídeo/jogo) disponíveis só nesta trilha. */
  tiposExtras?: TipoMaterial[]
}

export type Categoria = {
  slug: string
  nome: string
  trilha: string
  publicos: PublicoSlug[]
  /**
   * Quando true, esta categoria não aparece como card de navegação (ex.: nas
   * páginas /conteudos) — ela só existe como destino de upload no admin, para
   * publicar um material que deve aparecer em TODAS as categorias da trilha.
   */
  ocultaNaNavegacao?: boolean
}

/**
 * Slug especial de categoria: um material cadastrado aqui aparece para todos
 * os anos (1º ao 5º) da trilha de Educação Ambiental, em vez de ficar restrito
 * a um único ano. Ver usuarioPodeAcessarCategoria() e o filtro de listagem em
 * app/conteudos/[trilha]/[categoria]/page.tsx.
 */
export const CATEGORIA_TODOS_OS_ANOS_SLUG = "amb-todos-anos"

export type Material = {
  id: string
  titulo: string
  descricao: string
  tipo: TipoMaterial
  /** Link externo (vídeo, jogo, ou PDF hospedado fora do Storage). Vazio quando o PDF usa storagePath. */
  url: string
  /** Caminho do arquivo no bucket privado "materiais" (upload direto de PDF). */
  storagePath?: string | null
  trilha: string
  categoria: string
  publico: PublicoSlug
  criadoEm: string
}

export type PapelUsuario = "admin" | "professor" | "aluno" | "pai" | "visitante"

/** Quais "públicos" de conteúdo um usuário com este papel pode visualizar. Usado tanto na UI quanto nas rotas de servidor (autorização de URL assinada). */
export function publicosPermitidosParaPapel(papel: PapelUsuario | undefined, publicosDaCategoria: PublicoSlug[]): PublicoSlug[] {
  const p = papel ?? "visitante"
  if (p === "admin" || p === "professor") {
    return publicosDaCategoria
  }
  if (p === "aluno") {
    return publicosDaCategoria.filter((x) => x === "aluno" || x === "crianca")
  }
  if (p === "pai") {
    return publicosDaCategoria.filter((x) => x === "familia" || x === "aluno" || x === "crianca")
  }
  return []
}

/**
 * Confere a restrição de turma/ano (`categoriaId` do perfil, definida em /admin/usuarios).
 * `categoriaId` pode ser "todas" (sem restrição), o slug de uma trilha inteira
 * (ex.: "fundamental-1") ou o slug de uma categoria específica (ex.: "3-ano").
 * Sem essa checagem, um aluno restrito a uma turma conseguia abrir material de
 * qualquer outra turma apenas navegando para a URL correspondente.
 */
export function usuarioPodeAcessarCategoria(
  categoriaIdUsuario: string | null | undefined,
  trilha: string,
  categoria: string,
): boolean {
  if (!categoriaIdUsuario || categoriaIdUsuario === "todas") return true
  if (categoriaIdUsuario === trilha || categoriaIdUsuario === categoria) return true

  // Categoria "todos os anos": libera para quem está restrito a QUALQUER
  // categoria da mesma trilha (ex.: aluno restrito a "amb-3-ano" também vê
  // material publicado em "amb-todos-anos").
  if (categoria === CATEGORIA_TODOS_OS_ANOS_SLUG) {
    return CATEGORIAS.some((c) => c.trilha === trilha && c.slug === categoriaIdUsuario)
  }

  return false
}

export const TRILHAS: Trilha[] = [
  {
    slug: "educacao-infantil",
    nome: "Educação Infantil Neurodivergente",
    descricao: "Berçário, Maternal e Pré-alfabetização com materiais lúdicos e sensoriais.",
    gradient: "from-holo-pink via-holo-lilac to-holo-blue",
    tiposExtras: ["audio"],
  },
  {
    slug: "educacao-infantil-regular",
    nome: "Educação Infantil Regular",
    descricao: "Berçário, Maternal e Pré-alfabetização com materiais lúdicos e sensoriais.",
    gradient: "from-holo-yellow via-holo-mint to-holo-blue",
  },
  {
    slug: "fundamental-1",
    nome: "Ensino Fundamental I Neurodivergente",
    descricao: "Do 1º ao 5º ano, com trilhas para estudante, educador e família.",
    gradient: "from-holo-blue via-holo-mint to-holo-yellow",
    tiposExtras: ["audio"],
  },
  {
    slug: "educacao-ambiental",
    nome: "Educação Ambiental",
    descricao: "Trilha especial de sustentabilidade e consciência ambiental, do 1º ao 5º ano.",
    gradient: "from-emerald-400 via-green-500 to-lime-400",
    badge: "🌱 Novo",
    tiposExtras: ["manual", "projeto"],
  },
]

export const PUBLICOS: Record<PublicoSlug, string> = {
  crianca: "Criança",
  aluno: "Estudante",
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

  // Trilha de Educação Ambiental — categorias com slugs próprios (prefixo "amb-") para
  // não colidir com as categorias de mesmo ano da trilha Fundamental I.
  { slug: "amb-pre-alfabetizacao", nome: "Pré-alfabetização", trilha: "educacao-ambiental", publicos: ["aluno", "educador"] },
  { slug: "amb-1-ano", nome: "1º Ano", trilha: "educacao-ambiental", publicos: ["aluno", "educador"] },
  { slug: "amb-2-ano", nome: "2º Ano", trilha: "educacao-ambiental", publicos: ["aluno", "educador"] },
  { slug: "amb-3-ano", nome: "3º Ano", trilha: "educacao-ambiental", publicos: ["aluno", "educador"] },
  { slug: "amb-4-ano", nome: "4º Ano", trilha: "educacao-ambiental", publicos: ["aluno", "educador"] },
  { slug: "amb-5-ano", nome: "5º Ano", trilha: "educacao-ambiental", publicos: ["aluno", "educador"] },
  {
    slug: CATEGORIA_TODOS_OS_ANOS_SLUG,
    nome: "Todos os anos (1º ao 5º)",
    trilha: "educacao-ambiental",
    publicos: ["aluno", "educador"],
    ocultaNaNavegacao: true,
  },
]

export const TIPOS: { slug: TipoMaterial; label: string }[] = [
  { slug: "pdf", label: "PDFs" },
  { slug: "video", label: "Vídeos" },
  { slug: "jogo", label: "Jogos" },
  { slug: "manual", label: "Manuais" },
  { slug: "projeto", label: "Projetos" },
  { slug: "audio", label: "Áudios" },
]

/** Tipos de material sempre disponíveis, em qualquer trilha. */
export const TIPOS_BASE: TipoMaterial[] = ["pdf", "video", "jogo"]

/**
 * Tipos habilitados para uma trilha específica: os 3 tipos base + os
 * `tiposExtras` daquela trilha (ex.: manual/projeto só na Educação Ambiental,
 * áudio só na Educação Infantil e no Fundamental I). Usado tanto para decidir
 * quais abas de tipo mostrar em /conteudos quanto para validar no servidor
 * que um material não é cadastrado com um tipo fora do lugar.
 */
export function tiposDisponiveisNaTrilha(trilhaSlug: string): TipoMaterial[] {
  const extras = TRILHAS.find((t) => t.slug === trilhaSlug)?.tiposExtras ?? []
  return [...TIPOS_BASE, ...extras]
}

export function getTrilha(slug: string) {
  return TRILHAS.find((t) => t.slug === slug)
}

export function getCategoria(trilha: string, slug: string) {
  return CATEGORIAS.find((c) => c.trilha === trilha && c.slug === slug)
}

/** Categorias navegáveis de uma trilha (esconde categorias especiais de broadcast, ex.: "amb-todos-anos"). */
export function getCategorias(trilha: string) {
  return CATEGORIAS.filter((c) => c.trilha === trilha && !c.ocultaNaNavegacao)
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
