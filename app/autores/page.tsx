"use client"

import type { Metadata } from "next"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { PageShell } from "@/components/site/page-shell"
import { useApp } from "@/lib/app-provider"

export default function AutoresPage() {
  const { siteConfig } = useApp()
  const { autores: configAutores } = siteConfig

  return (
    <PageShell
      titulo={configAutores.titulo}
      subtitulo={configAutores.subtitulo}
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {configAutores.autores.map((autor) => (
          <Card key={autor.id} className="glass overflow-hidden rounded-3xl border pt-0 shadow-sm transition-transform hover:-translate-y-1">
            <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
              {autor.foto ? (
                <Image
                  src={autor.foto}
                  alt={`Retrato de ${autor.nome}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">Sem imagem</div>
              )}
            </div>
            <CardContent className="flex flex-col gap-3 p-6">
              <div className="flex flex-col gap-0.5">
                <h2 className="text-lg font-semibold">{autor.nome}</h2>
                <p className="text-sm text-primary">{autor.cargo}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {autor.especialidades.map((tag) => (
                  <Badge key={tag} variant="secondary" className="rounded-full font-normal">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{autor.bio}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="glass-strong mt-12 rounded-4xl border p-8 sm:p-12">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{configAutores.secaoFinalTitulo}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {configAutores.secaoFinalTexto}
        </p>
      </section>
    </PageShell>
  )
}
