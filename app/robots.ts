import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site-meta"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Áreas privadas atrás de login (RouteGuard) e rotas técnicas — não têm
      // conteúdo público para indexar e não devem aparecer em resultados de busca.
      disallow: ["/conteudos", "/admin", "/entrar", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
