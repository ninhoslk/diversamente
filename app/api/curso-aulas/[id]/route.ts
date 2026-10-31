import { NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"
import { erro, exigirAdmin, lerOrdem, linkHttpsValido } from "@/lib/cursos-server"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { negado } = await exigirAdmin()
  if (negado) return negado

  const body = await request.json().catch(() => null)
  if (!body) return erro("Dados inválidos.")

  const titulo = String(body.titulo ?? "").trim()
  const descricao = String(body.descricao ?? "").trim()
  const videoUrl = String(body.videoUrl ?? "").trim()
  const ordem = lerOrdem(body.ordem)

  if (!titulo) return erro("Informe o título da aula.")
  if (!videoUrl || !linkHttpsValido(videoUrl)) return erro("Informe um link https:// válido para o vídeo.")

  const { id } = await params
  const admin = createAdminSupabaseClient()
  const { error } = await admin
    .from("curso_aulas")
    .update({ titulo, descricao, video_url: videoUrl, ordem })
    .eq("id", id)

  if (error) {
    console.error("Erro ao atualizar aula:", error)
    return erro("Não foi possível atualizar a aula.", 500)
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { negado } = await exigirAdmin()
  if (negado) return negado

  const { id } = await params
  const admin = createAdminSupabaseClient()
  const { error } = await admin.from("curso_aulas").delete().eq("id", id)

  if (error) {
    console.error("Erro ao remover aula:", error)
    return erro("Não foi possível remover a aula.", 500)
  }

  return NextResponse.json({ ok: true })
}
