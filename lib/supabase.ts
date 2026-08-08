import type { SiteConfig } from "@/lib/site-config"
import { createClient } from "@/lib/supabase/client"

// Configuração de aparência do site (Elementor). Leitura é pública (RLS `site_config_select`);
// a escrita passa pela política `site_config_write`, que só aceita administradores.
export async function fetchSupabaseSiteConfig(): Promise<SiteConfig | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("site_config").select("config").eq("id", "main").single()

    if (!error && data?.config) {
      return data.config as SiteConfig
    }
  } catch {
    // fallback
  }
  return null
}

export async function saveSupabaseSiteConfig(config: SiteConfig): Promise<boolean> {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from("site_config")
      .upsert({ id: "main", config, updated_at: new Date().toISOString() })

    return !error
  } catch {
    return false
  }
}
