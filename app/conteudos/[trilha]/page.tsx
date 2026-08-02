"use client"

import { use } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Folder } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/app/breadcrumbs"
import { getCategorias, getTrilha, PUBLICOS } from "@/lib/catalog"
import { useApp } from "@/lib/app-provider"

export default function TrilhaPage({ params }: { params: Promise<{ trilha: string }> }) {
  const { trilha: trilhaSlug } = use(params)
  const { materiais } = useApp()

  const trilha = getTrilha(trilhaSlug)
  if (!trilha) notFound()

  const categorias = getCategorias(trilhaSlug)

  return (
    <div>
      <Breadcrumbs itens={[{ label: "Conteúdos", href: "/conteudos" }, { label: trilha.nome }]} />

      <header className="flex flex-col gap-3">
        <h1 className="text-pretty text-3xl font-bold tracking-tight sm:text-4xl">{trilha.nome}</h1>
        <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">{trilha.descricao}</p>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categorias.map((categoria) => {
          const total = materiais.filter((m) => m.trilha === trilhaSlug && m.categoria === categoria.slug).length

          return (
            <Card
              key={categoria.slug}
              className="glass group rounded-3xl border p-0 shadow-sm transition-transform hover:-translate-y-1"
            >
              <Link href={`/conteudos/${trilhaSlug}/${categoria.slug}`}>
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
                      <Folder className="size-5 text-primary" aria-hidden="true" />
                    </span>
                    <Badge variant="secondary" className="rounded-full font-normal">
                      {total}
                    </Badge>
                  </div>

                  <h2 className="text-xl font-semibold">{categoria.nome}</h2>

                  <div className="flex flex-wrap gap-1.5">
                    {categoria.publicos.map((p) => (
                      <span key={p} className="rounded-full bg-secondary/80 px-2.5 py-1 text-xs">
                        {PUBLICOS[p]}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Abrir
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </CardContent>
              </Link>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
