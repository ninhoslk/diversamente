"use client"

import { useState } from "react"
import { PlusCircle, Search, Trash2, Users, Shield, GraduationCap, UserRound, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { Breadcrumbs } from "@/components/app/breadcrumbs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CATEGORIAS, TRILHAS } from "@/lib/catalog"
import { useApp, type Papel } from "@/lib/app-provider"

export default function AdminUsuariosPage() {
  const { usuarios, cadastrarUsuarioPeloAdmin, removerUsuarioPeloAdmin } = useApp()
  const [busca, setBusca] = useState("")

  // Form de criação
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [papel, setPapel] = useState<Papel>("aluno")
  const [categoriaId, setCategoriaId] = useState("fundamental-1")
  const [erro, setErro] = useState<string | null>(null)

  const CATEGORIAS_OPCOES = [
    { id: "todas", nome: "Todas as salas / anos (Acesso total)" },
    { id: "educacao-infantil", nome: "Educação Infantil (Berçário, Maternal, Pré-alfabetização)" },
    { id: "fundamental-1", nome: "Ensino Fundamental I (1º ao 5º ano)" },
    ...CATEGORIAS.map((c) => ({ id: c.slug, nome: `Apenas: ${c.nome}` })),
  ]

  const filtrados = usuarios.filter(
    (u) =>
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.email.toLowerCase().includes(busca.toLowerCase()) ||
      u.papel.toLowerCase().includes(busca.toLowerCase()),
  )

  function onCadastrar(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)

    if (!nome.trim()) return setErro("Informe o nome completo.")
    if (!email.trim()) return setErro("Informe o e-mail de acesso.")
    if (!senha.trim() || senha.length < 6) return setErro("A senha deve ter no mínimo 6 caracteres.")

    const catObj = CATEGORIAS_OPCOES.find((c) => c.id === categoriaId)
    const resultado = cadastrarUsuarioPeloAdmin({
      nome: nome.trim(),
      email: email.trim(),
      senha: senha.trim(),
      papel,
      categoriaId: papel === "admin" || papel === "professor" ? "todas" : categoriaId,
      categoriaNome: papel === "admin" || papel === "professor" ? "Todas as salas / anos" : catObj?.nome ?? "Geral",
    })

    if (!resultado.ok) {
      setErro(resultado.erro ?? "Erro ao cadastrar usuário.")
      return
    }

    toast.success("Usuário cadastrado com sucesso!", { description: `${nome.trim()} (${papel})` })
    setNome("")
    setEmail("")
    setSenha("")
  }

  function onRemover(id: string, nomeUser: string) {
    if (usuarios.length <= 1) {
      toast.error("Não é possível excluir o único usuário do sistema.")
      return
    }
    removerUsuarioPeloAdmin(id)
    toast.success("Usuário removido.", { description: nomeUser })
  }

  const rotuloPapel: Record<Papel, string> = {
    admin: "Administrador",
    professor: "Professor / Educador",
    aluno: "Aluno",
    pai: "Pai / Família",
    visitante: "Visitante",
  }

  return (
    <>
      <Breadcrumbs
        itens={[
          { label: "Conteúdos", href: "/conteudos" },
          { label: "Painel Admin", href: "/admin" },
          { label: "Gestão de Usuários & Categorias" },
        ]}
      />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Gestão de Alunos, Pais e Professores
          </h1>
          <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
            Cadastre os acessos da escola e defina quais categorias cada usuário pode visualizar.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        {/* Lista de Usuários */}
        <Card className="glass rounded-3xl border-0">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Usuários Cadastrados ({usuarios.length})</CardTitle>

            <div className="mt-2 relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome, e-mail ou perfil..."
                className="rounded-full bg-card pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-2xl bg-card/70">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Função / Perfil</TableHead>
                    <TableHead>Categoria Visível</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                        Nenhum usuário encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtrados.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{u.nome}</span>
                            <span className="text-xs text-muted-foreground">{u.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={u.papel === "admin" ? "default" : u.papel === "professor" ? "secondary" : "outline"}
                            className="rounded-full text-[10px] uppercase font-medium"
                          >
                            {rotuloPapel[u.papel]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {u.categoriaNome ?? "Geral / Acesso total"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full text-destructive hover:bg-destructive/10"
                            onClick={() => onRemover(u.id, u.nome)}
                          >
                            <Trash2 className="size-4" aria-hidden="true" />
                            <span className="sr-only">Remover {u.nome}</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Cadastro Novo Usuário */}
        <Card className="glass rounded-3xl border-0">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Cadastrar Novo Usuário</CardTitle>
            <CardDescription>O usuário criado poderá logar diretamente na plataforma.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onCadastrar} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="u-nome">Nome Completo</Label>
                <Input
                  id="u-nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex.: Gabriel Souza"
                  className="rounded-xl bg-card"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="u-email">E-mail de Acesso</Label>
                <Input
                  id="u-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="gabriel@escola.com"
                  className="rounded-xl bg-card"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="u-senha">Senha Provisória</Label>
                <Input
                  id="u-senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="rounded-xl bg-card"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="u-papel">Função / Categoria de Login</Label>
                <Select value={papel} onValueChange={(v) => setPapel(v as Papel)}>
                  <SelectTrigger id="u-papel" className="rounded-xl bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="aluno">Aluno (Vê apenas a categoria designada)</SelectItem>
                    <SelectItem value="pai">Pai / Família (Vê apenas a categoria designada)</SelectItem>
                    <SelectItem value="professor">Professor / Educador (Vê todas as salas)</SelectItem>
                    <SelectItem value="admin">Administrador (Acesso completo ao painel)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {papel === "aluno" || papel === "pai" ? (
                <div className="flex flex-col gap-2 rounded-2xl bg-secondary/40 p-3.5 border border-primary/10">
                  <Label htmlFor="u-categoria" className="text-xs font-semibold text-primary">
                    Restringir Acesso à Categoria:
                  </Label>
                  <Select value={categoriaId} onValueChange={setCategoriaId}>
                    <SelectTrigger id="u-categoria" className="rounded-xl bg-card text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {CATEGORIAS_OPCOES.map((c) => (
                        <SelectItem key={c.id} value={c.id} className="text-xs">
                          {c.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Este usuário só enxergará conteúdos e materiais atrelados a esta categoria.
                  </p>
                </div>
              ) : null}

              {erro ? (
                <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {erro}
                </p>
              ) : null}

              <Button type="submit" size="lg" className="rounded-full mt-2">
                <PlusCircle className="size-4" aria-hidden="true" />
                Cadastrar Usuário
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
