import { NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"
import { erro, exigirAdmin, lerOrdem, linkHttpsValido } from "@/lib/cursos-server"

export async function POST(request: Request) {
  const { negado } = await exigirAdmin()
  if (negado) return negado

  const body = await request.json().catch(() => null)
  if (!body) return erro("Dados inválidos.")

  const moduloId = String(body.moduloId ?? "")
  const titulo = String(body.titulo ?? "").trim()
  const descricao = String(body.descricao ?? "").trim()
  const videoUrl = String(body.videoUrl ?? "").trim()
  const ordem = lerOrdem(body.ordem)

  if (!moduloId) return erro("Módulo não informado.")
  if (!titulo) return erro("Informe o título da aula.")
  if (!videoUrl || !linkHttpsValido(videoUrl)) return erro("Informe um link https:// válido para o vídeo.")

  const admin = createAdminSupabaseClient()
  const { data, error } = await admin
    .from("curso_aulas")
    .insert({ modulo_id: moduloId, titulo, descricao, video_url: videoUrl, ordem })
    .select()
    .single()

  if (error) {
    console.error("Erro ao inserir aula:", error)
    return erro("Não foi possível salvar a aula.", 500)
  }

  return NextResponse.json({ ok: true, aula: data })
}
