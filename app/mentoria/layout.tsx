import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Formação para Escolas e Educadores",
  description:
    "Palestras, cursos, oficinas e assessoria contínua para escolas e educadores, fundamentados na Neurociência Cognitiva e na Educação Inclusiva.",
}

export default function MentoriaLayout({ children }: { children: React.ReactNode }) {
  return children
}
