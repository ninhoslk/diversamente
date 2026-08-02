"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { FileText, Gamepad2, UploadCloud, Video } from "lucide-react"
import { toast } from "sonner"
import { Breadcrumbs } from "@/components/app/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CATEGORIAS, PUBLICOS, TRILHAS, type PublicoSlug, type TipoMaterial } from "@/lib/catalog"
import { useApp } from "@/lib/app-provider"
import { cn } from "@/lib/utils"

const TIPOS_FORM: { slug: TipoMaterial; label: string; ajuda: string; Icon: typeof FileText }[] = [
  { slug: "pdf", label: "PDF", ajuda: "Leitura protegida, sem download", Icon: FileText },
  { slug: "video", label: "Vídeo", ajuda: "YouTube, Vimeo ou arquivo MP4", Icon: Video },
  { slug: "jogo", label: "Jogo", ajuda: "Link para atividade interativa", Icon: Gamepad2 },
]

export default function NovoMaterialPage() {
  const router = useRouter()
  const { adicionarMaterial } = useApp()

  const [tipo, setTipo] = useState<TipoMaterial>("pdf")
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [trilha, setTrilha] = useState(TRILHAS[0].slug)
  const [categoria, setCategoria] = useState("")
  const [publico, setPublico] = useState<PublicoSlug | "">("")
  const [url, setUrl] = useState("")
  const [arquivo, setArquivo] = useState<string>("")
  const [erro, setErro] = useState<string | null>(null)

  const categoriasDaTrilha = useMemo(() => CATEGORIAS.filter((c) => c.trilha === trilha), [trilha])
  const publicosDaCategoria = useMemo(
    () => categoriasDaTrilha.find((c) => c.slug === categoria)?.publicos ?? [],
    [categoriasDaTrilha, categoria],
  )

  function onTrilhaChange(valor: string) {
    setTrilha(valor)
    setCategoria("")
    setPublico("")
  }

  function onCategoriaChange(valor: string) {
    setCategoria(valor)
    setPublico("")
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)

    if (!titulo.trim()) return setErro("Informe o título do material.")
    if (!categoria) return setErro("Escolha a categoria de destino.")
    if (!publico) return setErro("Escolha o público que verá este material.")
    if (tipo === "pdf" && !arquivo) return setErro("Selecione o arquivo PDF.")
    if (tipo !== "pdf" && !url.trim()) return setErro("Informe o link do material.")

    adicionarMaterial({
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      tipo,
      url: tipo === "pdf" ? arquivo : url.trim(),
      trilha,
      categoria,
      publico: publico as PublicoSlug,
    })

    toast.success("Material publicado", { description: titulo.trim() })
    router.push("/admin/materiais")
  }

  return (
    <>
      <Breadcrumbs
        itens={[
          { label: "Painel Admin", href: "/admin" },
          { label: "Materiais", href: "/admin/materiais" },
          { label: "Novo material" },
        ]}
      />

      <div className="max-w-xl">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Novo material</h1>
        <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
          Publique um PDF, vídeo ou jogo diretamente na trilha e no público certos.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <Card className="glass rounded-3xl border-0">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Informações do material</CardTitle>
            <CardDescription>Tudo o que o educador ou a família verá na biblioteca.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-1 text-sm font-medium">Tipo de material</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {TIPOS_FORM.map(({ slug, label, ajuda, Icon }) => (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => setTipo(slug)}
                    aria-pressed={tipo === slug}
                    className={cn(
                      "flex flex-col items-start gap-1.5 rounded-2xl border-2 bg-card/70 p-4 text-left transition-all",
                      tipo === slug
                        ? "border-primary shadow-sm"
                        : "border-transparent hover:border-border hover:bg-card",
                    )}
                  >
                    <Icon className="size-5 text-primary" aria-hidden="true" />
                    <span className="text-sm font-medium">{label}</span>
                    <span className="text-xs leading-relaxed text-muted-foreground">{ajuda}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-col gap-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex.: Caderno de atividades — 2º Ano"
                className="rounded-xl bg-card"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Resumo curto sobre o objetivo do material."
                rows={3}
                className="rounded-xl bg-card"
              />
            </div>

            {tipo === "pdf" ? (
              <div className="flex flex-col gap-2">
                <Label htmlFor="arquivo">Arquivo PDF</Label>
                <label
                  htmlFor="arquivo"
                  className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card/60 px-4 py-8 text-center transition-colors hover:border-primary/60 hover:bg-card"
                >
                  <UploadCloud className="size-6 text-primary" aria-hidden="true" />
                  <span className="text-sm font-medium">{arquivo ? arquivo : "Clique para selecionar o PDF"}</span>
                  <span className="text-xs text-muted-foreground">
                    O arquivo será exibido no leitor protegido, sem opção de download.
                  </span>
                </label>
                <Input
                  id="arquivo"
                  type="file"
                  accept="application/pdf"
                  className="sr-only"
                  onChange={(e) => setArquivo(e.target.files?.[0]?.name ?? "")}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Label htmlFor="url">{tipo === "video" ? "Link do vídeo" : "Link do jogo"}</Label>
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={tipo === "video" ? "https://youtube.com/watch?v=..." : "https://..."}
                  className="rounded-xl bg-card"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass rounded-3xl border-0">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Destino</CardTitle>
            <CardDescription>Onde o material aparecerá na navegação.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="trilha">Trilha</Label>
              <Select value={trilha} onValueChange={onTrilhaChange}>
                <SelectTrigger id="trilha" className="rounded-xl bg-card">
                  <SelectValue />
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
                  <SelectValue placeholder="Selecione a categoria" />
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
                  <SelectValue placeholder={categoria ? "Selecione o público" : "Escolha a categoria primeiro"} />
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
              <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {erro}
              </p>
            ) : null}

            <div className="flex flex-col gap-2">
              <Button type="submit" size="lg" className="rounded-full">
                Publicar material
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
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
