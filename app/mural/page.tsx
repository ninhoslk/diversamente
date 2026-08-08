import type { Metadata } from "next"
import { MessageSquareHeart } from "lucide-react"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { MuralEmbed } from "@/components/mural/mural-embed"

export const metadata: Metadata = {
  title: "Mural Interativo | Diversamente",
  description:
    "Mural colaborativo ao vivo, aberto a toda a comunidade Diversamente para compartilhar ideias, fotos e reflexões.",
}

export default function MuralPage() {
  return (
    <div className="holo-surface min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 pt-14 pb-20 sm:px-6 sm:pt-20 lg:max-w-6xl">
        <header className="flex flex-col items-center gap-4 text-center">
          <span className="glass inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium">
            <span className="size-2.5 rounded-full bg-red-500" aria-hidden="true" />
            Mural ao vivo aberto a todos
          </span>

          <h1 className="text-pretty text-4xl font-bold tracking-tight sm:text-5xl">
            Mural <span className="font-display italic holo-text font-semibold">Interativo</span>
          </h1>

          <p className="max-w-2xl text-pretty text-base leading-relaxed text-foreground/75 sm:text-lg">
            Um espaço colaborativo em tempo real para estudantes, famílias e educadores compartilharem ideias, fotos e
            reflexões sobre os nossos conteúdos.
          </p>
        </header>

        <div className="mt-10 sm:mt-14">
          <MuralEmbed />
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <MessageSquareHeart className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
          <span>Powered by Padlet — as postagens são moderadas pela equipe Diversamente.</span>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
