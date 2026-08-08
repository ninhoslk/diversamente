"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useApp } from "@/lib/app-provider"

export function AuthDialog({
  children,
  aberturaInicial = false,
}: {
  children: React.ReactNode
  aberturaInicial?: boolean
}) {
  const [aberto, setAberto] = useState(aberturaInicial)
  const [enviando, setEnviando] = useState(false)
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const { entrar } = useApp()
  const router = useRouter()

  async function onEntrar(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    const resultado = await entrar(email, senha)
    setEnviando(false)
    if (!resultado.ok) {
      toast.error(resultado.erro ?? "Não foi possível entrar.")
      return
    }
    setAberto(false)
    toast.success("Bem-vindo à Diversamente!")
    router.push("/conteudos")
    router.refresh()
  }

  return (
    <>
      <span onClick={() => setAberto(true)} className="contents">
        {children}
      </span>
      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="glass-strong border sm:max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="font-display italic text-3xl holo-text pb-1">Diversamente</DialogTitle>
            <DialogDescription>Acesse com suas credenciais para visualizar a biblioteca pedagógica.</DialogDescription>
          </DialogHeader>

          <form onSubmit={onEntrar} className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-email">E-mail de Acesso</Label>
              <Input
                id="login-email"
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
              <Label htmlFor="login-senha">Senha</Label>
              <Input
                id="login-senha"
                type="password"
                autoComplete="current-password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="rounded-xl bg-card/80"
              />
            </div>
            <Button type="submit" disabled={enviando} className="rounded-full mt-2">
              {enviando ? <Loader2 className="size-4 animate-spin" /> : null}
              Entrar na Plataforma
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
