"use client"

import { use, useMemo, useState } from "react"
import { notFound } from "next/navigation"
import { AlertTriangle, FileText, Gamepad2, Inbox, PlayCircle, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumbs } from "@/components/app/breadcrumbs"
import { MaterialDialog } from "@/components/app/material-dialog"
import {
  getCategoria,
  getTrilha,
  PUBLICOS,
  TIPOS,
  publicosPermitidosParaPapel,
  usuarioPodeAcessarCategoria,
  type Material,
  type TipoMaterial,
} from "@/lib/catalog"
import { useApp } from "@/lib/app-provider"

const ICONES: Record<TipoMaterial, typeof FileText> = {
  pdf: FileText,
  video: PlayCircle,
  jogo: Gamepad2,
}

export default function CategoriaPage({
  params,
}: {
  params: Promise<{ trilha: string; categoria: string }>
}) {
  const { trilha: trilhaSlug, categoria: categoriaSlug } = use(params)
  const { materiais, usuario, erroMateriais } = useApp()
  const [selecionado, setSelecionado] = useState<Material | null>(null)

  const trilha = getTrilha(trilhaSlug)
  const categoria = getCategoria(trilhaSlug, categoriaSlug)
  if (!trilha || !categoria) notFound()

  const publicosPermitidos = useMemo(
    () => publicosPermitidosParaPapel(usuario?.papel, categoria.publicos),
    [usuario, categoria],
  )

  const doGrupo = useMemo(
    () => materiais.filter((m) => m.trilha === trilhaSlug && m.categoria === categoriaSlug),
    [materiais, trilhaSlug, categoriaSlug],
  )

  const publicoInicial = publicosPermitidos.length > 0 ? publicosPermitidos[0] : categoria.publicos[0]

  // Restrição de turma/ano definida em /admin/usuarios (usuario.categoriaId).
  // Sem isso, um aluno restrito a uma turma conseguia ver o conteúdo de qualquer
  // outra só trocando a URL.
  const podeAcessarCategoria =
    usuario?.papel === "admin" ||
    usuario?.papel === "professor" ||
    usuarioPodeAcessarCategoria(usuario?.categoriaId, trilhaSlug, categoriaSlug)

  if (!podeAcessarCategoria) {
    return (
      <div className="pb-8">
        <Breadcrumbs
          itens={[
            { label: "Conteúdos", href: "/conteudos" },
            { label: trilha.nome, href: `/conteudos/${trilhaSlug}` },
            { label: categoria.nome },
          ]}
        />
        <div className="glass mt-8 flex flex-col items-center gap-3 rounded-3xl border p-8 sm:p-12 text-center">
          <Lock className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            Esta categoria não está disponível para a sua turma. Fale com a administração se acredita que isso é um
            engano.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-8">
      <Breadcrumbs
        itens={[
          { label: "Conteúdos", href: "/conteudos" },
          { label: trilha.nome, href: `/conteudos/${trilhaSlug}` },
          { label: categoria.nome },
        ]}
      />

      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-pretty font-serif text-2xl font-bold tracking-tight sm:text-4xl">{categoria.nome}</h1>
          <Badge variant="outline" className="rounded-full text-xs font-normal">
            Visão: {usuario?.papel === "admin" ? "Administrador" : usuario?.papel === "professor" ? "Professor" : usuario?.papel === "pai" ? "Família" : "Estudante"}
          </Badge>
        </div>
        <p className="max-w-2xl text-pretty text-sm sm:text-base leading-relaxed text-muted-foreground">
          Escolha a aba de público para acessar cadernos, vídeos e jogos formativos.
        </p>
      </header>

      {erroMateriais ? (
        <div
          role="alert"
          className="mt-4 flex items-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
          {erroMateriais}
        </div>
      ) : null}

      {/* Nível 3: sub-abas de público com rolagem suave no celular */}
      <Tabs defaultValue={publicoInicial} className="mt-6 sm:mt-8">
        <TabsList className="glass h-auto max-w-full overflow-x-auto flex-nowrap sm:flex-wrap justify-start gap-1.5 rounded-2xl sm:rounded-full border p-1.5">
          {categoria.publicos.map((p) => {
            const estaLiberado = publicosPermitidos.includes(p)
            if (!estaLiberado) {
              return (
                <div
                  key={p}
                  className="flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground/50 cursor-not-allowed select-none bg-secondary/30"
                  title="Conteúdo exclusivo para outros perfis"
                >
                  <Lock className="size-3.5" />
                  <span>{PUBLICOS[p]}</span>
                </div>
              )
            }
            return (
              <TabsTrigger key={p} value={p} className="shrink-0 rounded-full px-3.5 py-1.5 text-xs sm:text-sm">
                {PUBLICOS[p]}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {publicosPermitidos.map((publico) => (
          <TabsContent key={publico} value={publico} className="mt-6">
            {/* Filtro por tipo de material */}
            <Tabs defaultValue="pdf">
              <TabsList className="rounded-full bg-secondary/70 max-w-full overflow-x-auto flex-nowrap sm:flex-wrap">
                {TIPOS.map((tipo) => {
                  const qtd = doGrupo.filter((m) => m.publico === publico && m.tipo === tipo.slug).length
                  return (
                    <TabsTrigger key={tipo.slug} value={tipo.slug} className="shrink-0 gap-1.5 rounded-full text-xs sm:text-sm">
                      {tipo.label}
                      <span className="text-xs text-muted-foreground">{qtd}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              {TIPOS.map((tipo) => {
                const lista = doGrupo.filter((m) => m.publico === publico && m.tipo === tipo.slug)
                const Icone = ICONES[tipo.slug]

                return (
                  <TabsContent key={tipo.slug} value={tipo.slug} className="mt-6">
                    {lista.length === 0 ? (
                      <div className="glass flex flex-col items-center gap-3 rounded-3xl border p-8 sm:p-12 text-center">
                        <Inbox className="size-8 text-muted-foreground" aria-hidden="true" />
                        <p className="text-sm text-muted-foreground">
                          Nenhum material deste tipo publicado para {PUBLICOS[publico].toLowerCase()} ainda.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {lista.map((material) => (
                          <Card
                            key={material.id}
                            className="glass group cursor-pointer rounded-3xl border p-0 shadow-sm transition-transform hover:-translate-y-1"
                          >
                            <button
                              type="button"
                              onClick={() => setSelecionado(material)}
                              className="w-full text-left"
                              aria-label={`Abrir ${material.titulo}`}
                            >
                              <CardContent className="flex flex-col gap-3 p-5 sm:p-6">
                                <div className="flex items-start justify-between gap-3">
                                  <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
                                    <Icone className="size-5 text-primary" aria-hidden="true" />
                                  </span>
                                  <Badge variant="secondary" className="rounded-full text-xs font-normal">
                                    {tipo.label.replace(/s$/, "")}
                                  </Badge>
                                </div>
                                <h2 className="text-pretty font-semibold leading-snug text-base sm:text-lg">{material.titulo}</h2>
                                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">{material.descricao}</p>
                                <span className="text-xs text-muted-foreground">
                                  Publicado em {formatarData(material.criadoEm)}
                                </span>
                              </CardContent>
                            </button>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                )
              })}
            </Tabs>
          </TabsContent>
        ))}
      </Tabs>

      <MaterialDialog material={selecionado} onOpenChange={(aberto) => !aberto && setSelecionado(null)} />
    </div>
  )
}

function formatarData(iso: string) {
  const [ano, mes, dia] = iso.split("-")
  return `${dia}/${mes}/${ano}`
}
