"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/app-provider"

export function RouteGuard({
  children,
  somenteAdmin = false,
}: {
  children: React.ReactNode
  somenteAdmin?: boolean
}) {
  const { usuario, carregando } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!carregando && !usuario) router.replace("/entrar")
  }, [carregando, usuario, router])

  if (carregando || !usuario) {
    return (
      <div className="holo-surface flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" aria-label="Carregando" />
      </div>
    )
  }

  if (somenteAdmin && usuario.papel !== "admin") {
    return (
      <div className="holo-surface flex min-h-screen items-center justify-center px-4">
        <div className="glass-strong flex max-w-md flex-col items-center gap-4 rounded-3xl border p-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10">
            <ShieldAlert className="size-6 text-destructive" aria-hidden="true" />
          </span>
          <h1 className="text-xl font-semibold">Acesso restrito</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Esta área é exclusiva da administração. Entre com uma conta de administrador para continuar.
          </p>
          <Button className="rounded-full" onClick={() => router.push("/conteudos")}>
            Voltar para os conteúdos
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
