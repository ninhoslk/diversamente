import type { Metadata } from "next"
import Link from "next/link"
import { Compass, Home, LifeBuoy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/brand/logo"

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="holo-surface flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
      <Logo size="md" />

      <span className="glass mt-8 flex size-16 items-center justify-center rounded-3xl border">
        <Compass className="size-7 text-primary" aria-hidden="true" />
      </span>

      <h1 className="mt-6 text-pretty text-4xl font-bold tracking-tight sm:text-5xl">
        Página não encontrada
      </h1>

      <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
        O endereço que você tentou acessar não existe ou foi movido. Confira o link ou volte para um lugar conhecido.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Button asChild size="lg" className="rounded-full px-8">
          <Link href="/">
            <Home className="size-4" aria-hidden="true" />
            Voltar para a página inicial
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-full bg-card/70 px-8">
          <Link href="/ajuda">
            <LifeBuoy className="size-4" aria-hidden="true" />
            Falar com o suporte
          </Link>
        </Button>
      </div>
    </div>
  )
}
