import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"

export function PageShell({
  titulo,
  subtitulo,
  children,
}: {
  titulo: string
  subtitulo: string
  children: React.ReactNode
}) {
  return (
    <div className="holo-surface min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20">
        <header className="flex flex-col gap-4">
          <h1 className="text-pretty text-4xl font-bold tracking-tight sm:text-5xl">{titulo}</h1>
          <p className="max-w-2xl text-pretty text-base leading-relaxed text-foreground/75 sm:text-lg">{subtitulo}</p>
        </header>
        <div className="mt-12">{children}</div>
      </main>
      <SiteFooter />
    </div>
  )
}
