"use client"

import { use, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Circle, Inbox, PlayCircle } from "lucide-react"
import { toast } from "sonner"
import { Breadcrumbs } from "@/components/app/breadcrumbs"
import { BarraProgresso } from "@/components/app/barra-progresso"
import { VideoViewer } from "@/components/viewers/video-viewer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { percentualAssistido } from "@/lib/cursos"
import { useApp } from "@/lib/app-provider"
import { useCursosConteudo } from "@/lib/use-cursos-conteudo"
import { cn } from "@/lib/utils"

export default function CursoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { cursos, carregandoCursos } = useApp()
  const { modulosDoCurso, aulasDoCurso, assistidas, carregando, erro, alternarAssistida } = useCursosConteudo()

  const curso = cursos.find((c) => c.id === id)
  const modulos = modulosDoCurso(id)
  const aulas = useMemo(() => aulasDoCurso(id), [aulasDoCurso, id])
  const percentual = percentualAssistido(aulas, assistidas)

  const [aulaAtualId, setAulaAtualId] = useState<string | null>(null)
  const [salvando, setSalvando] = useState(false)

  // Ao abrir o curso, começa pela primeira aula ainda não assistida.
  useEffect(() => {
    if (aulaAtualId || aulas.length === 0) return
    setAulaAtualId((aulas.find((a) => !assistidas.has(a.id)) ?? aulas[0]).id)
  }, [aulas, assistidas, aulaAtualId])

  const indiceAtual = aulas.findIndex((a) => a.id === aulaAtualId)
  const aulaAtual = indiceAtual >= 0 ? aulas[indiceAtual] : null
  const anterior = indiceAtual > 0 ? aulas[indiceAtual - 1] : null
  const proxima = indiceAtual >= 0 && indiceAtual < aulas.length - 1 ? aulas[indiceAtual + 1] : null
  const moduloAtual = modulos.find((m) => m.id === aulaAtual?.moduloId)

  function irPara(aulaId: string) {
    setAulaAtualId(aulaId)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function onAlternar() {
    if (!aulaAtual) return
    const marcando = !assistidas.has(aulaAtual.id)
    setSalvando(true)
    const ok = await alternarAssistida(aulaAtual.id)
    setSalvando(false)
    if (!ok) {
      toast.error("Não foi possível salvar seu progresso. Tente novamente.")
      return
    }
    if (marcando && proxima) irPara(proxima.id)
  }

  if (!carregandoCursos && !curso) {
    return (
      <div className="glass flex flex-col items-center gap-3 rounded-3xl border p-8 text-center sm:p-12">
        <Inbox className="size-8 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">Curso não encontrado.</p>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/cursos">Voltar para Cursos</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="pb-8">
      <Breadcrumbs itens={[{ label: "Cursos", href: "/cursos" }, { label: curso?.titulo ?? "Curso" }]} />

      <header className="flex flex-col gap-4">
        <h1 className="text-pretty text-2xl font-bold tracking-tight sm:text-3xl">{curso?.titulo}</h1>
        <div className="flex max-w-xl flex-col gap-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {aulas.filter((a) => assistidas.has(a.id)).length} de {aulas.length} aulas assistidas
            </span>
            <span className="font-semibold tabular-nums text-foreground">{percentual}%</span>
          </div>
          <BarraProgresso valor={percentual} rotulo={`${percentual}% do curso assistido`} />
        </div>
      </header>

      {erro ? (
        <div
          role="alert"
          className="mt-6 flex items-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
          {erro}
        </div>
      ) : null}

      {carregando ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="aspect-video animate-pulse rounded-3xl bg-card/60" />
          <div className="h-80 animate-pulse rounded-3xl bg-card/60" />
        </div>
      ) : aulas.length === 0 ? (
        <div className="glass mt-8 flex flex-col items-center gap-3 rounded-3xl border p-8 text-center sm:p-12">
          <Inbox className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Este curso ainda não tem aulas publicadas.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
          <div className="flex flex-col gap-4">
            {aulaAtual ? (
              <>
                <VideoViewer key={aulaAtual.id} url={aulaAtual.videoUrl} titulo={aulaAtual.titulo} />
                <div className="flex flex-col gap-1">
                  {moduloAtual ? (
                    <span className="text-xs font-medium uppercase tracking-wide text-primary">{moduloAtual.titulo}</span>
                  ) : null}
                  <h2 className="text-pretty text-xl font-semibold">{aulaAtual.titulo}</h2>
                  {aulaAtual.descricao ? (
                    <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                      {aulaAtual.descricao}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    onClick={onAlternar}
                    disabled={salvando}
                    variant={assistidas.has(aulaAtual.id) ? "outline" : "default"}
                    className="rounded-full"
                  >
                    <CheckCircle2 className="size-4" aria-hidden="true" />
                    {assistidas.has(aulaAtual.id) ? "Assistida — desmarcar" : "Marcar como assistida"}
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-full sm:flex-none"
                      disabled={!anterior}
                      onClick={() => anterior && irPara(anterior.id)}
                    >
                      <ArrowLeft className="size-4" aria-hidden="true" />
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 rounded-full sm:flex-none"
                      disabled={!proxima}
                      onClick={() => proxima && irPara(proxima.id)}
                    >
                      Próxima
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </>
            ) : null}
          </div>

          <Card className="glass rounded-3xl border-0 p-0 lg:sticky lg:top-20">
            <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
              {modulos.map((modulo, i) => {
                const pct = percentualAssistido(modulo.aulas, assistidas)
                return (
                  <section key={modulo.id} className="flex flex-col gap-1.5">
                    <div className="flex items-baseline justify-between gap-2 px-1">
                      <h3 className="text-sm font-semibold">
                        Módulo {i + 1} · {modulo.titulo}
                      </h3>
                      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{pct}%</span>
                    </div>
                    {modulo.aulas.length === 0 ? (
                      <p className="px-1 text-xs text-muted-foreground">Sem aulas ainda.</p>
                    ) : (
                      <ul className="flex flex-col gap-1">
                        {modulo.aulas.map((aula) => {
                          const vista = assistidas.has(aula.id)
                          const atual = aula.id === aulaAtualId
                          return (
                            <li key={aula.id}>
                              <button
                                type="button"
                                onClick={() => irPara(aula.id)}
                                aria-current={atual ? "true" : undefined}
                                className={cn(
                                  "flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition-colors",
                                  atual ? "bg-card font-medium shadow-sm" : "hover:bg-card/60",
                                )}
                              >
                                {vista ? (
                                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600" aria-label="Assistida" />
                                ) : atual ? (
                                  <PlayCircle className="size-4 shrink-0 text-primary" aria-hidden="true" />
                                ) : (
                                  <Circle className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                                )}
                                <span className="line-clamp-2">{aula.titulo}</span>
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </section>
                )
              })}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
