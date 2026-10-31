import { NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"
import { erro, exigirAdmin, lerOrdem } from "@/lib/cursos-server"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { negado } = await exigirAdmin()
  if (negado) return negado

  const body = await request.json().catch(() => null)
  if (!body) return erro("Dados inválidos.")

  const titulo = String(body.titulo ?? "").trim()
  const ordem = lerOrdem(body.ordem)
  if (!titulo) return erro("Informe o título do módulo.")

  const { id } = await params
  const admin = createAdminSupabaseClient()
  const { error } = await admin.from("curso_modulos").update({ titulo, ordem }).eq("id", id)

  if (error) {
    console.error("Erro ao atualizar módulo:", error)
    return erro("Não foi possível atualizar o módulo.", 500)
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { negado } = await exigirAdmin()
  if (negado) return negado

  const { id } = await params
  const admin = createAdminSupabaseClient()
  // As aulas do módulo (e o progresso delas) caem junto via ON DELETE CASCADE.
  const { error } = await admin.from("curso_modulos").delete().eq("id", id)

  if (error) {
    console.error("Erro ao remover módulo:", error)
    return erro("Não foi possível remover o módulo.", 500)
  }

  return NextResponse.json({ ok: true })
}
