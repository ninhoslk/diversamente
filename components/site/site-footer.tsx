"use client"

import Link from "next/link"
import { Mail, MessageCircle, ShieldCheck } from "lucide-react"
import { Logo } from "@/components/brand/logo"

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 sm:px-6 md:flex-row md:justify-between">
        <div className="max-w-md">
          <Logo size="sm" />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Coleção e recursos pedagógicos integrados para Educação Infantil e Ensino Fundamental I.
            Soluções estruturadas para secretarias de educação, escolas públicas, privadas e comunidade escolar.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-primary">
            <ShieldCheck className="size-4 shrink-0" />
            <span>Alinhado às diretrizes da BNCC & Legislação Educacional</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-bold text-foreground">Navegação Institucional</h2>
          <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
            <Link href="/quem-somos" className="transition-colors hover:text-primary">
              Quem Somos
            </Link>
            <Link href="/autores" className="transition-colors hover:text-primary">
              Autores & Pesquisadores
            </Link>
            <Link href="/mentoria" className="transition-colors hover:text-primary">
              Mentoria Institucional
            </Link>
            <Link href="/ajuda" className="transition-colors hover:text-primary">
              Ajuda & FAQ
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-bold text-foreground">Atendimento & Editais</h2>
          <div className="flex flex-col gap-3">
            <a
              href="mailto:contato@diversamente.com"
              className="inline-flex h-10 items-center justify-start gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:bg-accent"
            >
              <Mail className="size-4 shrink-0 text-primary" aria-hidden="true" />
              contato@diversamente.com
            </a>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-start gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
            >
              <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
              Atendimento WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border/80 px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} Diversamente Soluções Educacionais. Todos os direitos reservados.
      </div>
    </footer>
  )
}
