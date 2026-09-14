export type TipoAtividade = "video" | "link"

export type ItemAtividade = {
  id: string
  titulo: string
  descricao: string
  tipo: TipoAtividade
  url: string
  criadoEm: string
}

export const TIPOS_ATIVIDADE: { slug: TipoAtividade; label: string }[] = [
  { slug: "video", label: "Vídeo" },
  { slug: "link", label: "Link" },
]
