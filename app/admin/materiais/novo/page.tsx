"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { BookOpen, FileText, FolderKanban, Gamepad2, Headphones, Loader2, UploadCloud, Video, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { Breadcrumbs } from "@/components/app/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CATEGORIAS, PUBLICOS, TRILHAS, tiposDisponiveisNaTrilha, type PublicoSlug, type TipoMaterial } from "@/lib/catalog"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

const TAMANHO_MAXIMO_PDF = 150 * 1024 * 1024 // 150MB — deve casar com o file_size_limit do bucket "materiais" (supabase/schema.sql)

// Tipos que usam o mesmo fluxo de PDF (upload direto ou link) — manuais e
// projetos da Educação Ambiental são publicados como PDF, só ficam em abas
// separadas de "PDF's" na navegação.
const TIPOS_COMO_PDF: TipoMaterial[] = ["pdf", "manual", "projeto"]

const TIPOS_FORM_BASE: { slug: TipoMaterial; label: string; ajuda: string; Icon: typeof FileText }[] = [
  { slug: "pdf", label: "PDF", ajuda: "Leitura protegida no site, sem download", Icon: FileText },
  { slug: "video", label: "Vídeo", ajuda: "YouTube, Vimeo ou arquivo de vídeo", Icon: Video },
  { slug: "jogo", label: "Jogo", ajuda: "Link para atividade interativa", Icon: Gamepad2 },
]

const TIPOS_FORM_EXTRAS: Record<string, { slug: TipoMaterial; label: string; ajuda: string; Icon: typeof FileText }> = {
  manual: { slug: "manual", label: "Manual", ajuda: "PDF protegido, aba separada de 'Manuais'", Icon: BookOpen },
  projeto: { slug: "projeto", label: "Projeto", ajuda: "PDF protegido, aba separada de 'Projetos'", Icon: FolderKanban },
  audio: { slug: "audio", label: "Áudio", ajuda: "Link para faixa de áudio (mesmo fluxo do Jogo)", Icon: Headphones },
}

