"use client"

import { AlertTriangle, ExternalLink, GraduationCap, Inbox } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/app/breadcrumbs"
import { useApp } from "@/lib/app-provider"

export default function CursosPage() {
  const { cursos, carregandoCursos, erroCursos } = useApp()

  return (
    <div className="pb-8">
      <Breadcrumbs itens={[{ label: "Cursos" }]} />

      <header className="flex flex-col gap-3">
        <h1 className="text-pretty text-3xl font-bold tracking-tight sm:text-4xl">Cursos</h1>
        <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Cursos da Coleção Diversamente para educadores, famílias e estudantes. Ao clicar em um curso você será
          levado direto para a página dele.
        </p>
      </header>

      {erroCursos ? (
        <div
          role="alert"
          className="mt-6 flex items-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
          {erroCursos}
        </div>
      ) : null}

      <div className="mt-8">
        {carregandoCursos ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-3xl bg-card/60" />
            ))}
          </div>
        ) : cursos.length === 0 ? (
          <div className="glass flex flex-col items-center gap-3 rounded-3xl border p-8 sm:p-12 text-center">
            <Inbox className="size-8 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">Nenhum curso publicado ainda.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cursos.map((curso) => (
              <Card
                key={curso.id}
                className="glass group overflow-hidden rounded-3xl border p-0 shadow-sm transition-transform hover:-translate-y-1"
              >
                <a
                  href={curso.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full flex-col"
                  aria-label={`Acessar o curso ${curso.titulo}`}
                >
                  <div className="aspect-video w-full overflow-hidden bg-primary/10">
                    {curso.imagemUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={curso.imagemUrl}
                        alt={`Capa do curso ${curso.titulo}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <GraduationCap className="size-10 text-primary/60" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <CardContent className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
                    <h2 className="text-pretty font-semibold leading-snug text-base sm:text-lg">{curso.titulo}</h2>
                    {curso.descricao ? (
                      <p className="line-clamp-4 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        {curso.descricao}
                      </p>
                    ) : null}
                    <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      Acessar curso
                      <ExternalLink className="size-3.5" aria-hidden="true" />
                    </span>
                  </CardContent>
                </a>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
