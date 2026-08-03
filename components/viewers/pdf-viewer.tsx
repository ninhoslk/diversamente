"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileWarning,
  Loader2,
  Maximize2,
  RefreshCw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"

function formatarUrlPdf(urlOriginal: string): string {
  if (!urlOriginal) return ""
  let url = urlOriginal.trim()

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

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const docRef = useRef<{ numPages: number; getPage: (n: number) => Promise<unknown> } | null>(null)
  const renderTaskRef = useRef<{ cancel: () => void } | null>(null)

  // Gestos de Touch / Swipe em Celulares
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const [totalPaginas, setTotalPaginas] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [paginaInput, setPaginaInput] = useState("1")
  const [escala, setEscala] = useState(1.2)
  const [carregando, setCarregando] = useState(true)
  const [usarFallbackIframe, setUsarFallbackIframe] = useState(isGoogleDrive)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  // Sincroniza o input numérico com o estado da página
  useEffect(() => {
    setPaginaInput(String(pagina))
  }, [pagina])

  // Escuta alteração de Tela Cheia
  useEffect(() => {
    function onFullScreenChange() {
      setIsFullScreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener("fullscreenchange", onFullScreenChange)
    return () => document.removeEventListener("fullscreenchange", onFullScreenChange)
  }, [])

  // Alterna o Modo Tela Cheia
  const alternarTelaCheia = useCallback(() => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {
        setIsFullScreen(true)
      })
    } else {
      document.exitFullscreen().catch(() => {
        setIsFullScreen(false)
      })
    }
  }, [])

  // Aplica o salto direto de página
  const irParaPaginaDireta = useCallback(() => {
    const num = parseInt(paginaInput, 10)
    if (!isNaN(num) && num >= 1 && num <= totalPaginas) {
      setPagina(num)
    } else {
      setPaginaInput(String(pagina))
    }
  }, [paginaInput, totalPaginas, pagina])

  // Trata o deslize de dedo (Swipe) no celular
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    const deltaY = e.changedTouches[0].clientY - touchStartY.current

    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        setPagina((p) => Math.min(totalPaginas, p + 1))
      } else {
        setPagina((p) => Math.max(1, p - 1))
      }
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  // Carrega o PDF via PDF.js
  useEffect(() => {
    let cancelado = false

    async function carregarPdfJs() {
      if (!url) {
        setErro("Este material ainda não possui um arquivo válido cadastrado.")
        setCarregando(false)
        return
      }

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
        console.warn("PDF.js alternando para leitor embutido:", e)
        if (!cancelado) setUsarFallbackIframe(true)
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

  // Renderiza a página no Canvas
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
      const viewport = page.getViewport({ scale: isFullScreen ? escala * 1.3 : escala })
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
      // cancelamento normal
    }
  }, [pagina, escala, usarFallbackIframe, isFullScreen])

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

  // =========================================================================
  // MODO TELA CHEIA 100% PURA (SEM BORDAS OU CONTAINER / BOTÃO 'X' NO CANTO INFERIOR ESQUERDO)
  // =========================================================================
  if (isFullScreen) {
    return (
      <div
        ref={containerRef}
        className="fixed inset-0 z-[100] h-screen w-screen bg-slate-950 text-white flex flex-col justify-between overflow-hidden p-0 m-0 rounded-none border-0 select-none"
      >
        {/* AREA CENTRAL DO PDF */}
        <div
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="relative flex-1 w-full h-full flex items-center justify-center overflow-auto p-1 sm:p-3"
        >
          {usarFallbackIframe ? (
            <iframe
              src={
                isGoogleDrive
                  ? url
                  : `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
              }
              title={`Leitor de PDF - ${titulo}`}
              className="h-full w-full border-0 bg-white"
              allow="autoplay"
            />
          ) : (
            <canvas
              ref={canvasRef}
              aria-label={`Página ${pagina} de ${titulo}`}
              className="max-h-full max-w-full object-contain shadow-2xl"
            />
          )}
        </div>

        {/* CONTROLES FLUTUANTES DE NAVEGAÇÃO NO CENTRO INFERIOR */}
        {!usarFallbackIframe && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-2 rounded-full bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 backdrop-blur-md shadow-2xl">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full text-slate-300 hover:text-white hover:bg-slate-800"
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={pagina <= 1}
            >
              <ChevronLeft className="size-4" />
            </Button>

            <div className="flex items-center gap-1 text-xs font-semibold text-slate-200">
              <input
                type="number"
                min={1}
                max={totalPaginas}
                value={paginaInput}
                onChange={(e) => setPaginaInput(e.target.value)}
                onBlur={irParaPaginaDireta}
                onKeyDown={(e) => e.key === "Enter" && irParaPaginaDireta()}
                className="w-8 text-center bg-slate-800 text-white font-bold rounded px-1 py-0.5 outline-none border border-slate-700 text-xs"
              />
              <span className="text-slate-400">/ {totalPaginas}</span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full text-slate-300 hover:text-white hover:bg-slate-800"
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={pagina >= totalPaginas}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}

        {/* BOTÃO PEQUENO 'X' NO CANTO INFERIOR ESQUERDO PARA SAIR DA TELA CHEIA */}
        <button
          type="button"
          onClick={alternarTelaCheia}
          aria-label="Sair da tela cheia"
          title="Sair da tela cheia"
          className="fixed bottom-4 left-4 z-[120] flex size-10 items-center justify-center rounded-full bg-slate-900/90 text-slate-200 border border-slate-700/80 shadow-2xl transition-transform hover:scale-110 hover:bg-red-600 hover:text-white hover:border-red-500 backdrop-blur-md"
        >
          <X className="size-5" />
        </button>
      </div>
    )
  }

  // =========================================================================
  // MODO EMBEDDED PADRÃO (NO CONTAINER DA PÁGINA)
  // =========================================================================
  if (usarFallbackIframe) {
    const embedUrl = isGoogleDrive
      ? url
      : `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`

    return (
      <div ref={containerRef} className="flex flex-col gap-3 bg-background p-2 rounded-2xl">
        <div className="relative aspect-[4/3] w-full min-h-[450px] sm:min-h-[600px] overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
          <iframe
            src={embedUrl}
            title={`Leitor de PDF - ${titulo}`}
            className="h-full w-full border-0"
            allow="autoplay"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground px-2">
          <span>Leitor seguro ativo.</span>
          <Button variant="ghost" size="sm" onClick={alternarTelaCheia} className="rounded-full text-xs gap-1.5">
            <Maximize2 className="size-3.5 text-primary" /> Tela Cheia
          </Button>
        </div>
      </div>
    )
  }

  // MODO CANVAS PROTEGIDO PADRÃO
  return (
    <div ref={containerRef} className="flex flex-col gap-3 rounded-2xl bg-background">
      {/* AREA DO CANVAS COM SUPORTE A TOUCH SWIPE */}
      <div
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="no-select touch-pan-y relative overflow-auto rounded-2xl bg-secondary/40 p-2 sm:p-4 text-center min-h-[350px] flex items-center justify-center"
      >
        <canvas
          ref={canvasRef}
          aria-label={`Página ${pagina} de ${titulo}`}
          className="mx-auto max-w-full rounded-xl shadow-sm transition-transform duration-200"
        />
      </div>

      {/* BARRA DE CONTROLE INTERATIVA E RESPONSIVA */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card border border-border/80 rounded-2xl p-3 shadow-xs">
        {/* NAVEGAÇÃO DE PÁGINAS + JUMP DIRETO */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-9 rounded-full shrink-0"
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
            disabled={pagina <= 1}
            aria-label="Página anterior"
          >
            <ChevronLeft className="size-4" />
          </Button>

          {/* INPUT PARA IR DIRETO NA PÁGINA DESEJADA */}
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-sm font-medium">
            <input
              type="number"
              min={1}
              max={totalPaginas}
              value={paginaInput}
              onChange={(e) => setPaginaInput(e.target.value)}
              onBlur={irParaPaginaDireta}
              onKeyDown={(e) => e.key === "Enter" && irParaPaginaDireta()}
              aria-label="Número da página"
              className="w-9 text-center font-bold text-foreground bg-transparent border-0 outline-none p-0 focus:ring-0"
            />
            <span className="text-xs text-muted-foreground font-normal">/ {totalPaginas}</span>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="size-9 rounded-full shrink-0"
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
            disabled={pagina >= totalPaginas}
            aria-label="Próxima página"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        {/* CONTROLES DE ZOOM, TELA CHEIA E TIPO DE LEITOR */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className="size-9 rounded-full"
            onClick={() => setEscala((s) => Math.max(0.6, Number((s - 0.2).toFixed(1))))}
            aria-label="Diminuir zoom"
            title="Diminuir zoom"
          >
            <ZoomOut className="size-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="size-9 rounded-full"
            onClick={() => setEscala((s) => Math.min(2.5, Number((s + 0.2).toFixed(1))))}
            aria-label="Aumentar zoom"
            title="Aumentar zoom"
          >
            <ZoomIn className="size-4" />
          </Button>

          {/* BOTAO TELA CHEIA */}
          <Button
            variant="outline"
            size="sm"
            className="rounded-full gap-1.5 text-xs font-medium px-3 h-9"
            onClick={alternarTelaCheia}
            title="Entrar em Tela Cheia 100%"
          >
            <Maximize2 className="size-4 text-primary" />
            <span>Tela Cheia</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-full text-muted-foreground"
            onClick={() => setUsarFallbackIframe(true)}
            title="Alternar modo de leitura"
          >
            <RefreshCw className="size-4" />
          </Button>
        </div>
      </div>

      <p className="text-[11px] text-center text-muted-foreground">
        💡 <strong>Dica:</strong> Toque em <strong>Tela Cheia</strong> para leitura em tela inteira sem bordas, com botão de fechar (X) no canto inferior esquerdo.
      </p>
    </div>
  )
}
