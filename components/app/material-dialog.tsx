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
        className="glass-strong max-h-[92vh] overflow-y-auto rounded-3xl border sm:max-w-3xl"
      >
        {material ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-pretty pr-6">{material.titulo}</DialogTitle>
              <DialogDescription className="text-pretty">{material.descricao}</DialogDescription>
            </DialogHeader>

            <div className="mt-2">
              {material.tipo === "pdf" ? <PdfViewer url={material.url} titulo={material.titulo} /> : null}
              {material.tipo === "video" ? <VideoViewer url={material.url} titulo={material.titulo} /> : null}
              {material.tipo === "jogo" ? (
                <div className="flex flex-col items-center gap-4 rounded-2xl bg-secondary/50 p-10 text-center">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Gamepad2 className="size-7 text-primary" aria-hidden="true" />
                  </span>
                  <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Este jogo abre em uma nova aba para melhor desempenho e tela cheia.
                  </p>
                  <Button asChild className="rounded-full" disabled={!material.url}>
                    <a href={material.url || "#"} target="_blank" rel="noopener noreferrer">
                      Abrir jogo
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
