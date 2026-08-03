"use client"

import { ExternalLink, Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PdfViewer } from "@/components/viewers/pdf-viewer"
import { VideoViewer } from "@/components/viewers/video-viewer"
import type { Material } from "@/lib/catalog"

export function MaterialDialog({
  material,
  onOpenChange,
}: {
  material: Material | null
  onOpenChange: (aberto: boolean) => void
}) {
  return (
    <Dialog open={material !== null} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="glass-strong w-[96vw] sm:max-w-4xl max-h-[95vh] p-3 sm:p-6 overflow-y-auto rounded-2xl sm:rounded-3xl border shadow-xl"
      >
        {material ? (
          <>
            <DialogHeader className="pr-8">
              <DialogTitle className="text-pretty font-serif text-xl sm:text-2xl">{material.titulo}</DialogTitle>
              <DialogDescription className="text-pretty text-xs sm:text-sm">{material.descricao}</DialogDescription>
            </DialogHeader>

            <div className="mt-2">
              {material.tipo === "pdf" ? <PdfViewer url={material.url} titulo={material.titulo} /> : null}
              {material.tipo === "video" ? <VideoViewer url={material.url} titulo={material.titulo} /> : null}
              {material.tipo === "jogo" ? (
                <div className="flex flex-col items-center gap-4 rounded-2xl bg-secondary/50 p-6 sm:p-10 text-center">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Gamepad2 className="size-7 text-primary" aria-hidden="true" />
                  </span>
                  <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Este jogo interativo abre em uma nova aba para melhor desempenho e tela cheia.
                  </p>
                  <Button asChild className="rounded-full" disabled={!material.url}>
                    <a href={material.url || "#"} target="_blank" rel="noopener noreferrer">
                      Abrir jogo interativo
                      <ExternalLink className="size-4" aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
