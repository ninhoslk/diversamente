"use client"

import { CalendarCheck, Check, GraduationCap, MessagesSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageShell } from "@/components/site/page-shell"
import { useApp } from "@/lib/app-provider"

const ETAPAS_ICONES = [MessagesSquare, CalendarCheck, GraduationCap]

export default function MentoriaPage() {
  const { siteConfig } = useApp()
  const { mentoria } = siteConfig

  return (
    <PageShell
      titulo={mentoria.titulo}
      subtitulo={mentoria.subtitulo}
    >
      <div className="grid gap-5 md:grid-cols-3">
        {mentoria.etapas.map((etapa, index) => {
          const Icone = ETAPAS_ICONES[index % ETAPAS_ICONES.length]
          return (
            <Card key={etapa.titulo} className="glass rounded-3xl border shadow-sm">
              <CardContent className="flex flex-col gap-3 p-6">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-accent">
                  <Icone className="size-5 text-accent-foreground" aria-hidden="true" />
                </span>
                <h2 className="text-lg font-semibold">{etapa.titulo}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{etapa.texto}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <section className="mt-14">
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
                  <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
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
