import { NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"
import { erro, exigirAdmin, lerOrdem } from "@/lib/cursos-server"

export async function POST(request: Request) {
  const { negado } = await exigirAdmin()
  if (negado) return negado

  const body = await request.json().catch(() => null)
  if (!body) return erro("Dados inválidos.")

  const cursoId = String(body.cursoId ?? "")
  const titulo = String(body.titulo ?? "").trim()
  const ordem = lerOrdem(body.ordem)

  if (!cursoId) return erro("Curso não informado.")
  if (!titulo) return erro("Informe o título do módulo.")

  const admin = createAdminSupabaseClient()
  const { data, error } = await admin.from("curso_modulos").insert({ curso_id: cursoId, titulo, ordem }).select().single()

  if (error) {
    console.error("Erro ao inserir módulo:", error)
    return erro("Não foi possível salvar o módulo.", 500)
  }

  return NextResponse.json({ ok: true, modulo: data })
}
