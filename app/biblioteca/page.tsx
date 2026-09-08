"use client"

import { AlertTriangle, BookOpen, ExternalLink, FileText, Inbox, Newspaper } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/app/breadcrumbs"
import { TIPOS_BIBLIOTECA, type TipoBiblioteca } from "@/lib/biblioteca"
import { useApp } from "@/lib/app-provider"

const ICONES: Record<TipoBiblioteca, typeof FileText> = {
  artigo: Newspaper,
  folheto: FileText,
  livro: BookOpen,
  outro: FileText,
}

export default function BibliotecaPage() {
  const { bibliotecaItens, carregandoBiblioteca, erroBiblioteca } = useApp()

  return (
    <div className="pb-8">
      <Breadcrumbs itens={[{ label: "Biblioteca Digital" }]} />

      <header className="flex flex-col gap-3">
        <h1 className="text-pretty text-3xl font-bold tracking-tight sm:text-4xl">Biblioteca Digital</h1>
        <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Artigos, folhetos e livros escritos pela Coleção Diversamente, disponíveis para consulta de estudantes,
          educadores e famílias.
        </p>
      </header>

      {erroBiblioteca ? (
        <div
          role="alert"
          className="mt-6 flex items-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
          {erroBiblioteca}
        </div>
      ) : null}

      <div className="mt-8">
        {carregandoBiblioteca ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-3xl bg-card/60" />
            ))}
          </div>
        ) : bibliotecaItens.length === 0 ? (
          <div className="glass flex flex-col items-center gap-3 rounded-3xl border p-8 sm:p-12 text-center">
            <Inbox className="size-8 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">Nenhum conteúdo publicado na biblioteca digital ainda.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bibliotecaItens.map((item) => {
              const Icone = ICONES[item.tipo] ?? FileText
              const label = TIPOS_BIBLIOTECA.find((t) => t.slug === item.tipo)?.label ?? item.tipo
              return (
                <Card
                  key={item.id}
                  className="glass group rounded-3xl border p-0 shadow-sm transition-transform hover:-translate-y-1"
                >
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                    aria-label={`Abrir ${item.titulo}`}
                  >
                    <CardContent className="flex h-full flex-col gap-3 p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
                          <Icone className="size-5 text-primary" aria-hidden="true" />
                        </span>
                        <Badge variant="secondary" className="rounded-full text-xs font-normal">
                          {label}
                        </Badge>
                      </div>
                      <h2 className="text-pretty font-semibold leading-snug text-base sm:text-lg">{item.titulo}</h2>
                      {item.descricao ? (
                        <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">{item.descricao}</p>
                      ) : null}
                      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                        Abrir
                        <ExternalLink className="size-3.5" aria-hidden="true" />
                      </span>
                    </CardContent>
                  </a>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
