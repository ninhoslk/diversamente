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
