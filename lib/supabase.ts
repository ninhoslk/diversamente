import { createClient } from "@supabase/supabase-js"
import type { SiteConfig } from "@/lib/site-config"
import type { Material } from "@/lib/catalog"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cgixormdpoqadwxtlycb.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnaXhvcm1kcG9xYWR3eHRseWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3MDE1MTEsImV4cCI6MjEwMTI3NzUxMX0.4gHQfGZtOecs8kmKgNJ6y469jokQyGJZVm2vNyr-S2M"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 1. Busca configuracao de layout (Elementor)
export async function fetchSupabaseSiteConfig(): Promise<SiteConfig | null> {
  try {
    const { data, error } = await supabase
      .from("site_config")
      .select("config")
      .eq("id", "main")
      .single()

    if (!error && data?.config) {
      return data.config as SiteConfig
    }
  } catch {
    // fallback
  }
  return null
}

// 2. Salva configuracao de layout (Elementor)
export async function saveSupabaseSiteConfig(config: SiteConfig): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("site_config")
      .upsert({ id: "main", config, updated_at: new Date().toISOString() })

    return !error
  } catch {
    return false
  }
}

// 3. Busca lista global de materiais (PDFs, videos, jogos)
export async function fetchSupabaseMateriais(): Promise<Material[] | null> {
  try {
    const { data, error } = await supabase
      .from("site_config")
      .select("config")
      .eq("id", "materiais")
      .single()

    if (!error && data?.config && Array.isArray(data.config)) {
      return data.config as Material[]
    }
  } catch {
    // fallback
  }
  return null
}

// 4. Salva lista global de materiais (PDFs, videos, jogos)
export async function saveSupabaseMateriais(materiais: Material[]): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("site_config")
      .upsert({ id: "materiais", config: materiais, updated_at: new Date().toISOString() })

    return !error
  } catch {
    return false
  }
}

// 5. Escuta atualizacoes em tempo real (Realtime) para sincronizar entre todos os navegadores
export function inscreverSupabaseRealtime(
  onConfigChange: (config: SiteConfig) => void,
  onMateriaisChange: (materiais: Material[]) => void
) {
  try {
    const canal = supabase
      .channel("site_config_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_config" },
        (payload) => {
          if (payload.new && typeof payload.new === "object" && "id" in payload.new) {
            const registro = payload.new as { id: string; config: unknown }
            if (registro.id === "main" && registro.config) {
              onConfigChange(registro.config as SiteConfig)
            } else if (registro.id === "materiais" && Array.isArray(registro.config)) {
              onMateriaisChange(registro.config as Material[])
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(canal)
    }
  } catch {
    return () => {}
  }
}
