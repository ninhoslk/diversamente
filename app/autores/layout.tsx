import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Autores",
  description:
    "Conheça os educadores e especialistas que assinam os materiais pedagógicos da plataforma Diversamente.",
}

export default function AutoresLayout({ children }: { children: React.ReactNode }) {
  return children
}
