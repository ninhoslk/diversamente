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
      <div className="grid gap-6 sm:grid-cols-2">
        {quemSomos.pilares.map((pilar, index) => {
          const Icone = PILAR_ICONES[index % PILAR_ICONES.length]
          return (
            <Card key={pilar.titulo} className="rounded-2xl border border-border bg-card shadow-xs transition-all hover:border-primary/40 hover:shadow-md">
              <CardContent className="flex flex-col gap-4 p-7">
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Icone className="size-5" aria-hidden="true" />
                </span>
                <h2 className="font-serif text-xl font-bold text-foreground">{pilar.titulo}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{pilar.texto}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <section className="mt-12 rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-xs">
        <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">{quemSomos.historiaTitulo}</h2>
        <div className="mt-6 flex flex-col gap-5 text-base leading-relaxed text-muted-foreground">
          {quemSomos.historiaParagrafos.map((paragrafo, idx) => (
            <p key={idx} className="text-pretty">{paragrafo}</p>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