export default function NovoMaterialPage() {
  const router = useRouter()

  const [tipo, setTipo] = useState<TipoMaterial>("pdf")
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [trilha, setTrilha] = useState(TRILHAS[0].slug)
  const [categoria, setCategoria] = useState("")
  const [publico, setPublico] = useState<PublicoSlug | "">("")
  const [url, setUrl] = useState("")
  const [arquivoPdf, setArquivoPdf] = useState<File | null>(null)
  const [modoPdf, setModoPdf] = useState<"upload" | "link">("upload")
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const categoriasDaTrilha = useMemo(() => CATEGORIAS.filter((c) => c.trilha === trilha), [trilha])
  const publicosDaCategoria = useMemo(
    () => categoriasDaTrilha.find((c) => c.slug === categoria)?.publicos ?? [],
    [categoriasDaTrilha, categoria],
  )
  const tiposFormDisponiveis = useMemo(() => {
    const extras = TRILHAS.find((t) => t.slug === trilha)?.tiposExtras ?? []
    return [...TIPOS_FORM_BASE, ...extras.map((slug) => TIPOS_FORM_EXTRAS[slug]).filter(Boolean)]
  }, [trilha])

  function onTrilhaChange(valor: string | null) {
    const novaTrilha = valor ?? TRILHAS[0].slug
    setTrilha(novaTrilha)
    setCategoria("")
    setPublico("")
    // Se o tipo selecionado (ex.: Manual/Projeto/Áudio) só existe na trilha
    // anterior, volta para PDF em vez de deixar o formulário num estado inválido.
    if (!tiposDisponiveisNaTrilha(novaTrilha).includes(tipo)) {
      setTipo("pdf")
    }
  }

  function onCategoriaChange(valor: string | null) {
    setCategoria(valor ?? "")
    setPublico("")
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)

    if (!titulo.trim()) return setErro("Informe o título do material.")
    if (!categoria) return setErro("Escolha a categoria de destino.")
    if (!publico) return setErro("Escolha o público que verá este material.")
    if (TIPOS_COMO_PDF.includes(tipo) && modoPdf === "upload" && !arquivoPdf) return setErro("Selecione o arquivo PDF para upload.")
    if (TIPOS_COMO_PDF.includes(tipo) && modoPdf === "link" && !url.trim()) return setErro("Informe o link do PDF.")
    if (!TIPOS_COMO_PDF.includes(tipo) && !url.trim()) return setErro("Informe o link do material.")

    try {
      setEnviando(true)

      let storagePath: string | null = null

      if (TIPOS_COMO_PDF.includes(tipo) && modoPdf === "upload" && arquivoPdf) {
        // Upload direto do navegador para o Storage via URL assinada — o arquivo
        // nunca passa pela função serverless, evitando o limite de payload (413).
        const resUrl = await fetch("/api/materiais/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trilha, categoria, nomeArquivo: arquivoPdf.name }),
        })
        const dadosUrl = await resUrl.json()
        if (!resUrl.ok || !dadosUrl.ok) {
          setErro(dadosUrl.erro ?? "Não foi possível preparar o upload do arquivo.")
          return
        }

        const supabase = createClient()
        const { error: erroUpload } = await supabase.storage
          .from("materiais")
          .uploadToSignedUrl(dadosUrl.path, dadosUrl.token, arquivoPdf, { contentType: "application/pdf" })

        if (erroUpload) {
          setErro("Não foi possível enviar o arquivo PDF. Tente novamente.")
          return
        }

        storagePath = dadosUrl.path
      }

      const corpo: Record<string, unknown> = {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        tipo,
        trilha,
        categoria,
        publico,
      }

      if (storagePath) {
        corpo.storagePath = storagePath
      } else {
        corpo.url = url.trim()
      }

      const res = await fetch("/api/materiais", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo),
      })
      const data = await res.json()

      if (!res.ok || !data.ok) {
        setErro(data.erro ?? "Não foi possível publicar o material. Tente novamente.")
        return
      }

      toast.success("Material publicado com sucesso!", {
        description: `${titulo.trim()} já está disponível na biblioteca.`,
      })
      router.push("/admin/materiais")
    } catch {
      setErro("Erro de conexão ao publicar o material. Tente novamente.")
    } finally {
      setEnviando(false)
    }
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
          Faça o upload do PDF ou cadastre links de vídeos e jogos para a biblioteca. Na Educação Ambiental também é
          possível publicar Manuais e Projetos, e na Educação Infantil e no Fundamental I também dá para publicar Áudios.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <Card className="glass rounded-3xl border-0">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Informações do material</CardTitle>
            <CardDescription>O arquivo fica protegido e privado na plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-1 text-sm font-medium">Tipo de material</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {tiposFormDisponiveis.map(({ slug, label, ajuda, Icon }) => (
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

            {TIPOS_COMO_PDF.includes(tipo) ? (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <legend className="text-sm font-medium">Origem do PDF</legend>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setModoPdf("upload")}
                      aria-pressed={modoPdf === "upload"}
                      className={cn(
                        "rounded-xl border-2 px-3 py-2 text-sm font-medium transition-colors",
                        modoPdf === "upload" ? "border-primary bg-primary/5" : "border-transparent bg-card/70 hover:border-border",
                      )}
                    >
                      Enviar arquivo
                    </button>
                    <button
                      type="button"
                      onClick={() => setModoPdf("link")}
                      aria-pressed={modoPdf === "link"}
                      className={cn(
                        "rounded-xl border-2 px-3 py-2 text-sm font-medium transition-colors",
                        modoPdf === "link" ? "border-primary bg-primary/5" : "border-transparent bg-card/70 hover:border-border",
                      )}
                    >
                      Colar link
                    </button>
                  </div>
                </div>

                {modoPdf === "upload" ? (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="arquivo-pdf">Arquivo PDF (Upload direto)</Label>
                    <label
                      htmlFor="arquivo-pdf"
                      className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card/60 px-4 py-8 text-center transition-colors hover:border-primary/60 hover:bg-card"
                    >
                      <UploadCloud className="size-7 text-primary" aria-hidden="true" />
                      {arquivoPdf ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-sm font-semibold text-primary">{arquivoPdf.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {(arquivoPdf.size / (1024 * 1024)).toFixed(1)} MB · Pronto para upload seguro
                          </span>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm font-medium">Clique para selecionar o PDF do seu computador</span>
                          <span className="text-xs text-muted-foreground">
                            O arquivo fica em um repositório privado e é exibido com leitor protegido (sem download/impressão).
                          </span>
                        </>
                      )}
                    </label>
                    <Input
                      id="arquivo-pdf"
                      type="file"
                      accept="application/pdf"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        e.target.value = "" // permite selecionar o mesmo arquivo de novo após um erro
                        if (!file) return

                        if (file.type !== "application/pdf") {
                          setArquivoPdf(null)
                          setErro("O arquivo selecionado não é um PDF.")
                          return
                        }
                        if (file.size > TAMANHO_MAXIMO_PDF) {
                          setArquivoPdf(null)
                          setErro(
                            `O arquivo tem ${(file.size / (1024 * 1024)).toFixed(1)} MB — o limite é ${TAMANHO_MAXIMO_PDF / (1024 * 1024)} MB.`,
                          )
                          return
                        }
                        setErro(null)
                        setArquivoPdf(file)
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="url-pdf">Link do PDF</Label>
                    <Input
                      id="url-pdf"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://..."
                      className="rounded-xl bg-card"
                    />
                    <span className="text-xs text-muted-foreground">
                      Use para PDFs já hospedados (ex.: Google Drive). O controle de download depende das permissões do link original.
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Label htmlFor="url">
                  {tipo === "video" ? "Link do vídeo" : tipo === "audio" ? "Link do áudio" : "Link do jogo"}
                </Label>
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

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground flex items-start gap-2">
              <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
              <span>Proteção ativada: PDF renderizado via Canvas sem botões de salvar, imprimir ou baixar.</span>
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
                    Enviando arquivo...
                  </>
                ) : (
                  "Publicar material"
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
