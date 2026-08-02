"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, ShieldCheck, UserRound, GraduationCap, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  const { entrar, usuarios } = useApp()
  const router = useRouter()

  function onEntrar(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    const resultado = entrar(email, senha)
    if (!resultado.ok) {
      setEnviando(false)
      toast.error(resultado.erro ?? "Não foi possível entrar.")
      return
    }
    const conta = usuarios.find((c) => c.email.toLowerCase() === email.trim().toLowerCase())
    setAberto(false)
    setEnviando(false)
    toast.success("Bem-vindo à Diversamente!")
    router.push(conta?.papel === "admin" ? "/admin" : "/conteudos")
  }

  function preencher(emailConta: string, senhaConta: string) {
    setEmail(emailConta)
    setSenha(senhaConta)
  }

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger asChild>{children}</DialogTrigger>
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

        <div className="mt-5 rounded-2xl border bg-card/60 p-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">Contas de teste para demonstração:</p>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => preencher("admin@diversamente.com", "admin123")}
              className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-secondary"
            >
              <ShieldCheck className="size-4 text-primary shrink-0" aria-hidden="true" />
              <span>
                <strong>Admin:</strong> admin@diversamente.com
              </span>
            </button>
            <button
              type="button"
              onClick={() => preencher("prof@diversamente.com", "prof123")}
              className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-secondary"
            >
              <GraduationCap className="size-4 text-primary shrink-0" aria-hidden="true" />
              <span>
                <strong>Professor:</strong> prof@diversamente.com
              </span>
            </button>
            <button
              type="button"
              onClick={() => preencher("aluno@diversamente.com", "aluno123")}
              className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-secondary"
            >
              <UserRound className="size-4 text-primary shrink-0" aria-hidden="true" />
              <span>
                <strong>Aluno (Fundamental):</strong> aluno@diversamente.com
              </span>
            </button>
            <button
              type="button"
              onClick={() => preencher("pai@diversamente.com", "pai123")}
              className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-secondary"
            >
              <Users className="size-4 text-primary shrink-0" aria-hidden="true" />
              <span>
                <strong>Pai (Fundamental):</strong> pai@diversamente.com
              </span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
