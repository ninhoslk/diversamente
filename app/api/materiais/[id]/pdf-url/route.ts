import { NextResponse } from "next/server"
import { getUsuarioAtual } from "@/lib/supabase/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"
import { getCategoria, publicosPermitidosParaPapel, usuarioPodeAcessarCategoria } from "@/lib/catalog"

// Tempo suficiente para o leitor carregar todas as páginas de um PDF grande
// sem deixar o link utilizável por muito tempo caso seja copiado.
const VALIDADE_SEGUNDOS = 600

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const usuario = await getUsuarioAtual()
  if (!usuario) {
    return NextResponse.json({ ok: false, erro: "É necessário estar logado." }, { status: 401 })
  }

  const { id } = await params
  const admin = createAdminSupabaseClient()

  const { data: material, error } = await admin.from("materials").select("*").eq("id", id).single()

  if (error || !material) {
    return NextResponse.json({ ok: false, erro: "Material não encontrado." }, { status: 404 })
  }

  const tiposComoPdf = ["pdf", "manual", "projeto"]
  if (!tiposComoPdf.includes(material.tipo) || !material.storage_path) {
    return NextResponse.json({ ok: false, erro: "Este material não possui arquivo de PDF." }, { status: 400 })
  }

  const categoria = getCategoria(material.trilha, material.categoria)
  const permitidos = publicosPermitidosParaPapel(usuario.papel, categoria?.publicos ?? [])
  const podeVerPublico = usuario.papel === "admin" || permitidos.includes(material.publico)
  const podeVerCategoria =
    usuario.papel === "admin" || usuarioPodeAcessarCategoria(usuario.categoriaId, material.trilha, material.categoria)

  if (!podeVerPublico || !podeVerCategoria) {
    return NextResponse.json({ ok: false, erro: "Você não tem permissão para ver este material." }, { status: 403 })
  }

  const { data: assinada, error: erroAssinatura } = await admin.storage
    .from("materiais")
    .createSignedUrl(material.storage_path, VALIDADE_SEGUNDOS)

  if (erroAssinatura || !assinada?.signedUrl) {
    return NextResponse.json({ ok: false, erro: "Não foi possível gerar o link de visualização." }, { status: 500 })
  }

  return NextResponse.json({ ok: true, url: assinada.signedUrl, expiraEm: VALIDADE_SEGUNDOS })
}
