"use client";

import Link from "next/link"
import { ArrowRight, BookOpen, Gamepad2, Heart, PlayCircle, Sparkles, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { AuthDialog } from "@/components/auth/auth-dialog"
import { TRILHAS } from "@/lib/catalog"
import { useApp } from "@/lib/app-provider"

const ICONES_RECURSOS = [BookOpen, PlayCircle, Gamepad2]

const DESTAQUES = [
  {
    icon: Heart,
    titulo: "Quem Somos",
    texto: "Uma equipe pedagógica que acredita na diversidade e na organização como ponto de partida.",
    href: "/quem-somos",
  },
  {
    icon: Users,
    titulo: "Autores",
    texto: "Educadores e especialistas de renome que assinam cada material da plataforma.",
    href: "/autores",
  },
  {
    icon: Sparkles,
    titulo: "Mentoria",
    texto: "Acompanhamento contínuo e formação para escolas e equipes que buscam excelência.",
    href: "/mentoria",
  },
]

export default function HomePage() {
  const { siteConfig } = useApp()
  const { home } = siteConfig

  return (
    <div className="holo-surface min-h-screen">
      <SiteHeader />

      <main>
        <section className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24">
          <div className="flex flex-col items-center text-center">
            <span className="glass inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium">
              <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
              {home.badge}
            </span>

            <h1 className="mt-6 text-pretty text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              {home.tituloPrincipal}{" "}
              <span className="font-display italic holo-text font-semibold">{home.tituloDestaque}</span>
            </h1>

            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-foreground/75 sm:text-lg">
              {home.descricao}
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
              <AuthDialog>
                <Button size="lg" className="rounded-full px-8">
                  Acessar Plataforma
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </AuthDialog>
              <Button asChild size="lg" variant="outline" className="rounded-full bg-card/70 px-8">
                <Link href="/quem-somos">Conhecer a proposta</Link>
              </Button>
            </div>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {home.recursos.map((recurso, index) => {
              const Icone = ICONES_RECURSOS[index % ICONES_RECURSOS.length]
              return (
                <Card key={recurso.titulo} className="glass rounded-3xl border shadow-sm transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="flex flex-col gap-3 p-6">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
                      <Icone className="size-5 text-primary" aria-hidden="true" />
                    </span>
                    <h2 className="text-lg font-semibold">{recurso.titulo}</h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">{recurso.texto}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Trilhas de Aprendizagem</h2>
            <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
              Estruturas pedagógicas pensadas para cada momento do desenvolvimento escolar.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {TRILHAS.map((trilha) => (
              <Card
                key={trilha.slug}
                className={`relative overflow-hidden rounded-3xl border-0 bg-gradient-to-br ${trilha.gradient} p-[2px] shadow-sm`}
              >
                {trilha.badge ? (
                  <span className="absolute right-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm dark:bg-black/70 dark:text-emerald-300">
                    {trilha.badge}
                  </span>
                ) : null}
                <div className="flex h-full flex-col justify-between gap-6 rounded-3xl bg-card/85 p-7 backdrop-blur-sm">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-2xl font-semibold">{trilha.nome}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{trilha.descricao}</p>
                  </div>
                  <AuthDialog>
                    <Button variant="secondary" className="w-fit rounded-full">
                      Explorar conteúdos
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Button>
                  </AuthDialog>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
          <div className="grid gap-5 md:grid-cols-3">
            {DESTAQUES.map((item) => (
              <Card
                key={item.href}
                className="glass rounded-3xl border shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <CardContent className="flex flex-col gap-3 p-6">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-accent">
                    <item.icon className="size-5 text-accent-foreground" aria-hidden="true" />
                  </span>
                  <h2 className="text-lg font-semibold">{item.titulo}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.texto}</p>
                  <Link
                    href={item.href}
                    className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-opacity hover:opacity-75"
                  >
                    Saber mais
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
          <div className="glass-strong flex flex-col items-center gap-6 rounded-4xl border px-6 py-14 text-center">
            <h2 className="text-pretty text-3xl font-bold tracking-tight sm:text-4xl">
              Pronto para explorar a plataforma?
            </h2>
            <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">
              Entre com suas credenciais escolares para navegar por todas as trilhas, materiais e recursos exclusivos.
            </p>
            <AuthDialog>
              <Button size="lg" className="rounded-full px-8">
                Entrar na Diversamente
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </AuthDialog>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}


