import { NextResponse } from "next/server"
import { getUsuarioAtual } from "@/lib/supabase/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"
import { CATEGORIAS, TRILHAS } from "@/lib/catalog"

function sanitizarNomeArquivo(nome: string) {
  return nome.replace(/[^a-zA-Z0-9.\-_]/g, "_").slice(-140)
}

/**
 * Gera uma URL assinada para upload direto do navegador ao Supabase Storage,
 * contornando o limite de payload da função serverless (413 em uploads grandes
 * quando o arquivo passa pela rota /api/materiais).
 */
export async function POST(request: Request) {
  const usuario = await getUsuarioAtual()
  if (!usuario || usuario.papel !== "admin") {
    return NextResponse.json({ ok: false, erro: "Acesso restrito a administradores." }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ ok: false, erro: "Dados inválidos." }, { status: 400 })

  const trilha = String(body.trilha ?? "")
  const categoria = String(body.categoria ?? "")
  const nomeArquivo = String(body.nomeArquivo ?? "arquivo.pdf")

  const trilhaValida = TRILHAS.some((t) => t.slug === trilha)
  const categoriaValida = CATEGORIAS.some((c) => c.slug === categoria && c.trilha === trilha)
  if (!trilhaValida || !categoriaValida) {
    return NextResponse.json({ ok: false, erro: "Trilha ou categoria inválida." }, { status: 400 })
  }

  const admin = createAdminSupabaseClient()
  const path = `${trilha}/${categoria}/${Date.now()}_${sanitizarNomeArquivo(nomeArquivo)}`

  const { data, error } = await admin.storage.from("materiais").createSignedUploadUrl(path)

  if (error || !data) {
    return NextResponse.json({ ok: false, erro: "Não foi possível preparar o upload." }, { status: 500 })
  }

  return NextResponse.json({ ok: true, path: data.path, token: data.token })
}
