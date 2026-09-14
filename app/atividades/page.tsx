"use client"

import { useState } from "react"
import { AlertTriangle, ExternalLink, Inbox, Link2, PlayCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Breadcrumbs } from "@/components/app/breadcrumbs"
import { VideoViewer } from "@/components/viewers/video-viewer"
import { TIPOS_ATIVIDADE, type ItemAtividade, type TipoAtividade } from "@/lib/atividades"
import { useApp } from "@/lib/app-provider"

const ICONES: Record<TipoAtividade, typeof PlayCircle> = {
  video: PlayCircle,
  link: Link2,
}

export default function AtividadesPage() {
  const { atividadesItens, carregandoAtividades, erroAtividades } = useApp()
  const [selecionado, setSelecionado] = useState<ItemAtividade | null>(null)

  function abrirItem(item: ItemAtividade) {
    if (item.tipo === "video") {
      setSelecionado(item)
      return
    }
    // Link: mesma lógica de redirecionamento externo da Biblioteca Digital.
    window.open(item.url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="pb-8">
      <Breadcrumbs itens={[{ label: "Biblioteca de Atividades" }]} />

      <header className="flex flex-col gap-3">
        <h1 className="text-pretty text-3xl font-bold tracking-tight sm:text-4xl">Biblioteca de Atividades</h1>
        <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Vídeos e links de atividades escritos pela Coleção Diversamente, disponíveis para estudantes, educadores e
          famílias.
        </p>
      </header>

      {erroAtividades ? (
        <div
          role="alert"
          className="mt-6 flex items-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
          {erroAtividades}
        </div>
      ) : null}

      <div className="mt-8">
        {carregandoAtividades ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-3xl bg-card/60" />
            ))}
          </div>
        ) : atividadesItens.length === 0 ? (
          <div className="glass flex flex-col items-center gap-3 rounded-3xl border p-8 sm:p-12 text-center">
            <Inbox className="size-8 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">Nenhuma atividade publicada ainda.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {atividadesItens.map((item) => {
              const Icone = ICONES[item.tipo] ?? Link2
              const label = TIPOS_ATIVIDADE.find((t) => t.slug === item.tipo)?.label ?? item.tipo
              return (
                <Card
                  key={item.id}
                  className="glass group cursor-pointer rounded-3xl border p-0 shadow-sm transition-transform hover:-translate-y-1"
                >
                  <button
                    type="button"
                    onClick={() => abrirItem(item)}
                    className="w-full text-left"
                    aria-label={`Abrir ${item.titulo}`}
                  >
                    <CardContent className="flex flex-col gap-3 p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
                          <Icone className="size-5 text-primary" aria-hidden="true" />
                        </span>
                        <Badge variant="secondary" className="rounded-full text-xs font-normal">
                          {label}
                        </Badge>
                      </div>
                      <h2 className="text-pretty font-semibold leading-snug text-base sm:text-lg">{item.titulo}</h2>
                      {item.descricao ? (
                        <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">{item.descricao}</p>
                      ) : null}
                      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                        {item.tipo === "video" ? "Assistir" : "Abrir"}
                        {item.tipo === "video" ? (
                          <PlayCircle className="size-3.5" aria-hidden="true" />
                        ) : (
                          <ExternalLink className="size-3.5" aria-hidden="true" />
                        )}
                      </span>
                    </CardContent>
                  </button>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <Dialog open={selecionado !== null} onOpenChange={(aberto) => !aberto && setSelecionado(null)}>
        <DialogContent
          showCloseButton
          className="glass-strong w-[96vw] sm:max-w-3xl max-h-[95vh] p-3 sm:p-6 overflow-y-auto rounded-2xl sm:rounded-3xl border shadow-xl"
        >
          {selecionado ? (
            <>
              <DialogHeader className="pr-8">
                <DialogTitle className="text-pretty font-serif text-xl sm:text-2xl">{selecionado.titulo}</DialogTitle>
                <DialogDescription className="text-pretty text-xs sm:text-sm">{selecionado.descricao}</DialogDescription>
              </DialogHeader>
              <div className="mt-2">
                <VideoViewer url={selecionado.url} titulo={selecionado.titulo} />
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
