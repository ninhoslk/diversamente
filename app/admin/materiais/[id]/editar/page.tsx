"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { BookOpen, FileText, FolderKanban, Gamepad2, Loader2, Video } from "lucide-react"
import { toast } from "sonner"
import { Breadcrumbs } from "@/components/app/breadcrumbs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CATEGORIAS, PUBLICOS, TRILHAS, type PublicoSlug, type TipoMaterial } from "@/lib/catalog"
import { useApp } from "@/lib/app-provider"

const ICONE_TIPO: Record<TipoMaterial, typeof FileText> = {
  pdf: FileText,
  video: Video,
  jogo: Gamepad2,
  manual: BookOpen,
  projeto: FolderKanban,
}
const LABEL_TIPO: Record<TipoMaterial, string> = {
  pdf: "PDF",
  video: "Vídeo",
  jogo: "Jogo",
  manual: "Manual",
  projeto: "Projeto",
}

export default function EditarMaterialPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { materiais, carregandoMateriais, atualizarMaterial } = useApp()

  const material = useMemo(() => materiais.find((m) => m.id === params.id), [materiais, params.id])

  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [trilha, setTrilha] = useState("")
  const [categoria, setCategoria] = useState("")
  const [publico, setPublico] = useState<PublicoSlug | "">("")
  const [url, setUrl] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [inicializado, setInicializado] = useState(false)

  useEffect(() => {
    if (material && !inicializado) {
      setTitulo(material.titulo)
      setDescricao(material.descricao)
      setTrilha(material.trilha)
      setCategoria(material.categoria)
      setPublico(material.publico)
      setUrl(material.url)
      setInicializado(true)
    }
  }, [material, inicializado])

  const categoriasDaTrilha = useMemo(() => CATEGORIAS.filter((c) => c.trilha === trilha), [trilha])
  const publicosDaCategoria = useMemo(
    () => categoriasDaTrilha.find((c) => c.slug === categoria)?.publicos ?? [],
    [categoriasDaTrilha, categoria],
  )

  function onTrilhaChange(valor: string | null) {
    setTrilha(valor ?? "")
    setCategoria("")
    setPublico("")
  }

  function onCategoriaChange(valor: string | null) {
    setCategoria(valor ?? "")
    setPublico("")
  }

  const temArquivoEnviado = Boolean(material?.storagePath)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)

    if (!material) return
    if (!titulo.trim()) return setErro("Informe o título do material.")
    if (!categoria) return setErro("Escolha a categoria de destino.")
    if (!publico) return setErro("Escolha o público que verá este material.")
    if (!temArquivoEnviado && !url.trim()) return setErro("Informe o link do material.")

    setEnviando(true)
    const resultado = await atualizarMaterial(material.id, {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      trilha,
      categoria,
      publico,
      ...(temArquivoEnviado ? {} : { url: url.trim() }),
    })
    setEnviando(false)

    if (!resultado.ok) {
      setErro(resultado.erro ?? "Não foi possível salvar as alterações. Tente novamente.")
      return
    }

    toast.success("Material atualizado com sucesso!", { description: titulo.trim() })
    router.push("/admin/materiais")
  }

  if (carregandoMateriais && !material) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    )
  }

  if (!material) {
    return (
      <>
        <Breadcrumbs
          itens={[
            { label: "Painel Admin", href: "/admin" },
            { label: "Materiais", href: "/admin/materiais" },
            { label: "Material não encontrado" },
          ]}
        />
        <p className="mt-8 text-sm text-muted-foreground">
          Este material não foi encontrado. Ele pode ter sido removido.
        </p>
        <Button className="mt-4 rounded-full" onClick={() => router.push("/admin/materiais")}>
          Voltar para Materiais
        </Button>
      </>
    )
  }

  const IconeTipo = ICONE_TIPO[material.tipo]

  return (
    <>
      <Breadcrumbs
        itens={[
          { label: "Painel Admin", href: "/admin" },
          { label: "Materiais", href: "/admin/materiais" },
          { label: "Editar material" },
        ]}
      />

      <div className="max-w-xl">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Editar material</h1>
        <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
          Atualize o título, a descrição, o link e o destino deste material.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <Card className="glass rounded-3xl border-0">
          <CardHeader>
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <IconeTipo className="size-5 text-primary" aria-hidden="true" />
              Informações do material
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full text-[10px] uppercase">
                {LABEL_TIPO[material.tipo]}
              </Badge>
              O tipo do material não pode ser alterado após a criação.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex.: Caderno de Atividades — 1º Ano"
                className="rounded-xl bg-card"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Resumo curto sobre o objetivo pedagógico deste material."
                rows={3}
                className="rounded-xl bg-card"
              />
            </div>

            {temArquivoEnviado ? (
              <div className="rounded-xl border border-border bg-card/60 p-3 text-xs text-muted-foreground">
                Este PDF foi enviado como arquivo. Para trocar o arquivo, exclua este material e cadastre um novo.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Label htmlFor="url">{material.tipo === "video" ? "Link do vídeo" : material.tipo === "jogo" ? "Link do jogo" : "Link do PDF"}</Label>
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="rounded-xl bg-card"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass rounded-3xl border-0">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Destino</CardTitle>
            <CardDescription>Onde o material aparecerá para os usuários.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="trilha">Trilha</Label>
              <Select value={trilha} onValueChange={onTrilhaChange}>
                <SelectTrigger id="trilha" className="rounded-xl bg-card">
                  <SelectValue>{(v: string) => TRILHAS.find((t) => t.slug === v)?.nome ?? v}</SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {TRILHAS.map((t) => (
                    <SelectItem key={t.slug} value={t.slug}>
                      {t.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={categoria} onValueChange={onCategoriaChange}>
                <SelectTrigger id="categoria" className="rounded-xl bg-card">
                  <SelectValue placeholder="Selecione a categoria">
                    {(v: string) => (v ? (categoriasDaTrilha.find((c) => c.slug === v)?.nome ?? v) : "Selecione a categoria")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {categoriasDaTrilha.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="publico">Público</Label>
              <Select value={publico} onValueChange={(v) => setPublico(v as PublicoSlug)} disabled={!categoria}>
                <SelectTrigger id="publico" className="rounded-xl bg-card">
                  <SelectValue placeholder={categoria ? "Selecione o público" : "Escolha a categoria primeiro"}>
                    {(v: PublicoSlug) =>
                      v ? (PUBLICOS[v] ?? v) : categoria ? "Selecione o público" : "Escolha a categoria primeiro"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {publicosDaCategoria.map((p) => (
                    <SelectItem key={p} value={p}>
                      {PUBLICOS[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {erro ? (
              <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive font-medium">
                {erro}
              </p>
            ) : null}

            <div className="flex flex-col gap-2">
              <Button type="submit" size="lg" disabled={enviando} className="rounded-full">
                {enviando ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar alterações"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                disabled={enviando}
                className="rounded-full"
                onClick={() => router.push("/admin/materiais")}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </>
  )
}
