"use client"

import {
  CalendarCheck,
  Check,
  ExternalLink,
  GraduationCap,
  HeartHandshake,
  MessagesSquare,
  Presentation,
  Wrench,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageShell } from "@/components/site/page-shell"
import { useApp } from "@/lib/app-provider"

const ETAPAS_ICONES = [MessagesSquare, CalendarCheck, GraduationCap, HeartHandshake]
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

      {/* COMO FUNCIONA A ASSESSORIA CONTÍNUA */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Como funciona a assessoria contínua</h2>
        <p className="mt-2 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Para redes e escolas que buscam implementação de longo prazo, a assessoria segue quatro etapas.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {mentoria.etapas.map((etapa, index) => {
            const Icone = ETAPAS_ICONES[index % ETAPAS_ICONES.length]
            return (
              <Card key={etapa.titulo} className="glass rounded-3xl border shadow-sm">
                <CardContent className="flex flex-col gap-3 p-6">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-accent">
                    <Icone className="size-5 text-accent-foreground" aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-semibold leading-snug">{etapa.titulo}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{etapa.texto}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* FORMATOS DE ACOMPANHAMENTO / CTA */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Formatos de Acompanhamento</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {mentoria.planos.map((plano) => (
            <Card
              key={plano.nome}
              className={
                plano.destaque
                  ? "rounded-3xl border-0 bg-gradient-to-br from-holo-pink via-holo-lilac to-holo-blue p-[2px] shadow-sm"
                  : "glass rounded-3xl border shadow-sm"
              }
            >
              <div
                className={
                  plano.destaque
                    ? "flex h-full flex-col gap-5 rounded-3xl bg-card/90 p-7 backdrop-blur-sm"
                    : "flex h-full flex-col gap-5 p-7"
                }
              >
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-semibold">{plano.nome}</h3>
                  <p className="text-sm text-muted-foreground">{plano.preco}</p>
                </div>
                <ul className="flex flex-col gap-2.5">
                  {plano.itens.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm leading-relaxed">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-auto w-full rounded-full" variant={plano.destaque ? "default" : "outline"}>
                  <a href="https://wa.me/5519992101212" target="_blank" rel="noopener noreferrer">
                    Falar com a equipe
                  </a>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
