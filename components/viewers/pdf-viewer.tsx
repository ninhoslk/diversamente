"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, ExternalLink, FileWarning, Loader2, RefreshCw, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"

function formatarUrlPdf(urlOriginal: string): string {
  if (!urlOriginal) return ""
  let url = urlOriginal.trim()

  // Converte links de visualizacao do Google Drive em links de preview incorporados
  if (url.includes("drive.google.com")) {
    const match = url.match(/\/file\/d\/([^\/]+)/) || url.match(/id=([^&]+)/)
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`
    }
  }

  return url
}

export function PdfViewer({ url: urlProp, titulo }: { url: string; titulo: string }) {
  const url = formatarUrlPdf(urlProp)
  const isGoogleDrive = url.includes("drive.google.com")

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const docRef = useRef<{ numPages: number; getPage: (n: number) => Promise<unknown> } | null>(null)
  const renderTaskRef = useRef<{ cancel: () => void } | null>(null)

  const [totalPaginas, setTotalPaginas] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [escala, setEscala] = useState(1.1)
  const [carregando, setCarregando] = useState(true)
  const [usarFallbackIframe, setUsarFallbackIframe] = useState(isGoogleDrive)
  const [erro, setErro] = useState<string | null>(null)

  // Tenta carregar via PDF.js se não for link direto do Google Drive/Iframe
  useEffect(() => {
    let cancelado = false

    async function carregarPdfJs() {
      if (!url) {
        setErro("Este material ainda não possui um arquivo válido cadastrado.")
        setCarregando(false)
        return
      }

      // Se for Google Drive preview ou se já ativou fallback, usa Iframe direto
      if (isGoogleDrive) {
        setUsarFallbackIframe(true)
        setCarregando(false)
        return
      }

      try {
        setCarregando(true)
        setErro(null)

        const pdfjs = await import("react-pdf").then((m) => m.pdfjs)
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

        const doc = await pdfjs.getDocument({ url }).promise
        if (cancelado) return

        docRef.current = doc as never
        setTotalPaginas(doc.numPages)
        setPagina(1)
        setUsarFallbackIframe(false)
      } catch (e) {
        console.warn("PDF.js não pôde processar o arquivo diretamente, ativando leitor alternativo:", e)
        if (!cancelado) {
          // Ativa o leitor alternativo em iframe/Google Docs Viewer para evitar falha
          setUsarFallbackIframe(true)
        }
      } finally {
        if (!cancelado) setCarregando(false)
      }
    }

    carregarPdfJs()

    return () => {
      cancelado = true
      docRef.current = null
    }
  }, [url, isGoogleDrive])

  // Renderiza a pagina no Canvas (quando usando PDF.js)
  const renderizarPagina = useCallback(async () => {
    const doc = docRef.current
    const canvas = canvasRef.current
    if (!doc || !canvas || usarFallbackIframe) return

    renderTaskRef.current?.cancel()

    try {
      const page = (await doc.getPage(pagina)) as {
        getViewport: (o: { scale: number }) => { width: number; height: number }
        render: (o: unknown) => { promise: Promise<void>; cancel: () => void }
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const viewport = page.getViewport({ scale: escala })
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      canvas.width = Math.floor(viewport.width * dpr)
      canvas.height = Math.floor(viewport.height * dpr)
      canvas.style.width = "100%"
      canvas.style.height = "auto"

      const task = page.render({
        canvasContext: ctx,
        viewport,
        transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined,
      })
      renderTaskRef.current = task
      await task.promise
    } catch {
      // cancelamento normal de troca de pagina
    }
  }, [pagina, escala, usarFallbackIframe])

  useEffect(() => {
    if (totalPaginas > 0 && !usarFallbackIframe) {
      renderizarPagina()
    }
    return () => renderTaskRef.current?.cancel()
  }, [totalPaginas, renderizarPagina, usarFallbackIframe])

  if (carregando) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center gap-3 rounded-2xl bg-secondary/50 p-8">
        <Loader2 className="size-7 animate-spin text-primary" aria-label="Carregando PDF..." />
        <p className="text-xs text-muted-foreground">Preparando visualizador do documento...</p>
      </div>
    )
  }

  if (erro) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-2xl bg-secondary/50 p-8 text-center">
        <FileWarning className="size-8 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm font-medium text-foreground">{erro}</p>
        <Button asChild variant="outline" size="sm" className="mt-2 rounded-full">
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-3.5" /> Abrir link do arquivo
          </a>
        </Button>
      </div>
    )
  }

  // MODO 1: Leitor via Iframe (para Google Drive ou quando a estrutura do PDF exige visualizador nativo)
  if (usarFallbackIframe) {
    const embedUrl = isGoogleDrive
      ? url
      : `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`

    return (
      <div className="flex flex-col gap-3">
        <div className="relative aspect-[4/3] w-full min-h-[500px] overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
          <iframe
            src={embedUrl}
            title={`Leitor de PDF - ${titulo}`}
            className="h-full w-full border-0"
            allow="autoplay"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>Visualizador seguro ativado.</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
          >
            Abrir arquivo completo <ExternalLink className="size-3" />
          </a>
        </div>
      </div>
    )
  }

  // MODO 2: Leitor via Canvas PDF.js (Sem downloads e protegido)
  return (
    <div className="flex flex-col gap-4">
      <div
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        className="no-select overflow-auto rounded-2xl bg-secondary/40 p-3"
      >
        <canvas ref={canvasRef} aria-label={`Página ${pagina} de ${titulo}`} className="mx-auto rounded-xl shadow-sm" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-card/80"
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
            disabled={pagina <= 1}
            aria-label="Página anterior"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="min-w-24 text-center text-sm text-muted-foreground">
            {pagina} / {totalPaginas}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-card/80"
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
            disabled={pagina >= totalPaginas}
            aria-label="Próxima página"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-card/80"
            onClick={() => setEscala((s) => Math.max(0.6, Number((s - 0.2).toFixed(1))))}
            aria-label="Diminuir zoom"
          >
            <ZoomOut className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-card/80"
            onClick={() => setEscala((s) => Math.min(2.4, Number((s + 0.2).toFixed(1))))}
            aria-label="Aumentar zoom"
          >
            <ZoomIn className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full bg-card/80 text-xs"
            onClick={() => setUsarFallbackIframe(true)}
            title="Alternar para o leitor em modo tela cheia/embed"
          >
            <RefreshCw className="size-3.5" /> Alternar leitor
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Material pedagógico exclusivo — visualização protegida na plataforma.
      </p>
    </div>
  )
}
