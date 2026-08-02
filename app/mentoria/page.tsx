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
      <div className="grid gap-6 md:grid-cols-3">
        {mentoria.etapas.map((etapa, index) => {
          const Icone = ETAPAS_ICONES[index % ETAPAS_ICONES.length]
          return (
            <Card key={etapa.titulo} className="rounded-2xl border border-border bg-card shadow-xs transition-all hover:border-primary/40 hover:shadow-md">
              <CardContent className="flex flex-col gap-3 p-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Icone className="size-5" aria-hidden="true" />
                </span>
                <h2 className="font-serif text-lg font-bold text-foreground">{etapa.titulo}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{etapa.texto}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <section className="mt-14">
        <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">Formatos de Acompanhamento Institucional</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {mentoria.planos.map((plano) => (
            <Card
              key={plano.nome}
              className={
                plano.destaque
                  ? "rounded-3xl border-2 border-primary bg-card p-7 shadow-sm"
                  : "rounded-3xl border border-border bg-card p-7 shadow-xs"
              }
            >
              <div className="flex h-full flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <h3 className="font-serif text-xl font-bold text-foreground">{plano.nome}</h3>
                  <p className="text-sm font-semibold text-primary">{plano.preco}</p>
                </div>
                <ul className="flex flex-col gap-3">
                  {plano.itens.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-auto w-full rounded-full font-medium" variant={plano.destaque ? "default" : "outline"}>
                  <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
                    Falar com a equipe de mentoria
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
