"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, FileWarning, Loader2, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Leitor de PDF protegido.
 * - Renderiza via canvas (pdfjs), nunca com o iframe nativo do navegador.
 * - Carrega e desenha apenas a página atual (lazy loading / paginação), sem manter
 *   o documento inteiro renderizado em memória.
 * - Sem botões de download/impressão e com menu de contexto desabilitado.
 */
export function PdfViewer({ url, titulo }: { url: string; titulo: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const docRef = useRef<{ numPages: number; getPage: (n: number) => Promise<unknown> } | null>(null)
  const renderTaskRef = useRef<{ cancel: () => void } | null>(null)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [escala, setEscala] = useState(1.1)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  // Carrega o documento uma única vez.
  useEffect(() => {
    let cancelado = false

    async function carregar() {
      if (!url) {
        setErro("Este material ainda não possui arquivo publicado.")
        setCarregando(false)
        return
      }
      try {
        const pdfjs = await import("react-pdf").then((m) => m.pdfjs)
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
        const doc = await pdfjs.getDocument({ url }).promise
        if (cancelado) return
        docRef.current = doc as never
        setTotalPaginas(doc.numPages)
        setPagina(1)
      } catch (e) {
        console.log("[v0] erro ao carregar pdf:", e)
        if (!cancelado) setErro("Não foi possível abrir este documento.")
      } finally {
        if (!cancelado) setCarregando(false)
      }
    }

    carregar()
    return () => {
      cancelado = true
      docRef.current = null
    }
  }, [url])

  // Renderiza apenas a página atual.
  const renderizar = useCallback(async () => {
    const doc = docRef.current
    const canvas = canvasRef.current
    if (!doc || !canvas) return

    renderTaskRef.current?.cancel()

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

    const task = page.render({ canvasContext: ctx, viewport, transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined })
    renderTaskRef.current = task
    try {
      await task.promise
    } catch {
      // render cancelado ao trocar de página — comportamento esperado
    }
  }, [pagina, escala])

  useEffect(() => {
    if (totalPaginas > 0) renderizar()
    return () => renderTaskRef.current?.cancel()
  }, [totalPaginas, renderizar])

  if (carregando) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-2xl bg-secondary/50">
        <Loader2 className="size-6 animate-spin text-primary" aria-label="Carregando documento" />
      </div>
    )
  }

  if (erro) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-2xl bg-secondary/50 p-8 text-center">
        <FileWarning className="size-8 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">{erro}</p>
      </div>
    )
  }

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
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Material protegido — visualização exclusiva na plataforma. Download e impressão desabilitados.
      </p>
    </div>
  )
}
