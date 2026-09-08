"use client"

import { Compass, ExternalLink, HeartHandshake, Lightbulb, Sprout, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { PageShell } from "@/components/site/page-shell"
import { EcosBioBadge } from "@/components/brand/ecosbio-badge"
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
            <Card key={pilar.titulo} className="glass rounded-3xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30">
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

      <section className="glass-strong mt-10 rounded-4xl border p-8 sm:p-12 shadow-sm transition-all duration-300 hover:border-primary/30">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-balance">{quemSomos.historiaTitulo}</h2>
        <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {quemSomos.historiaParagrafos.map((paragrafo, idx) => (
            <p key={idx} className="text-pretty">{paragrafo}</p>
          ))}
        </div>
      </section>

      <section className="glass mt-10 rounded-4xl border p-8 sm:p-12 shadow-sm transition-all duration-300 hover:border-primary/30">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
                <Sprout className="size-5 text-primary" aria-hidden="true" />
              </span>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Parceria com a EcosBio</h2>
            </div>
            <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              A trilha de Educação Ambiental é desenvolvida em parceria com a{" "}
              <a
                href="https://ecosbio.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                EcosBio
              </a>
              , empresa filha da Unesp fundada em 2009, sediada em Dracena (SP). A EcosBio atua em três frentes —
              Ambiental, Social e Educacional — desenvolvendo projetos de gestão ambiental, inclusão social e educação
              ambiental em parceria com prefeituras, escolas e comunidades em todo o Brasil. Juntas, Diversamente e
              EcosBio unem educação e sustentabilidade em conteúdos pensados para a sala de aula.
            </p>
            <a
              href="https://ecosbio.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary hover:opacity-75"
            >
              Conhecer a EcosBio
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          </div>

          <EcosBioBadge className="shrink-0 self-start px-4 py-2" />
        </div>
      </section>
    </PageShell>
  )
}

