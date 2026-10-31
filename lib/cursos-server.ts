import "server-only"

import { NextResponse } from "next/server"
import { getUsuarioAtual } from "@/lib/supabase/server"

/** Retorna o admin logado, ou a resposta 403 pronta para devolver. */
export async function exigirAdmin() {
  const usuario = await getUsuarioAtual()
  if (!usuario || usuario.papel !== "admin") {
    return {
      usuario: null,
      negado: NextResponse.json({ ok: false, erro: "Acesso restrito a administradores." }, { status: 403 }),
    }
  }
  return { usuario, negado: null }
}

export function linkHttpsValido(valor: string) {
  try {
    return new URL(valor).protocol === "https:"
  } catch {
    return false
  }
}

export function erro(mensagem: string, status = 400) {
  return NextResponse.json({ ok: false, erro: mensagem }, { status })
}

export function lerOrdem(valor: unknown) {
  return Number.parseInt(String(valor ?? "0"), 10) || 0
}
