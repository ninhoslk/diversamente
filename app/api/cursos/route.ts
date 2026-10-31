import { NextResponse } from "next/server"
import { getUsuarioAtual } from "@/lib/supabase/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"

function linkHttpsValido(valor: string) {
  try {
    return new URL(valor).protocol === "https:"
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  const usuario = await getUsuarioAtual()
  if (!usuario || usuario.papel !== "admin") {
    return NextResponse.json({ ok: false, erro: "Acesso restrito a administradores." }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ ok: false, erro: "Dados inválidos." }, { status: 400 })

  const titulo = String(body.titulo ?? "").trim()
  const descricao = String(body.descricao ?? "").trim()
  const imagemUrl = String(body.imagemUrl ?? "").trim()
  const url = String(body.url ?? "").trim()

  if (!titulo) return NextResponse.json({ ok: false, erro: "Informe o título." }, { status: 400 })
  if (!url || !linkHttpsValido(url)) {
    return NextResponse.json({ ok: false, erro: "Informe um link https:// válido para o curso." }, { status: 400 })
  }
  if (imagemUrl && !linkHttpsValido(imagemUrl)) {
    return NextResponse.json({ ok: false, erro: "A imagem precisa ser um link https:// válido." }, { status: 400 })
  }

  const admin = createAdminSupabaseClient()
  const { data, error } = await admin
    .from("cursos")
    .insert({ titulo, descricao, imagem_url: imagemUrl || null, url, created_by: usuario.id })
    .select()
    .single()

  if (error) {
    console.error("Erro ao inserir curso:", error)
    return NextResponse.json({ ok: false, erro: "Não foi possível salvar o curso." }, { status: 500 })
  }

  return NextResponse.json({ ok: true, curso: data })
}
