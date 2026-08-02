"use client"

import Link from "next/link"
import { FileText, Gamepad2, PlusCircle, Video, Layers, Users, Palette, ShieldCheck } from "lucide-react"
import { Breadcrumbs } from "@/components/app/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CATEGORIAS, PUBLICOS, TRILHAS } from "@/lib/catalog"
import { useApp } from "@/lib/app-provider"

export default function AdminPage() {
  const { materiais, usuarios } = useApp()

  const totalPdf = materiais.filter((m) => m.tipo === "pdf").length
  const totalVideo = materiais.filter((m) => m.tipo === "video").length
  const totalJogo = materiais.filter((m) => m.tipo === "jogo").length

  const metricas = [
    { label: "PDFs publicados", valor: totalPdf, Icon: FileText },
    { label: "Vídeos publicados", valor: totalVideo, Icon: Video },
    { label: "Jogos publicados", valor: totalJogo, Icon: Gamepad2 },
    { label: "Contas de Acesso", valor: usuarios.length, Icon: Users },
  ]

  const recentes = [...materiais].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)).slice(0, 5)

  return (
    <>
      <Breadcrumbs itens={[{ label: "Conteúdos", href: "/conteudos" }, { label: "Painel Admin" }]} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Painel Admin</h1>
          <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
            Gerencie os materiais da biblioteca, edite o layout do site (Elementor) e cadastre alunos e professores.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/admin/aparencia">
              <Palette className="size-4 text-primary" aria-hidden="true" />
              Editar Layout (Elementor)
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/admin/usuarios">
              <Users className="size-4 text-primary" aria-hidden="true" />
              Alunos & Professores
            </Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link href="/admin/materiais/novo">
              <PlusCircle className="size-4" aria-hidden="true" />
              Novo material
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricas.map(({ label, valor, Icon }) => (
          <Card key={label} className="glass rounded-3xl border-0">
            <CardHeader className="flex-row items-center justify-between gap-2 pb-2">
              <CardDescription className="text-xs font-medium uppercase tracking-wide">{label}</CardDescription>
              <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <p className="font-serif text-4xl font-semibold tabular-nums">{valor}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="glass rounded-3xl border-0">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Materiais recentes</CardTitle>
            <CardDescription>Os últimos itens adicionados à biblioteca.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {recentes.map((m) => {
              const trilha = TRILHAS.find((t) => t.slug === m.trilha)
              const categoria = CATEGORIAS.find((c) => c.slug === m.categoria)
              return (
                <div
                  key={m.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-card/70 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{m.titulo}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {trilha?.nome} · {categoria?.nome} · {PUBLICOS[m.publico]}
                    </p>
                  </div>
                  <Badge variant="secondary" className="rounded-full text-[10px] uppercase">
                    {m.tipo}
                  </Badge>
                </div>
              )
            })}
            <Button asChild variant="ghost" className="mt-1 self-start rounded-full">
              <Link href="/admin/materiais">Ver todos os materiais</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="glass rounded-3xl border-0">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Estrutura da biblioteca</CardTitle>
            <CardDescription>Trilhas e categorias disponíveis para publicação.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {TRILHAS.map((t) => (
              <div key={t.slug} className="rounded-2xl bg-card/70 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Layers className="size-4 text-primary" aria-hidden="true" />
                  <p className="text-sm font-medium">{t.nome}</p>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {CATEGORIAS.filter((c) => c.trilha === t.slug)
                    .map((c) => c.nome)
                    .join(" · ")}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
