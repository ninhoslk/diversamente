import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site-meta"

// Só as páginas públicas e indexáveis do site institucional. De propósito, NÃO
// inclui /conteudos, /admin nem /entrar — são áreas privadas atrás de login
// (ver robots.ts), então não fazem sentido num sitemap voltado a buscadores.
const ROTAS_PUBLICAS: { caminho: string; prioridade: number; frequencia: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { caminho: "", prioridade: 1, frequencia: "weekly" },
  { caminho: "/quem-somos", prioridade: 0.8, frequencia: "monthly" },
  { caminho: "/autores", prioridade: 0.8, frequencia: "monthly" },
  { caminho: "/mentoria", prioridade: 0.8, frequencia: "monthly" },
  { caminho: "/ajuda", prioridade: 0.6, frequencia: "monthly" },
  { caminho: "/termos-de-uso", prioridade: 0.3, frequencia: "yearly" },
  { caminho: "/politica-de-privacidade", prioridade: 0.3, frequencia: "yearly" },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date()

  return ROTAS_PUBLICAS.map(({ caminho, prioridade, frequencia }) => ({
    url: `${SITE_URL}${caminho}`,
    lastModified: agora,
    changeFrequency: frequencia,
    priority: prioridade,
  }))
}
