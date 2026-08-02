"use client"

import { useState } from "react"
import Link from "next/link"
import { LogIn, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/brand/logo"
import { AuthDialog } from "@/components/auth/auth-dialog"
import { useApp } from "@/lib/app-provider"

const LINKS = [
  { href: "/quem-somos", label: "Quem Somos" },
  { href: "/autores", label: "Autores" },
  { href: "/mentoria", label: "Mentoria" },
  { href: "/ajuda", label: "Ajuda" },
]

export function SiteHeader() {
  const [aberto, setAberto] = useState(false)
  const { usuario } = useApp()

  return (
    <header className="sticky top-0 z-50">
      <div className="glass border-b">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo size="sm" />

          <nav aria-label="Navegação principal" className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-card/70 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {usuario ? (
              <Button
                render={<Link href={usuario.papel === "admin" ? "/admin" : "/conteudos"} />}
                className="rounded-full"
              >
                Minha área
              </Button>
            ) : (
              <AuthDialog>
                <Button className="hidden rounded-full sm:inline-flex">
                  <LogIn className="size-4" aria-hidden="true" />
                  Entrar / Cadastrar
                </Button>
              </AuthDialog>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full md:hidden"
              onClick={() => setAberto((v) => !v)}
              aria-expanded={aberto}
              aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            >
              {aberto ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>
      </div>

      {aberto ? (
        <div className="glass-strong border-b md:hidden">
          <nav aria-label="Navegação mobile" className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setAberto(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-card"
              >
                {link.label}
              </Link>
            ))}
            {usuario ? null : (
              <AuthDialog>
                <Button className="mt-2 w-full rounded-full">
                  <LogIn className="size-4" aria-hidden="true" />
                  Entrar / Cadastrar
                </Button>
              </AuthDialog>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
