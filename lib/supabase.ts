import { createClient } from "@supabase/supabase-js"
import type { SiteConfig } from "@/lib/site-config"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cgixormdpoqadwxtlycb.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnaXhvcm1kcG9xYWR3eHRseWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3MDE1MTEsImV4cCI6MjEwMTI3NzUxMX0.4gHQfGZtOecs8kmKgNJ6y469jokQyGJZVm2vNyr-S2M"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
