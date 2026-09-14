import { NextResponse } from "next/server"
import { getUsuarioAtual } from "@/lib/supabase/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"
import { TIPOS_ATIVIDADE } from "@/lib/atividades"

export async function POST(request: Request) {
  const usuario = await getUsuarioAtual()
  if (!usuario || usuario.papel !== "admin") {
    return NextResponse.json({ ok: false, erro: "Acesso restrito a administradores." }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ ok: false, erro: "Dados inválidos." }, { status: 400 })

  const titulo = String(body.titulo ?? "").trim()
  const descricao = String(body.descricao ?? "").trim()
  const tipo = String(body.tipo ?? "")
  const url = String(body.url ?? "").trim()

  if (!titulo) return NextResponse.json({ ok: false, erro: "Informe o título." }, { status: 400 })
  if (!TIPOS_ATIVIDADE.some((t) => t.slug === tipo)) {
    return NextResponse.json({ ok: false, erro: "Tipo inválido." }, { status: 400 })
  }
  if (!url) return NextResponse.json({ ok: false, erro: "Informe o link do conteúdo." }, { status: 400 })
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== "https:") throw new Error("protocolo inválido")
  } catch {
    return NextResponse.json({ ok: false, erro: "Informe um link https:// válido." }, { status: 400 })
  }

  const admin = createAdminSupabaseClient()
  const { data, error } = await admin
    .from("biblioteca_atividades")
    .insert({ titulo, descricao, tipo, url, created_by: usuario.id })
    .select()
    .single()

  if (error) {
    console.error("Erro ao inserir item da biblioteca de atividades:", error)
    return NextResponse.json({ ok: false, erro: "Não foi possível salvar o item." }, { status: 500 })
  }

  return NextResponse.json({ ok: true, item: data })
}
