import { NextResponse } from "next/server"
import { getUsuarioAtual } from "@/lib/supabase/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"

const PAPEIS_VALIDOS = ["admin", "professor", "aluno", "pai", "visitante"]

export async function GET() {
  const usuario = await getUsuarioAtual()
  if (!usuario || usuario.papel !== "admin") {
    return NextResponse.json({ ok: false, erro: "Acesso restrito a administradores." }, { status: 403 })
  }

  const admin = createAdminSupabaseClient()
  const { data, error } = await admin.from("profiles").select("*").order("created_at", { ascending: true })

  if (error) {
    return NextResponse.json({ ok: false, erro: "Não foi possível carregar os usuários." }, { status: 500 })
  }

  const usuarios = (data ?? []).map((p) => ({
    id: p.id,
    nome: p.nome,
    email: p.email,
    papel: p.papel,
    categoriaId: p.categoria_id,
    categoriaNome: p.categoria_nome,
    criadoEm: p.created_at,
  }))

  return NextResponse.json({ ok: true, usuarios })
}

export async function POST(request: Request) {
  const usuario = await getUsuarioAtual()
  if (!usuario || usuario.papel !== "admin") {
    return NextResponse.json({ ok: false, erro: "Acesso restrito a administradores." }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ ok: false, erro: "Requisição inválida." }, { status: 400 })

  const nome = String(body.nome ?? "").trim()
  const email = String(body.email ?? "").trim().toLowerCase()
  const senha = String(body.senha ?? "")
  const papel = String(body.papel ?? "")
  const categoriaId = body.categoriaId ? String(body.categoriaId) : "todas"
  const categoriaNome = body.categoriaNome ? String(body.categoriaNome) : "Todas as salas / anos"

  if (!nome) return NextResponse.json({ ok: false, erro: "Informe o nome completo." }, { status: 400 })
  if (!email) return NextResponse.json({ ok: false, erro: "Informe o e-mail de acesso." }, { status: 400 })
  if (senha.length < 6) return NextResponse.json({ ok: false, erro: "A senha deve ter no mínimo 6 caracteres." }, { status: 400 })
  if (!PAPEIS_VALIDOS.includes(papel)) return NextResponse.json({ ok: false, erro: "Papel inválido." }, { status: 400 })

  const admin = createAdminSupabaseClient()

  const { data: criado, error: erroCriacao } = await admin.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
    user_metadata: { nome },
  })

  if (erroCriacao || !criado?.user) {
    const jaExiste = erroCriacao?.message?.toLowerCase().includes("already")
    return NextResponse.json(
      { ok: false, erro: jaExiste ? "Este e-mail já está cadastrado na plataforma." : "Não foi possível cadastrar o usuário." },
      { status: jaExiste ? 409 : 500 },
    )
  }

  const { error: erroPerfil } = await admin.from("profiles").upsert({
    id: criado.user.id,
    nome,
    email,
    papel,
    categoria_id: categoriaId,
    categoria_nome: categoriaNome,
  })

  if (erroPerfil) {
    await admin.auth.admin.deleteUser(criado.user.id)
    return NextResponse.json({ ok: false, erro: "Não foi possível salvar o perfil do usuário." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
