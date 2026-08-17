"use client"

import ReactPlayer from "react-player"

/**
 * Player de vídeo genérico (YouTube, Vimeo, arquivos de vídeo diretos etc.)
 * via react-player, que detecta o provedor a partir da própria URL.
 */
export function VideoViewer({ url, titulo }: { url: string; titulo: string }) {
  if (!url || !ReactPlayer.canPlay?.(url)) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-2xl bg-secondary/50 p-8 text-center">
        <p className="text-sm text-muted-foreground">Link de vídeo inválido ou não informado.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-secondary shadow-sm">
        <ReactPlayer
          src={url}
          controls
          playsInline
          title={titulo}
          width="100%"
          height="100%"
          className="absolute inset-0"
        />
      </div>
      <p className="text-xs text-muted-foreground">Vídeo exclusivo da plataforma Diversamente.</p>
    </div>
  )
}
