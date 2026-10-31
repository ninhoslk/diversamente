"use client"

import Link from "next/link"
import { AlertTriangle, CheckCircle2, GraduationCap, Inbox, PlayCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/app/breadcrumbs"
import { BarraProgresso } from "@/components/app/barra-progresso"
import { percentualAssistido } from "@/lib/cursos"
import { useApp } from "@/lib/app-provider"
import { useCursosConteudo } from "@/lib/use-cursos-conteudo"

export default function CursosPage() {
  const { cursos, carregandoCursos, erroCursos } = useApp()
  const { aulasDoCurso, modulosDoCurso, assistidas, carregando: carregandoConteudo } = useCursosConteudo()

  return (
    <div className="pb-8">
      <Breadcrumbs itens={[{ label: "Cursos" }]} />

      <header className="flex flex-col gap-3">
        <h1 className="text-pretty text-3xl font-bold tracking-tight sm:text-4xl">Cursos</h1>
        <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Cursos da Coleção Diversamente para educadores, famílias e estudantes. Assista módulo por módulo e acompanhe
          quanto do curso você já concluiu.
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
              <div key={i} className="h-80 animate-pulse rounded-3xl bg-card/60" />
            ))}
          </div>
        ) : cursos.length === 0 ? (
          <div className="glass flex flex-col items-center gap-3 rounded-3xl border p-8 sm:p-12 text-center">
            <Inbox className="size-8 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">Nenhum curso publicado ainda.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cursos.map((curso) => {
              const aulas = aulasDoCurso(curso.id)
              const totalModulos = modulosDoCurso(curso.id).length
              const feitas = aulas.filter((a) => assistidas.has(a.id)).length
              const percentual = percentualAssistido(aulas, assistidas)
              const concluido = aulas.length > 0 && feitas === aulas.length

              return (
                <Card
                  key={curso.id}
                  className="glass group overflow-hidden rounded-3xl border p-0 shadow-sm transition-transform hover:-translate-y-1"
                >
                  <Link href={`/cursos/${curso.id}`} className="flex h-full flex-col" aria-label={`Abrir o curso ${curso.titulo}`}>
                    <div className="relative aspect-video w-full overflow-hidden bg-primary/10">
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
                      {concluido ? (
                        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white shadow">
                          <CheckCircle2 className="size-3.5" aria-hidden="true" />
                          Concluído
                        </span>
                      ) : null}
                    </div>
                    <CardContent className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
                      <h2 className="text-pretty font-semibold leading-snug text-base sm:text-lg">{curso.titulo}</h2>
                      {curso.descricao ? (
                        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                          {curso.descricao}
                        </p>
                      ) : null}

                      <div className="mt-auto flex flex-col gap-2 pt-1">
                        {carregandoConteudo ? (
                          <div className="h-2 animate-pulse rounded-full bg-primary/10" />
                        ) : (
                          <>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>
                                {totalModulos} {totalModulos === 1 ? "módulo" : "módulos"} · {feitas} de {aulas.length}{" "}
                                {aulas.length === 1 ? "aula" : "aulas"}
                              </span>
                              <span className="font-semibold tabular-nums text-foreground">{percentual}%</span>
                            </div>
                            <BarraProgresso valor={percentual} rotulo={`${percentual}% do curso assistido`} />
                          </>
                        )}
                        <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                          <PlayCircle className="size-4" aria-hidden="true" />
                          {feitas > 0 && !concluido ? "Continuar curso" : concluido ? "Rever curso" : "Começar curso"}
                        </span>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
