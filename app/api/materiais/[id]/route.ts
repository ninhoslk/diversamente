import { NextResponse } from "next/server"
import { getUsuarioAtual } from "@/lib/supabase/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"
import { validarDestino } from "../route"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const usuario = await getUsuarioAtual()
  if (!usuario || usuario.papel !== "admin") {
    return NextResponse.json({ ok: false, erro: "Acesso restrito a administradores." }, { status: 403 })
  }

  const { id } = await params
  const admin = createAdminSupabaseClient()

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ ok: false, erro: "Dados inválidos." }, { status: 400 })

  const titulo = String(body.titulo ?? "").trim()
  const descricao = String(body.descricao ?? "").trim()
  const trilha = String(body.trilha ?? "")
  const categoria = String(body.categoria ?? "")
  const publico = String(body.publico ?? "")
  const url = typeof body.url === "string" ? body.url.trim() : ""

  if (!titulo) return NextResponse.json({ ok: false, erro: "Informe o título do material." }, { status: 400 })

  const erroDestino = validarDestino(trilha, categoria, publico)
  if (erroDestino) return NextResponse.json({ ok: false, erro: erroDestino }, { status: 400 })

  const { data: materialAtual, error: erroBusca } = await admin
    .from("materials")
    .select("storage_path")
    .eq("id", id)
    .single()

  if (erroBusca || !materialAtual) {
    return NextResponse.json({ ok: false, erro: "Material não encontrado." }, { status: 404 })
  }

  const atualizacao: Record<string, unknown> = { titulo, descricao, trilha, categoria, publico }

  // Materiais sem arquivo no Storage (vídeo, jogo, ou PDF cadastrado por link) têm a URL editável.
  // Um PDF já enviado como arquivo (storage_path preenchido) não tem campo de link para trocar aqui.
  if (!materialAtual.storage_path) {
    if (!url) return NextResponse.json({ ok: false, erro: "Informe o link do material." }, { status: 400 })
    try {
      const parsed = new URL(url)
      if (parsed.protocol !== "https:") throw new Error("protocolo inválido")
    } catch {
      return NextResponse.json({ ok: false, erro: "Informe um link https:// válido." }, { status: 400 })
    }
    atualizacao.url = url
  }

  const { data: materialAtualizado, error: erroUpdate } = await admin
    .from("materials")
    .update(atualizacao)
    .eq("id", id)
    .select()
    .single()

  if (erroUpdate) {
    return NextResponse.json({ ok: false, erro: "Não foi possível salvar as alterações." }, { status: 500 })
  }

  return NextResponse.json({ ok: true, material: materialAtualizado })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const usuario = await getUsuarioAtual()
  if (!usuario || usuario.papel !== "admin") {
    return NextResponse.json({ ok: false, erro: "Acesso restrito a administradores." }, { status: 403 })
  }

  const { id } = await params
  const admin = createAdminSupabaseClient()

  const { data: material, error: erroBusca } = await admin
    .from("materials")
    .select("storage_path")
    .eq("id", id)
    .single()

  if (erroBusca || !material) {
    return NextResponse.json({ ok: false, erro: "Material não encontrado." }, { status: 404 })
  }

  const { error: erroDelete } = await admin.from("materials").delete().eq("id", id)
  if (erroDelete) {
    return NextResponse.json({ ok: false, erro: "Não foi possível remover o material." }, { status: 500 })
  }

  if (material.storage_path) {
    await admin.storage.from("materiais").remove([material.storage_path])
  }

  return NextResponse.json({ ok: true })
}
