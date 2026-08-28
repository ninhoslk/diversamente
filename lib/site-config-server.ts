import "server-only"

import type { SiteConfig } from "@/lib/site-config"
import { createServerSupabaseClient } from "@/lib/supabase/server"

/**
 * Busca a config de aparência do site no servidor (Server Component), para que
 * a primeira renderização já saia com o texto customizado pelo admin — sem
 * isso, o cliente nasce com CONFIG_PADRAO_SITE e só troca para o texto real
 * depois que o efeito no navegador termina de buscar no Supabase, causando um
 * "flash" do texto antigo por 1-2 segundos a cada carregamento da home.
 * A leitura de site_config é pública (RLS `site_config_select`), então isso
 * funciona mesmo para visitante deslogado.
 */
export async function fetchSiteConfigServidor(): Promise<SiteConfig | null> {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase.from("site_config").select("config").eq("id", "main").single()

    if (!error && data?.config) {
      return data.config as SiteConfig
    }
  } catch {
    // fallback para o padrão local, tratado pelo chamador
  }
  return null
}
