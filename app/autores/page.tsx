"use client"

import { User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { PageShell } from "@/components/site/page-shell"
import { useApp } from "@/lib/app-provider"

export default function AutoresPage() {
  const { siteConfig, carregando } = useApp()
  const { autores: configAutores } = siteConfig

  if (carregando) {
    return (
      <PageShell titulo={configAutores.titulo} subtitulo={configAutores.subtitulo}>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="overflow-hidden rounded-3xl border border-border/60 pt-0 shadow-sm">
              <div className="aspect-4/3 w-full animate-pulse bg-muted/50" />
              <CardContent className="flex flex-col gap-3 p-6">
                <div className="h-5 w-2/3 animate-pulse rounded bg-muted/50" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-muted/50" />
                <div className="h-12 w-full animate-pulse rounded bg-muted/50" />
              </CardContent>
            </Card>
          ))}
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell
      titulo={configAutores.titulo}
      subtitulo={configAutores.subtitulo}
    >
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {configAutores.autores.map((autor, index) => (
          <Card
            key={autor.id || index}
            className="group glass overflow-hidden rounded-3xl border border-border/60 pt-0 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/40 hover:bg-card/90"
          >
            <div className="relative aspect-4/3 w-full overflow-hidden bg-muted/50">
              {autor.foto ? (
                <img
                  src={autor.foto}
                  alt={`Retrato de ${autor.nome}`}
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <User className="size-10 opacity-40" />
                  <span className="text-xs">Sem foto</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            <CardContent className="flex flex-col gap-3 p-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold tracking-tight transition-colors group-hover:text-primary">
                  {autor.nome}
                </h2>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary/90">
                  {autor.cargo}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground/90">
                {autor.bio}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="glass-strong mt-14 rounded-4xl border p-8 sm:p-12 shadow-sm transition-all duration-300 hover:border-primary/30">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{configAutores.secaoFinalTitulo}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {configAutores.secaoFinalTexto}
        </p>
      </section>
    </PageShell>
  )
}


