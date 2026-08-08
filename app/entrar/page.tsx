"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useApp } from "@/lib/app-provider"

export default function EntrarPage() {
  const router = useRouter()
  const { entrar } = useApp()

  const [enviando, setEnviando] = useState(false)
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")

  async function onEntrar(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    const resultado = await entrar(email, senha)
    setEnviando(false)
    if (!resultado.ok) {
      toast.error(resultado.erro ?? "Não foi possível entrar.")
      return
    }
    toast.success("Bem-vindo à Diversamente!")
    router.push("/conteudos")
    router.refresh()
  }

  return (
    <main className="holo-surface flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-12">
      <Logo href="/" size="lg" />

      <Card className="glass-strong w-full max-w-md rounded-3xl border shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-1 mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Acesse sua Conta</h1>
            <p className="text-sm text-muted-foreground">Informe seus dados para acessar o catálogo de conteúdos.</p>
          </div>

          <form onSubmit={onEntrar} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="p-email">E-mail de Acesso</Label>
              <Input
                id="p-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@escola.com"
                className="rounded-xl bg-card/80"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="p-senha">Senha</Label>
              <Input
                id="p-senha"
                type="password"
                autoComplete="current-password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="rounded-xl bg-card/80"
              />
            </div>
            <Button type="submit" size="lg" disabled={enviando} className="rounded-full mt-2">
              {enviando ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
              Entrar na Plataforma
            </Button>
          </form>

        </CardContent>
      </Card>

      <Button asChild variant="ghost" className="rounded-full">
        <Link href="/">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Voltar para o site
        </Link>
      </Button>
    </main>
  )
}
