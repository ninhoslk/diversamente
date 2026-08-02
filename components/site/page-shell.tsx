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
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16">
        <header className="flex flex-col gap-3">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{titulo}</h1>
          <p className="max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">{subtitulo}</p>
        </header>
        <div className="mt-10">{children}</div>
      </main>
      <SiteFooter />
    </div>
  )
}
