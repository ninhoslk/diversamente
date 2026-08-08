"use client"

import { createBrowserClient } from "@supabase/ssr"
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env"

let browserClient: ReturnType<typeof createBrowserClient> | null = null

/** Cliente Supabase do navegador. Usa a chave anônima e respeita as políticas de RLS do usuário logado. */
export function createClient() {
  if (!browserClient) {
    browserClient = createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey())
  }
  return browserClient
}
