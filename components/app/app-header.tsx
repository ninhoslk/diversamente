"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, LayoutDashboard, LibraryBig, LogOut, User, Users, Palette } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Logo } from "@/components/brand/logo"
import { useApp } from "@/lib/app-provider"
import { cn } from "@/lib/utils"

export function AppHeader() {
  const { usuario, sair } = useApp()
  const router = useRouter()
  const pathname = usePathname()
  const [modalPerfilAberto, setModalPerfilAberto] = useState(false)

  const iniciais = (usuario?.nome ?? "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  async function onSair() {
    await sair()
    router.push("/")
    router.refresh()
  }

  const rotuloPapel: Record<string, string> = {
    admin: "Administrador",
    professor: "Professor / Educador",
    aluno: "Estudante",
    pai: "Família",
    visitante: "Visitante",
  }

  return (
    <>
      <header className="sticky top-0 z-50 glass border-b">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Logo href="/conteudos" size="sm" />
            <nav aria-label="Navegação da plataforma" className="hidden items-center gap-1 sm:flex">
              <Link
                href="/"
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  pathname === "/"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-foreground/70 hover:bg-card/60",
                )}
              >
                <Home className="size-4" aria-hidden="true" />
                Início
              </Link>
              <Link
                href="/conteudos"
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  pathname.startsWith("/conteudos")
                    ? "bg-card text-foreground shadow-sm"
                    : "text-foreground/70 hover:bg-card/60",
                )}
              >
                <LibraryBig className="size-4" aria-hidden="true" />
                Material Didático
              </Link>
              {usuario?.papel === "admin" ? (
                <>
                  <Link
                    href="/admin"
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      pathname === "/admin" || pathname.startsWith("/admin/materiais")
                        ? "bg-card text-foreground shadow-sm"
                        : "text-foreground/70 hover:bg-card/60",
                    )}
                  >
                    <LayoutDashboard className="size-4" aria-hidden="true" />
                    Painel Admin
                  </Link>
                  <Link
                    href="/admin/aparencia"
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      pathname === "/admin/aparencia"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-foreground/70 hover:bg-card/60",
                    )}
                  >
                    <Palette className="size-4 text-primary" aria-hidden="true" />
                    Layout (Elementor)
                  </Link>
                  <Link
                    href="/admin/usuarios"
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      pathname === "/admin/usuarios"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-foreground/70 hover:bg-card/60",
                    )}
                  >
                    <Users className="size-4 text-primary" aria-hidden="true" />
                    Usuários
                  </Link>
                </>
              ) : null}
            </nav>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="h-auto gap-2 rounded-full px-2.5 py-1.5 hover:bg-card/80 inline-flex items-center outline-none">
              <Avatar className="size-8 border border-primary/20">
                <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">{iniciais}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">{usuario?.nome}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="flex flex-col gap-1.5 p-2">
                  <span className="text-sm font-semibold">{usuario?.nome}</span>
                  <span className="text-xs font-normal text-muted-foreground">{usuario?.email}</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    <Badge variant="secondary" className="w-fit rounded-full text-[10px] font-medium uppercase">
                      {rotuloPapel[usuario?.papel ?? "visitante"]}
                    </Badge>
                    {usuario?.categoriaNome ? (
                      <Badge variant="outline" className="w-fit rounded-full text-[10px] font-medium">
                        {usuario.categoriaNome}
                      </Badge>
                    ) : null}
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setModalPerfilAberto(true)} className="rounded-xl cursor-pointer">
                <User className="size-4" aria-hidden="true" />
                Meu Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/conteudos")} className="rounded-xl cursor-pointer">
                <LibraryBig className="size-4" aria-hidden="true" />
                Biblioteca de Material Didático
              </DropdownMenuItem>
              {usuario?.papel === "admin" ? (
                <>
                  <DropdownMenuItem onClick={() => router.push("/admin")} className="rounded-xl cursor-pointer">
                    <LayoutDashboard className="size-4" aria-hidden="true" />
                    Painel Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/admin/aparencia")} className="rounded-xl cursor-pointer">
                    <Palette className="size-4 text-primary" aria-hidden="true" />
                    Personalizar Layout
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/admin/usuarios")} className="rounded-xl cursor-pointer">
                    <Users className="size-4 text-primary" aria-hidden="true" />
                    Gestão de Estudantes / Famílias
                  </DropdownMenuItem>
                </>
              ) : null}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSair} variant="destructive" className="rounded-xl cursor-pointer">
                <LogOut className="size-4" aria-hidden="true" />
                Sair da conta
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Modal de Perfil */}
      <Dialog open={modalPerfilAberto} onOpenChange={setModalPerfilAberto}>
        <DialogContent className="glass-strong border sm:max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <User className="size-5 text-primary" />
              Perfil do Usuário
            </DialogTitle>
            <DialogDescription>
              Informações do seu perfil ativo na plataforma Diversamente.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex items-center gap-4 rounded-2xl bg-card/80 p-4 border">
              <Avatar className="size-14 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/15 text-lg font-bold text-primary">{iniciais}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h3 className="text-base font-bold">{usuario?.nome}</h3>
                <p className="text-xs text-muted-foreground">{usuario?.email}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="secondary" className="rounded-full text-[10px] uppercase">
                    {rotuloPapel[usuario?.papel ?? "visitante"]}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 rounded-2xl bg-secondary/50 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Categoria de acesso:</span>
                <span className="font-semibold text-primary">{usuario?.categoriaNome ?? "Geral / Sem restrição"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Nível de permissão:</span>
                <span className="font-semibold">{usuario?.papel === "admin" || usuario?.papel === "professor" ? "Acesso Amplo" : "Restrito à categoria"}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" className="rounded-full" onClick={() => setModalPerfilAberto(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
