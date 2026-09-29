import { NextResponse } from "next/server"
import { getUsuarioAtual } from "@/lib/supabase/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"
import { CODIGO_CERTIFICADO_REGEX } from "@/lib/certificados"
import { validarUrlHttps } from "../route"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const usuario = await getUsuarioAtual()
  if (!usuario || usuario.papel !== "admin") {
    return NextResponse.json({ ok: false, erro: "Acesso restrito a administradores." }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ ok: false, erro: "Dados inválidos." }, { status: 400 })

  const codigo = String(body.codigo ?? "").trim()
  const titulo = String(body.titulo ?? "").trim()
  const imagemFrenteUrl = String(body.imagemFrenteUrl ?? "").trim()
  const imagemVersoUrl = String(body.imagemVersoUrl ?? "").trim()
  const driveUrl = String(body.driveUrl ?? "").trim()

  if (!CODIGO_CERTIFICADO_REGEX.test(codigo)) {
    return NextResponse.json(
      { ok: false, erro: "Código inválido — use apenas letras, números e hífen (3 a 80 caracteres)." },
      { status: 400 },
    )
  }
  if (!validarUrlHttps(imagemFrenteUrl)) {
    return NextResponse.json({ ok: false, erro: "Informe um link https:// válido para a imagem de frente." }, { status: 400 })
  }
  if (!validarUrlHttps(imagemVersoUrl)) {
    return NextResponse.json({ ok: false, erro: "Informe um link https:// válido para a imagem de verso." }, { status: 400 })
  }
  if (!validarUrlHttps(driveUrl)) {
    return NextResponse.json({ ok: false, erro: "Informe um link https:// válido do Google Drive." }, { status: 400 })
  }

  const admin = createAdminSupabaseClient()

  const { data: certificadoAtual, error: erroBusca } = await admin
    .from("certificados")
    .select("id")
    .eq("id", id)
    .single()

  if (erroBusca || !certificadoAtual) {
    return NextResponse.json({ ok: false, erro: "Certificado não encontrado." }, { status: 404 })
  }

  // Atualiza pelo id (nunca cria um registro novo nem troca o id/criador
  // existente) — a própria constraint UNIQUE de "codigo" no banco garante,
  // de forma atômica, que a troca de chave não colida com outro certificado
  // já existente (inclusive sob requisições concorrentes); manter o mesmo
  // código do próprio certificado não conflita, pois nenhum OUTRO registro
  // possui esse valor.
  const { data, error } = await admin
    .from("certificados")
    .update({
      codigo,
      titulo: titulo || null,
      imagem_frente_url: imagemFrenteUrl,
      imagem_verso_url: imagemVersoUrl,
      drive_url: driveUrl,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    // 23505 = violação de UNIQUE (código já usado por outro certificado).
    if (error.code === "23505") {
      return NextResponse.json({ ok: false, erro: "Já existe um certificado com esse código." }, { status: 409 })
    }
    console.error("Erro ao atualizar certificado:", error)
    return NextResponse.json({ ok: false, erro: "Não foi possível salvar as alterações." }, { status: 500 })
  }

  return NextResponse.json({ ok: true, certificado: data })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const usuario = await getUsuarioAtual()
  if (!usuario || usuario.papel !== "admin") {
    return NextResponse.json({ ok: false, erro: "Acesso restrito a administradores." }, { status: 403 })
  }

  const { id } = await params
  const admin = createAdminSupabaseClient()
  const { error } = await admin.from("certificados").delete().eq("id", id)

  if (error) {
    console.error("Erro ao remover certificado:", error)
    return NextResponse.json({ ok: false, erro: "Não foi possível remover o certificado." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
