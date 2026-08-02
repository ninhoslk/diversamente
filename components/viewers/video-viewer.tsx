"use client"

/**
 * Player de vídeo para links não listados do YouTube.
 * Usa iframe responsivo com modestbranding, rel=0 e sem sugestões externas.
 */
export function VideoViewer({ url, titulo }: { url: string; titulo: string }) {
  const id = extrairIdYoutube(url)

  if (!id) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-2xl bg-secondary/50 p-8 text-center">
        <p className="text-sm text-muted-foreground">Link de vídeo inválido ou não informado.</p>
      </div>
    )
  }

  const src = `https://www.youtube-nocookie.com/embed/${id}?modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-secondary shadow-sm">
        <iframe
          src={src}
          title={titulo}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 size-full border-0"
        />
      </div>
      <p className="text-xs text-muted-foreground">Vídeo exclusivo da plataforma Diversamente.</p>
    </div>
  )
}

export function extrairIdYoutube(url: string): string | null {
  if (!url) return null
  const padroes = [
    /youtu\.be\/([\w-]{11})/,
    /[?&]v=([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
    /youtube\.com\/live\/([\w-]{11})/,
  ]
  for (const padrao of padroes) {
    const m = url.match(padrao)
    if (m) return m[1]
  }
  return /^[\w-]{11}$/.test(url) ? url : null
}
