import { NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"
import { erro, exigirAdmin, linkHttpsValido } from "@/lib/cursos-server"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { negado } = await exigirAdmin()
  if (negado) return negado

  const body = await request.json().catch(() => null)
  if (!body) return erro("Dados inválidos.")

  const titulo = String(body.titulo ?? "").trim()
  const descricao = String(body.descricao ?? "").trim()
  const imagemUrl = String(body.imagemUrl ?? "").trim()

  if (!titulo) return erro("Informe o título.")
  if (imagemUrl && !linkHttpsValido(imagemUrl)) return erro("A imagem precisa ser um link https:// válido.")

  const { id } = await params
  const admin = createAdminSupabaseClient()
  const { error } = await admin.from("cursos").update({ titulo, descricao, imagem_url: imagemUrl || null }).eq("id", id)

  if (error) {
    console.error("Erro ao atualizar curso:", error)
    return erro("Não foi possível atualizar o curso.", 500)
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { negado } = await exigirAdmin()
  if (negado) return negado

  const { id } = await params
  const admin = createAdminSupabaseClient()
  // Módulos, aulas e progresso caem junto via ON DELETE CASCADE.
  const { error } = await admin.from("cursos").delete().eq("id", id)

  if (error) {
    console.error("Erro ao remover curso:", error)
    return erro("Não foi possível remover o curso.", 500)
  }

  return NextResponse.json({ ok: true })
}
