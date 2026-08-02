"use client";

import Link from "next/link"
import { ArrowRight, Award, BookOpen, CheckCircle2, Gamepad2, Heart, ShieldCheck, Sparkles, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { AuthDialog } from "@/components/auth/auth-dialog"
import { TRILHAS } from "@/lib/catalog"
import { useApp } from "@/lib/app-provider"

const ICONES_RECURSOS = [BookOpen, Award, Gamepad2]

const DESTAQUES = [
  {
    icon: Heart,
    titulo: "Quem Somos",
    texto: "Equipe pedagógica multidisciplinar focada na inclusão, neurociência e desenvolvimento humano.",
    href: "/quem-somos",
  },
  {
    icon: Users,
    titulo: "Autores",
    texto: "Pesquisadores, mestres e doutores que assinam os conteúdos pedagógicos da coleção.",
    href: "/autores",
  },
  {
    icon: Sparkles,
    titulo: "Mentoria Institucional",
    texto: "Formação continuada e acompanhamento para secretarias de educação e equipes docentes.",
    href: "/mentoria",
  },
]

export default function HomePage() {
  const { siteConfig } = useApp()
  const { home } = siteConfig

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main>
        {/* BANNER PRINCIPAL (HERO) */}
        <section className="mx-auto max-w-6xl px-4 pt-16 pb-16 sm:px-6 sm:pt-24">
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Conformidade com a BNCC · Soluções para Redes de Ensino
            </span>

            <h1 className="mt-6 text-pretty font-serif text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl max-w-4xl">
              {home.tituloPrincipal}{" "}
              <span className="text-primary italic font-serif font-normal">{home.tituloDestaque}</span>
            </h1>

            <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {home.descricao}
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
              <AuthDialog>
                <Button size="lg" className="rounded-full px-8 font-medium shadow-sm">
                  Acessar Plataforma
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </AuthDialog>
              <Button asChild size="lg" variant="outline" className="rounded-full bg-card px-8 border-border hover:border-primary/40">
                <Link href="/quem-somos">Conhecer a proposta pedagógica</Link>
              </Button>
            </div>
          </div>

          {/* RECURSOS EM CARDS HUMANOS E ELEGANTES */}
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {home.recursos.map((recurso, index) => {
              const Icone = ICONES_RECURSOS[index % ICONES_RECURSOS.length]
              return (
                <Card key={recurso.titulo} className="rounded-2xl border border-border bg-card p-2 shadow-xs transition-all hover:border-primary/30 hover:shadow-md">
                  <CardContent className="flex flex-col gap-3 p-6">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                      <Icone className="size-5" aria-hidden="true" />
                    </span>
                    <h2 className="font-serif text-xl font-bold text-foreground">{recurso.titulo}</h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">{recurso.texto}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* SELO DE QUALIDADE PARA LICITAÇÕES E EDITAIS */}
        <section className="border-y border-border/80 bg-secondary/30 py-10">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-around gap-6 px-4 text-center sm:px-6">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CheckCircle2 className="size-4 text-primary shrink-0" />
              100% Alinhado à BNCC
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CheckCircle2 className="size-4 text-primary shrink-0" />
              Acessibilidade & Inclusão
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CheckCircle2 className="size-4 text-primary shrink-0" />
              Apto para Licitações e Compras Públicas
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CheckCircle2 className="size-4 text-primary shrink-0" />
              Avaliação de Especialistas em Neuropsicologia
            </div>
          </div>
        </section>

        {/* TRILHAS DE APRENDIZAGEM */}
        <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
          <div className="flex flex-col gap-2">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Trilhas de Aprendizagem</h2>
            <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
              Estrutura pedagógica organizada para o desenvolvimento integral de cada faixa etária.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {TRILHAS.map((trilha) => (
              <Card
                key={trilha.slug}
                className="overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex h-full flex-col justify-between gap-6">
                  <div className="flex flex-col gap-3">
                    <span className="w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                      Trilha Formativa
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-foreground">{trilha.nome}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{trilha.descricao}</p>
                  </div>
                  <AuthDialog>
                    <Button variant="secondary" className="w-fit rounded-full font-medium">
                      Explorar conteúdos
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Button>
                  </AuthDialog>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* DESTAQUES INSTITUCIONAIS */}
        <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {DESTAQUES.map((item) => (
              <Card
                key={item.href}
                className="rounded-3xl border border-border bg-card shadow-xs transition-all hover:border-primary/30 hover:shadow-md"
              >
                <CardContent className="flex flex-col gap-3 p-7">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <item.icon className="size-5" aria-hidden="true" />
                  </span>
                  <h2 className="font-serif text-xl font-bold text-foreground">{item.titulo}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.texto}</p>
                  <Link
                    href={item.href}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-opacity hover:opacity-80"
                  >
                    Saber mais
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CHAMADA FINAL INSTITUCIONAL */}
        <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
          <div className="rounded-3xl border border-border bg-card p-8 sm:p-14 text-center shadow-sm">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Pronto para levar a Diversamente à sua instituição?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
              Acesse com suas credenciais para visualizar materiais pedagógicos, guias do educador e suporte para a comunidade escolar.
            </p>
            <div className="mt-8 flex justify-center">
              <AuthDialog>
                <Button size="lg" className="rounded-full px-8 font-medium">
                  Entrar na Diversamente
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </AuthDialog>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}



