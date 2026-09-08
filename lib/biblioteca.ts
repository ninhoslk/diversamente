export type TipoBiblioteca = "artigo" | "folheto" | "livro" | "outro"

export type ItemBiblioteca = {
  id: string
  titulo: string
  descricao: string
  tipo: TipoBiblioteca
  url: string
  criadoEm: string
}

export const TIPOS_BIBLIOTECA: { slug: TipoBiblioteca; label: string }[] = [
  { slug: "artigo", label: "Artigo" },
  { slug: "folheto", label: "Folheto" },
  { slug: "livro", label: "Livro" },
  { slug: "outro", label: "Outro" },
]
