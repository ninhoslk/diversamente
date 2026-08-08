import "server-only"

import { createClient } from "@supabase/supabase-js"
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/env"

/**
 * Cliente com a chave service_role: ignora RLS.
 * NUNCA importar este módulo em código de cliente ("use client") ou expor a chave.
 * Só deve ser usado dentro de Route Handlers (app/api/**\/route.ts) após uma
 * verificação explícita de que o usuário autenticado é administrador.
 */
export function createAdminSupabaseClient() {
  return createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
