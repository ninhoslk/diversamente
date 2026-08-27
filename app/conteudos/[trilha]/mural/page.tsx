"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { MessageSquareHeart } from "lucide-react"
import { Breadcrumbs } from "@/components/app/breadcrumbs"
import { MuralEmbed } from "@/components/mural/mural-embed"
import { getTrilha } from "@/lib/catalog"

// O Mural só existe na trilha de Educação Ambiental — acessar /conteudos/<outra-trilha>/mural
// deve dar 404, assim como qualquer categoria inexistente.
const TRILHA_COM_MURAL = "educacao-ambiental"

export default function MuralDaTrilhaPage({ params }: { params: Promise<{ trilha: string }> }) {
  const { trilha: trilhaSlug } = use(params)

  const trilha = getTrilha(trilhaSlug)
  if (!trilha || trilhaSlug !== TRILHA_COM_MURAL) notFound()

  return (
    <div className="pb-8">
      <Breadcrumbs
        itens={[
          { label: "Material Didático", href: "/conteudos" },
          { label: trilha.nome, href: `/conteudos/${trilhaSlug}` },
          { label: "Mural" },
        ]}
      />

      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-pretty font-serif text-2xl font-bold tracking-tight sm:text-4xl">Mural</h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2.5 py-1 text-xs font-semibold text-red-600 dark:text-red-400">
            <span className="size-1.5 animate-pulse rounded-full bg-red-500" aria-hidden="true" />
            ao vivo
          </span>
        </div>
        <p className="max-w-2xl text-pretty text-sm sm:text-base leading-relaxed text-muted-foreground">
          Espaço colaborativo em tempo real para estudantes, famílias e educadores compartilharem ideias, fotos e
          reflexões sobre Educação Ambiental.
        </p>
      </header>

      <div className="mt-6 sm:mt-8">
        <MuralEmbed />
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <MessageSquareHeart className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
        <span>Powered by Padlet — as postagens são moderadas pela equipe Diversamente.</span>
      </div>
    </div>
  )
}
