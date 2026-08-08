import { NextResponse } from "next/server"
import { getUsuarioAtual } from "@/lib/supabase/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const usuario = await getUsuarioAtual()
  if (!usuario || usuario.papel !== "admin") {
    return NextResponse.json({ ok: false, erro: "Acesso restrito a administradores." }, { status: 403 })
  }

  const { id } = await params
  if (id === usuario.id) {
    return NextResponse.json({ ok: false, erro: "Você não pode remover a própria conta de administrador." }, { status: 400 })
  }

  const admin = createAdminSupabaseClient()
  const { error } = await admin.auth.admin.deleteUser(id)

  if (error) {
    return NextResponse.json({ ok: false, erro: "Não foi possível remover o usuário." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
