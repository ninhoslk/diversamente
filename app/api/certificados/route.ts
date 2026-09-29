import { NextResponse } from "next/server"
import { getUsuarioAtual } from "@/lib/supabase/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"
import { CODIGO_CERTIFICADO_REGEX } from "@/lib/certificados"

export function validarUrlHttps(valor: string) {
  try {
    const parsed = new URL(valor)
    return parsed.protocol === "https:"
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
  const { data, error } = await admin
    .from("certificados")
    .insert({
      codigo,
      titulo: titulo || null,
      imagem_frente_url: imagemFrenteUrl,
      imagem_verso_url: imagemVersoUrl,
      drive_url: driveUrl,
      created_by: usuario.id,
    })
    .select()
    .single()

  if (error) {
    // 23505 = violação de UNIQUE (código já cadastrado).
    if (error.code === "23505") {
      return NextResponse.json({ ok: false, erro: "Já existe um certificado com esse código." }, { status: 409 })
    }
    console.error("Erro ao inserir certificado:", error)
    return NextResponse.json({ ok: false, erro: "Não foi possível salvar o certificado." }, { status: 500 })
  }

  return NextResponse.json({ ok: true, certificado: data })
}
