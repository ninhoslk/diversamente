import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quem Somos",
  description:
    "Conheça a missão, a visão, os valores e a história da equipe pedagógica por trás da Diversamente.",
}

export default function QuemSomosLayout({ children }: { children: React.ReactNode }) {
  return children
}
