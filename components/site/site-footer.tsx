import Link from "next/link"
import { Mail, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/brand/logo"

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-card/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <Logo size="sm" />
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Material pedagógico organizado por trilhas, do berçário ao 5º ano, para alunos, educadores e famílias
            caminharem juntos.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold">Navegação</h2>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href="/quem-somos" className="transition-colors hover:text-foreground">
              Quem Somos
            </Link>
            <Link href="/autores" className="transition-colors hover:text-foreground">
              Autores
            </Link>
            <Link href="/mentoria" className="transition-colors hover:text-foreground">
              Mentoria
            </Link>
            <Link href="/ajuda" className="transition-colors hover:text-foreground">
              Ajuda
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold">Fale com a gente</h2>
          <div className="flex flex-col gap-3">
            <Button
              render={<a href="mailto:contato@diversamente.com" />}
              variant="outline"
              className="h-10 justify-start rounded-full bg-card/80 px-4"
            >
              <Mail className="size-4" aria-hidden="true" />
              contato@diversamente.com
            </Button>
            <Button
              render={<a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" />}
              className="h-10 justify-start rounded-full px-4"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              WhatsApp
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t px-4 py-5 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} Diversamente. Todos os direitos reservados.
      </div>
    </footer>
  )
}
