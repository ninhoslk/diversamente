import { NextResponse } from "next/server"
import { getUsuarioAtual } from "@/lib/supabase/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const usuario = await getUsuarioAtual()
  if (!usuario || usuario.papel !== "admin") {
    return NextResponse.json({ ok: false, erro: "Acesso restrito a administradores." }, { status: 403 })
  }

  const { id } = await params
  const admin = createAdminSupabaseClient()
  const { error } = await admin.from("biblioteca_atividades").delete().eq("id", id)

  if (error) {
    console.error("Erro ao remover item da biblioteca de atividades:", error)
    return NextResponse.json({ ok: false, erro: "Não foi possível remover o item." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
