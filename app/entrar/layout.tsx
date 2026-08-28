import type { Metadata } from "next"

// Página transacional de login — sem conteúdo de valor para buscadores.
export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
}

export default function EntrarLayout({ children }: { children: React.ReactNode }) {
  return children
}
