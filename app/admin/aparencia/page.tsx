"use client"

import { useState } from "react"
import {
  Palette,
  RefreshCw,
  Save,
  Sparkles,
  Layout,
  FileText,
  Users,
  GraduationCap,
  Image as ImageIcon,
  BookOpen,
  MessageSquareQuote,
  ListChecks,
  Star,
} from "lucide-react"
import { toast } from "sonner"
import { Breadcrumbs } from "@/components/app/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useApp } from "@/lib/app-provider"
import type { SiteConfig } from "@/lib/site-config"

export default function ElementorAparenciaPage() {
  const { siteConfig, atualizarSiteConfig, restaurarSiteConfig } = useApp()
  const [configDraft, setConfigDraft] = useState<SiteConfig>(JSON.parse(JSON.stringify(siteConfig)))

  function onSalvar() {
    atualizarSiteConfig(configDraft)
    toast.success("Layout e conteúdos do site atualizados com sucesso!", {
      description: "Todas as páginas (Home, Autores, Quem Somos e Mentoria) foram modificadas.",
    })
  }

  function onRestaurar() {
    restaurarSiteConfig()
    setConfigDraft(JSON.parse(JSON.stringify(siteConfig)))
    toast.info("Configurações originais restauradas.")
  }

  return (
    <>
      <Breadcrumbs
        itens={[
          { label: "Conteúdos", href: "/conteudos" },
          { label: "Painel Admin", href: "/admin" },
          { label: "Personalizador Visual (Elementor)" },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-xl">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Editor Visual do Site (Elementor)
          </h1>
          <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
            Altere qualquer texto, imagem, título e recurso de todas as páginas da plataforma em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button size="lg" className="rounded-full gap-2 px-6" onClick={onSalvar}>
            <Save className="size-4" aria-hidden="true" />
            Salvar e Publicar Site
          </Button>
        </div>
      </div>

      <Tabs defaultValue="home" className="mt-8">
        <TabsList className="glass h-auto flex-wrap justify-start gap-1 rounded-full border p-1.5">
          <TabsTrigger value="home" className="rounded-full gap-2 px-4 py-2">
            <Layout className="size-4 text-primary" />
            Página Inicial (Home)
          </TabsTrigger>
          <TabsTrigger value="autores" className="rounded-full gap-2 px-4 py-2">
            <Users className="size-4 text-primary" />
            Página de Autores
          </TabsTrigger>
          <TabsTrigger value="quem-somos" className="rounded-full gap-2 px-4 py-2">
            <FileText className="size-4 text-primary" />
            Quem Somos
          </TabsTrigger>
          <TabsTrigger value="mentoria" className="rounded-full gap-2 px-4 py-2">
            <GraduationCap className="size-4 text-primary" />
            Mentoria
          </TabsTrigger>
        </TabsList>

        {/* TAB HOME */}
        <TabsContent value="home" className="mt-6 flex flex-col gap-6">
          <Card className="glass rounded-3xl border-0">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Banner Principal (Hero)</CardTitle>
              <CardDescription>Textos principais de destaque do topo da home.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="h-badge">Selo / Badge do topo</Label>
                <Input
                  id="h-badge"
                  value={configDraft.home.badge}
                  onChange={(e) =>
                    setConfigDraft({
                      ...configDraft,
                      home: { ...configDraft.home, badge: e.target.value },
                    })
                  }
                  className="rounded-xl bg-card"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="h-titulo">Título Principal (Texto normal)</Label>
                  <Input
                    id="h-titulo"
                    value={configDraft.home.tituloPrincipal}
                    onChange={(e) =>
                      setConfigDraft({
                        ...configDraft,
                        home: { ...configDraft.home, tituloPrincipal: e.target.value },
                      })
                    }
                    className="rounded-xl bg-card"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="h-destaque">Título em Destaque (Holográfico/Cursivo)</Label>
                  <Input
                    id="h-destaque"
                    value={configDraft.home.tituloDestaque}
                    onChange={(e) =>
                      setConfigDraft({
                        ...configDraft,
                        home: { ...configDraft.home, tituloDestaque: e.target.value },
                      })
                    }
                    className="rounded-xl bg-card"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="h-desc">Descrição e Proposta</Label>
                <Textarea
                  id="h-desc"
                  rows={3}
                  value={configDraft.home.descricao}
                  onChange={(e) =>
                    setConfigDraft({
                      ...configDraft,
                      home: { ...configDraft.home, descricao: e.target.value },
                    })
                  }
                  className="rounded-xl bg-card"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass rounded-3xl border-0">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Cartões de Recursos & Vantagens</CardTitle>
              <CardDescription>Três destaques exibidos logo abaixo da chamada principal.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              {configDraft.home.recursos.map((rec, i) => (
                <div key={i} className="flex flex-col gap-3 rounded-2xl bg-card/80 p-4 border">
                  <Label className="font-bold text-xs text-primary">Recurso #{i + 1}</Label>
                  <Input
                    value={rec.titulo}
                    onChange={(e) => {
                      const novosRecs = [...configDraft.home.recursos]
                      novosRecs[i].titulo = e.target.value
                      setConfigDraft({
                        ...configDraft,
                        home: { ...configDraft.home, recursos: novosRecs },
                      })
                    }}
                    placeholder="Título do recurso"
                    className="rounded-xl bg-background"
                  />
                  <Textarea
                    rows={3}
                    value={rec.texto}
                    onChange={(e) => {
                      const novosRecs = [...configDraft.home.recursos]
                      novosRecs[i].texto = e.target.value
                      setConfigDraft({
                        ...configDraft,
                        home: { ...configDraft.home, recursos: novosRecs },
                      })
                    }}
                    placeholder="Descrição do recurso"
                    className="rounded-xl bg-background text-xs"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB AUTORES */}
        <TabsContent value="autores" className="mt-6 flex flex-col gap-6">
          <Card className="glass rounded-3xl border-0">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Cabeçalho da Página de Autores</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="a-titulo">Título da Página</Label>
                <Input
                  id="a-titulo"
                  value={configDraft.autores.titulo}
                  onChange={(e) =>
                    setConfigDraft({
                      ...configDraft,
                      autores: { ...configDraft.autores, titulo: e.target.value },
                    })
                  }
                  className="rounded-xl bg-card"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="a-subtitulo">Subtítulo Explicativo</Label>
                <Textarea
                  id="a-subtitulo"
                  rows={2}
                  value={configDraft.autores.subtitulo}
                  onChange={(e) =>
                    setConfigDraft({
                      ...configDraft,
                      autores: { ...configDraft.autores, subtitulo: e.target.value },
                    })
                  }
                  className="rounded-xl bg-card"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass rounded-3xl border-0">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Lista de Autores & Fotos</CardTitle>
              <CardDescription>Edite nomes, cargos, fotos (URL da imagem) e bios dos autores.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-3">
              {configDraft.autores.autores.map((autor, idx) => (
                <div key={autor.id} className="flex flex-col gap-3 rounded-2xl bg-card/80 p-4 border">
                  <Label className="font-bold text-xs text-primary">Autor #{idx + 1}</Label>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-[11px]">Nome</Label>
                    <Input
                      value={autor.nome}
                      onChange={(e) => {
                        const novos = [...configDraft.autores.autores]
                        novos[idx].nome = e.target.value
                        setConfigDraft({
                          ...configDraft,
                          autores: { ...configDraft.autores, autores: novos },
                        })
                      }}
                      className="rounded-xl bg-background"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-[11px]">Cargo / Especialidade</Label>
                    <Input
                      value={autor.cargo}
                      onChange={(e) => {
                        const novos = [...configDraft.autores.autores]
                        novos[idx].cargo = e.target.value
                        setConfigDraft({
                          ...configDraft,
                          autores: { ...configDraft.autores, autores: novos },
                        })
                      }}
                      className="rounded-xl bg-background"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-[11px] flex items-center gap-1">
                      <ImageIcon className="size-3 text-primary" /> Foto (URL da Imagem)
                    </Label>
                    <Input
                      value={autor.foto}
                      onChange={(e) => {
                        const novos = [...configDraft.autores.autores]
                        novos[idx].foto = e.target.value
                        setConfigDraft({
                          ...configDraft,
                          autores: { ...configDraft.autores, autores: novos },
                        })
                      }}
                      className="rounded-xl bg-background text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-[11px]">Biografia</Label>
                    <Textarea
                      rows={3}
                      value={autor.bio}
                      onChange={(e) => {
                        const novos = [...configDraft.autores.autores]
                        novos[idx].bio = e.target.value
                        setConfigDraft({
                          ...configDraft,
                          autores: { ...configDraft.autores, autores: novos },
                        })
                      }}
                      className="rounded-xl bg-background text-xs"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass rounded-3xl border-0">
            <CardHeader>
              <CardTitle className="font-serif text-xl flex items-center gap-2">
                <MessageSquareQuote className="size-5 text-primary" aria-hidden="true" />
                Seção Final (Chamada para Ação)
              </CardTitle>
              <CardDescription>Bloco exibido ao final da página de Autores, convidando novos colaboradores.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="a-final-titulo">Título</Label>
                <Input
                  id="a-final-titulo"
                  value={configDraft.autores.secaoFinalTitulo}
                  onChange={(e) =>
                    setConfigDraft({
                      ...configDraft,
                      autores: { ...configDraft.autores, secaoFinalTitulo: e.target.value },
                    })
                  }
                  className="rounded-xl bg-card"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="a-final-texto">Texto</Label>
                <Textarea
                  id="a-final-texto"
                  rows={3}
                  value={configDraft.autores.secaoFinalTexto}
                  onChange={(e) =>
                    setConfigDraft({
                      ...configDraft,
                      autores: { ...configDraft.autores, secaoFinalTexto: e.target.value },
                    })
                  }
                  className="rounded-xl bg-card"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB QUEM SOMOS */}
        <TabsContent value="quem-somos" className="mt-6 flex flex-col gap-6">
          <Card className="glass rounded-3xl border-0">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Informações Institucionais</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="q-titulo">Título</Label>
                <Input
                  id="q-titulo"
                  value={configDraft.quemSomos.titulo}
                  onChange={(e) =>
                    setConfigDraft({
                      ...configDraft,
                      quemSomos: { ...configDraft.quemSomos, titulo: e.target.value },
                    })
                  }
                  className="rounded-xl bg-card"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="q-subtitulo">Subtítulo</Label>
                <Textarea
                  id="q-subtitulo"
                  rows={2}
                  value={configDraft.quemSomos.subtitulo}
                  onChange={(e) =>
                    setConfigDraft({
                      ...configDraft,
                      quemSomos: { ...configDraft.quemSomos, subtitulo: e.target.value },
                    })
                  }
                  className="rounded-xl bg-card"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass rounded-3xl border-0">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Pilares</CardTitle>
              <CardDescription>Os quatro cartões exibidos logo abaixo do cabeçalho da página.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {configDraft.quemSomos.pilares.map((pilar, idx) => (
                <div key={idx} className="flex flex-col gap-2 rounded-2xl bg-card/80 p-4 border">
                  <Input
                    value={pilar.titulo}
                    onChange={(e) => {
                      const novos = [...configDraft.quemSomos.pilares]
                      novos[idx] = { ...novos[idx], titulo: e.target.value }
                      setConfigDraft({
                        ...configDraft,
                        quemSomos: { ...configDraft.quemSomos, pilares: novos },
                      })
                    }}
                    placeholder="Título do pilar"
                    className="rounded-xl bg-background font-semibold text-sm"
                  />
                  <Textarea
                    rows={3}
                    value={pilar.texto}
                    onChange={(e) => {
                      const novos = [...configDraft.quemSomos.pilares]
                      novos[idx] = { ...novos[idx], texto: e.target.value }
                      setConfigDraft({
                        ...configDraft,
                        quemSomos: { ...configDraft.quemSomos, pilares: novos },
                      })
                    }}
                    className="rounded-xl bg-background text-xs"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass rounded-3xl border-0">
            <CardHeader>
              <CardTitle className="font-serif text-xl flex items-center gap-2">
                <BookOpen className="size-5 text-primary" aria-hidden="true" />
                Nossa História
              </CardTitle>
              <CardDescription>Seção institucional exibida ao final da página "Quem Somos".</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="q-historia-titulo">Título da seção</Label>
                <Input
                  id="q-historia-titulo"
                  value={configDraft.quemSomos.historiaTitulo}
                  onChange={(e) =>
                    setConfigDraft({
                      ...configDraft,
                      quemSomos: { ...configDraft.quemSomos, historiaTitulo: e.target.value },
                    })
                  }
                  className="rounded-xl bg-card"
                />
              </div>

              {configDraft.quemSomos.historiaParagrafos.map((paragrafo, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <Label className="text-[11px] text-muted-foreground">Parágrafo {idx + 1}</Label>
                  <Textarea
                    rows={3}
                    value={paragrafo}
                    onChange={(e) => {
                      const novos = [...configDraft.quemSomos.historiaParagrafos]
                      novos[idx] = e.target.value
                      setConfigDraft({
                        ...configDraft,
                        quemSomos: { ...configDraft.quemSomos, historiaParagrafos: novos },
                      })
                    }}
                    className="rounded-xl bg-card"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB MENTORIA */}
        <TabsContent value="mentoria" className="mt-6 flex flex-col gap-6">
          <Card className="glass rounded-3xl border-0">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Página de Mentoria & Planos</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="m-titulo">Título da Mentoria</Label>
                <Input
                  id="m-titulo"
                  value={configDraft.mentoria.titulo}
                  onChange={(e) =>
                    setConfigDraft({
                      ...configDraft,
                      mentoria: { ...configDraft.mentoria, titulo: e.target.value },
                    })
                  }
                  className="rounded-xl bg-card"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="m-subtitulo">Subtítulo</Label>
                <Textarea
                  id="m-subtitulo"
                  rows={2}
                  value={configDraft.mentoria.subtitulo}
                  onChange={(e) =>
                    setConfigDraft({
                      ...configDraft,
                      mentoria: { ...configDraft.mentoria, subtitulo: e.target.value },
                    })
                  }
                  className="rounded-xl bg-card"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass rounded-3xl border-0">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Etapas do Processo</CardTitle>
              <CardDescription>Os três passos exibidos logo abaixo do cabeçalho da página.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              {configDraft.mentoria.etapas.map((etapa, idx) => (
                <div key={idx} className="flex flex-col gap-2 rounded-2xl bg-card/80 p-4 border">
                  <Label className="font-bold text-xs text-primary">Etapa #{idx + 1}</Label>
                  <Input
                    value={etapa.titulo}
                    onChange={(e) => {
                      const novas = [...configDraft.mentoria.etapas]
                      novas[idx] = { ...novas[idx], titulo: e.target.value }
                      setConfigDraft({
                        ...configDraft,
                        mentoria: { ...configDraft.mentoria, etapas: novas },
                      })
                    }}
                    placeholder="Título da etapa"
                    className="rounded-xl bg-background"
                  />
                  <Textarea
                    rows={3}
                    value={etapa.texto}
                    onChange={(e) => {
                      const novas = [...configDraft.mentoria.etapas]
                      novas[idx] = { ...novas[idx], texto: e.target.value }
                      setConfigDraft({
                        ...configDraft,
                        mentoria: { ...configDraft.mentoria, etapas: novas },
                      })
                    }}
                    placeholder="Descrição da etapa"
                    className="rounded-xl bg-background text-xs"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass rounded-3xl border-0">
            <CardHeader>
              <CardTitle className="font-serif text-xl flex items-center gap-2">
                <ListChecks className="size-5 text-primary" aria-hidden="true" />
                Planos de Mentoria
              </CardTitle>
              <CardDescription>Os cartões de "Formatos de Acompanhamento" exibidos na página.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {configDraft.mentoria.planos.map((plano, idx) => (
                <div key={idx} className="flex flex-col gap-3 rounded-2xl bg-card/80 p-4 border">
                  <div className="flex items-center justify-between gap-2">
                    <Label className="font-bold text-xs text-primary">Plano #{idx + 1}</Label>
                    <button
                      type="button"
                      aria-pressed={plano.destaque}
                      onClick={() => {
                        const novos = [...configDraft.mentoria.planos]
                        novos[idx] = { ...novos[idx], destaque: !novos[idx].destaque }
                        setConfigDraft({
                          ...configDraft,
                          mentoria: { ...configDraft.mentoria, planos: novos },
                        })
                      }}
                      className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        plano.destaque
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      <Star className="size-3" aria-hidden="true" fill={plano.destaque ? "currentColor" : "none"} />
                      Destaque
                    </button>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-[11px]">Nome do plano</Label>
                    <Input
                      value={plano.nome}
                      onChange={(e) => {
                        const novos = [...configDraft.mentoria.planos]
                        novos[idx] = { ...novos[idx], nome: e.target.value }
                        setConfigDraft({
                          ...configDraft,
                          mentoria: { ...configDraft.mentoria, planos: novos },
                        })
                      }}
                      className="rounded-xl bg-background"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-[11px]">Preço / chamada</Label>
                    <Input
                      value={plano.preco}
                      onChange={(e) => {
                        const novos = [...configDraft.mentoria.planos]
                        novos[idx] = { ...novos[idx], preco: e.target.value }
                        setConfigDraft({
                          ...configDraft,
                          mentoria: { ...configDraft.mentoria, planos: novos },
                        })
                      }}
                      className="rounded-xl bg-background"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-[11px]">Itens inclusos</Label>
                    {plano.itens.map((item, itemIdx) => (
                      <Input
                        key={itemIdx}
                        value={item}
                        onChange={(e) => {
                          const novos = [...configDraft.mentoria.planos]
                          const novosItens = [...novos[idx].itens]
                          novosItens[itemIdx] = e.target.value
                          novos[idx] = { ...novos[idx], itens: novosItens }
                          setConfigDraft({
                            ...configDraft,
                            mentoria: { ...configDraft.mentoria, planos: novos },
                          })
                        }}
                        className="rounded-xl bg-background text-xs"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}
