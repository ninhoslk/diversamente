"use client"

import { User } from "lucide-react"
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
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {configAutores.autores.map((autor, index) => (
          <Card
            key={autor.id || index}
            className="group overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
          >
            <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
              {autor.foto ? (
                <img
                  src={autor.foto}
                  alt={`Retrato de ${autor.nome}`}
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-103"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <User className="size-10 opacity-40" />
                  <span className="text-xs">Sem foto</span>
                </div>
              )}
            </div>

            <CardContent className="flex flex-col gap-3 p-6">
              <div className="flex flex-col gap-1">
                <h2 className="font-serif text-xl font-bold text-foreground">
                  {autor.nome}
                </h2>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {autor.cargo}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {autor.bio}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="mt-14 rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-xs">
        <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">{configAutores.secaoFinalTitulo}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {configAutores.secaoFinalTexto}
        </p>
      </section>
    </PageShell>
  )
}
