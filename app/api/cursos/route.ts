import { NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"
import { erro, exigirAdmin, linkHttpsValido } from "@/lib/cursos-server"

export async function POST(request: Request) {
  const { usuario, negado } = await exigirAdmin()
  if (negado) return negado

  const body = await request.json().catch(() => null)
  if (!body) return erro("Dados inválidos.")

  const titulo = String(body.titulo ?? "").trim()
  const descricao = String(body.descricao ?? "").trim()
  const imagemUrl = String(body.imagemUrl ?? "").trim()

  if (!titulo) return erro("Informe o título.")
  if (imagemUrl && !linkHttpsValido(imagemUrl)) return erro("A imagem precisa ser um link https:// válido.")

  const admin = createAdminSupabaseClient()
  const { data, error } = await admin
    .from("cursos")
    .insert({ titulo, descricao, imagem_url: imagemUrl || null, created_by: usuario.id })
    .select()
    .single()

  if (error) {
    console.error("Erro ao inserir curso:", error)
    return erro("Não foi possível salvar o curso.", 500)
  }

  return NextResponse.json({ ok: true, curso: data })
}
