import "server-only"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env"

/**
 * Cliente Supabase para uso em Server Components / Route Handlers.
 * Usa a chave anônima e a sessão do usuário via cookies — todas as
 * operações continuam sujeitas às políticas de RLS do banco.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        } catch {
          // chamado a partir de um Server Component sem permissão de escrita — middleware cuida do refresh
        }
      },
    },
  })
}

/** Retorna o usuário autenticado (via cookie de sessão) e seu perfil (papel/categoria), ou null. */
export async function getUsuarioAtual() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: perfil } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!perfil) return null

  return {
    id: user.id,
    email: perfil.email as string,
    nome: perfil.nome as string,
    papel: perfil.papel as "admin" | "professor" | "aluno" | "pai" | "visitante",
    categoriaId: perfil.categoria_id as string | null,
    categoriaNome: perfil.categoria_nome as string | null,
  }
}
