"use client"

import Link from "next/link"
import { ArrowRight, FolderOpen, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { getCategorias, TRILHAS } from "@/lib/catalog"
import { useApp } from "@/lib/app-provider"

export default function ConteudosPage() {
  const { usuario, materiais } = useApp()

  const primeiroNome = usuario?.nome.split(" ")[0] ?? ""

  // Filtragem de trilhas de acordo com o papel e categoria do usuário logado
  const ehAdminOuProf = usuario?.papel === "admin" || usuario?.papel === "professor"
  const catUser = usuario?.categoriaId ?? "todas"

  const trilhasPermitidas = TRILHAS.filter((trilha) => {
    if (ehAdminOuProf || catUser === "todas") return true
    if (catUser === "educacao-infantil") return trilha.slug === "educacao-infantil"
    if (catUser === "fundamental-1") return trilha.slug === "fundamental-1"
    if (catUser === "educacao-ambiental") return trilha.slug === "educacao-ambiental"
    const categoriasDaTrilha = getCategorias(trilha.slug)
    return categoriasDaTrilha.some((c) => c.slug === catUser)
  })

  return (
    <div>
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-primary">Olá, {primeiroNome}</p>
          {usuario?.categoriaNome ? (
            <Badge variant="outline" className="rounded-full text-xs font-normal">
              {usuario.categoriaNome}
            </Badge>
          ) : null}
        </div>
        <h1 className="text-pretty text-3xl font-bold tracking-tight sm:text-4xl">Material Didático</h1>
        <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Navegue pelas pastas para encontrar PDFs, vídeos e jogos organizados especificamente para a sua sala ou perfil.
        </p>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {trilhasPermitidas.map((trilha) => {
          const categorias = getCategorias(trilha.slug)
          const total = materiais.filter((m) => m.trilha === trilha.slug).length

          return (
            <Card
              key={trilha.slug}
              className={`group relative overflow-hidden rounded-4xl border-0 bg-gradient-to-br ${trilha.gradient} p-[2px] shadow-sm transition-transform hover:-translate-y-1`}
            >
              {trilha.badge ? (
                <span className="absolute bottom-4 right-4 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm dark:bg-black/70 dark:text-emerald-300">
                  {trilha.badge}
                </span>
              ) : null}
              <Link
                href={`/conteudos/${trilha.slug}`}
                className={`flex h-full flex-col gap-6 rounded-4xl bg-card/85 p-7 backdrop-blur-sm ${trilha.badge ? "pb-14" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
                    <FolderOpen className="size-6 text-primary" aria-hidden="true" />
                  </span>
                  <Badge variant="secondary" className="rounded-full font-normal">
                    {total} {total === 1 ? "material" : "materiais"}
                  </Badge>
                </div>

                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-semibold">{trilha.nome}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">{trilha.descricao}</p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {categorias.map((cat) => (
                    <span key={cat.slug} className="rounded-full bg-secondary/80 px-3 py-1 text-xs font-medium">
                      {cat.nome}
                    </span>
                  ))}
                </div>

                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Abrir trilha
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
