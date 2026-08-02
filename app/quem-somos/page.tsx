"use client"

import { Compass, HeartHandshake, Lightbulb, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { PageShell } from "@/components/site/page-shell"
import { useApp } from "@/lib/app-provider"

const PILAR_ICONES = [Compass, Target, HeartHandshake, Lightbulb]

export default function QuemSomosPage() {
  const { siteConfig } = useApp()
  const { quemSomos } = siteConfig

  return (
    <PageShell
      titulo={quemSomos.titulo}
      subtitulo={quemSomos.subtitulo}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {quemSomos.pilares.map((pilar, index) => {
          const Icone = PILAR_ICONES[index % PILAR_ICONES.length]
          return (
            <Card key={pilar.titulo} className="glass rounded-3xl border shadow-sm">
              <CardContent className="flex flex-col gap-4 p-7">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
                  <Icone className="size-5 text-primary" aria-hidden="true" />
                </span>
                <h2 className="text-xl font-semibold">{pilar.titulo}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{pilar.texto}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <section className="glass-strong mt-8 rounded-4xl border p-8 sm:p-12">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{quemSomos.historiaTitulo}</h2>
        <div className="mt-5 flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {quemSomos.historiaParagrafos.map((paragrafo, idx) => (
            <p key={idx}>{paragrafo}</p>
          ))}
        </div>

        <dl className="mt-10 grid gap-6 sm:grid-cols-3">
          {quemSomos.estatisticas.map((item) => (
            <div key={item.rotulo} className="flex flex-col gap-1 rounded-2xl bg-card/70 p-5">
              <dt className="text-sm text-muted-foreground">{item.rotulo}</dt>
              <dd className="text-3xl font-bold holo-text">{item.valor}</dd>
            </div>
          ))}
        </dl>
      </section>
    </PageShell>
  )
}
