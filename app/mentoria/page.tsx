"use client"

import { ExternalLink, GraduationCap, HeartHandshake, Presentation, Wrench } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { PageShell } from "@/components/site/page-shell"
import { useApp } from "@/lib/app-provider"

const CATEGORIA_ICONES: Record<string, typeof Presentation> = {
  Palestras: Presentation,
  Cursos: GraduationCap,
  Oficinas: Wrench,
  "Orientação Familiar": HeartHandshake,
}

export default function MentoriaPage() {
  const { siteConfig } = useApp()
  const { mentoria } = siteConfig

  return (
    <PageShell titulo={mentoria.titulo} subtitulo={mentoria.subtitulo}>
      {/* O QUE OFERECEMOS — categorias e programas nomeados */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">O que oferecemos</h2>
        <p className="mt-2 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Um catálogo completo de formação e apoio, do primeiro contato com a equipe até a implementação contínua na
          rede.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {mentoria.categorias.map((categoria) => {
            const Icone = CATEGORIA_ICONES[categoria.nome] ?? Presentation
            return (
              <Card key={categoria.nome} className="glass rounded-3xl border shadow-sm">
                <CardContent className="flex flex-col gap-5 p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                        <Icone className="size-5 text-primary" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold">{categoria.nome}</h3>
                        <p className="text-xs text-muted-foreground">{categoria.duracao}</p>
                      </div>
                    </div>
                  </div>

                  {categoria.formato ? (
                    <p className="-mt-3 text-xs font-medium text-primary/90">{categoria.formato}</p>
                  ) : null}

                  <div className="flex flex-col gap-4">
                    {categoria.programas.map((programa) => (
                      <div key={programa.titulo} className="rounded-2xl bg-card/70 p-4">
                        <p className="text-sm font-semibold leading-snug">{programa.titulo}</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {programa.topicos.map((topico) => (
                            <span
                              key={topico}
                              className="rounded-full bg-secondary/80 px-2.5 py-1 text-[11px] font-medium text-secondary-foreground"
                            >
                              {topico}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* FORMADORES E AUTORES */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Formadores e Autores</h2>
        <p className="mt-2 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          As atividades presenciais e a produção de material didático são conduzidas pela equipe que assina a Coleção
          Diversamente.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {mentoria.formadores.map((formador) => (
            <Card key={formador.nome} className="glass rounded-3xl border shadow-sm">
              <CardContent className="flex flex-col gap-2.5 p-6">
                <h3 className="text-lg font-semibold">{formador.nome}</h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary/90">
                  {formador.credencial}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">{formador.bio}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs">
                  {formador.lattes ? (
                    <a
                      href={formador.lattes}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-primary hover:opacity-75"
                    >
                      Currículo Lattes
                      <ExternalLink className="size-3" aria-hidden="true" />
                    </a>
                  ) : null}
                  {formador.contato ? (
                    <span className="text-muted-foreground">{formador.contato}</span>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
