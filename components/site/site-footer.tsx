"use client"

import Link from "next/link"
import { Mail, MessageCircle } from "lucide-react"
import { Logo } from "@/components/brand/logo"

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-card/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <Logo size="sm" />
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Material pedagógico organizado por trilhas, do berçário ao 5º ano, para estudantes, educadores e famílias
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
            <Link href="/mural" className="transition-colors hover:text-foreground">
              Mural
            </Link>
            <Link href="/ajuda" className="transition-colors hover:text-foreground">
              Ajuda
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold">Fale com a gente</h2>
          <div className="flex flex-col gap-3">
            <a
              href="mailto:ecosbioambiental@gmail.com"
              className="group/button inline-flex h-10 shrink-0 items-center justify-start gap-1.5 rounded-full border border-border bg-background px-4 text-sm font-medium whitespace-nowrap transition-all outline-none select-none hover:bg-muted hover:text-foreground bg-card/80"
            >
              <Mail className="size-4 pointer-events-none shrink-0" aria-hidden="true" />
              ecosbioambiental@gmail.com
            </a>
            <a
              href="https://wa.me/5519992101212"
              target="_blank"
              rel="noopener noreferrer"
              className="group/button inline-flex h-10 shrink-0 items-center justify-start gap-1.5 rounded-full border border-transparent bg-primary text-primary-foreground px-4 text-sm font-medium whitespace-nowrap transition-all outline-none select-none hover:bg-primary/80"
            >
              <MessageCircle className="size-4 pointer-events-none shrink-0" aria-hidden="true" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="border-t px-4 py-5 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} Diversamente. Todos os direitos reservados.
      </div>
    </footer>
  )
}
