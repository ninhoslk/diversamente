"use client"

import { useState } from "react"
import { AlertTriangle, GraduationCap, Pencil, PlusCircle, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { Breadcrumbs } from "@/components/app/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useApp } from "@/lib/app-provider"

export default function AdminCursosPage() {
  const { cursos, recarregarCursos, removerCurso, atualizarCurso } = useApp()

  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [imagemUrl, setImagemUrl] = useState("")
  const [url, setUrl] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [cursoParaRemover, setCursoParaRemover] = useState<{ id: string; titulo: string } | null>(null)

  function limparFormulario() {
    setEditandoId(null)
    setTitulo("")
    setDescricao("")
    setImagemUrl("")
    setUrl("")
    setErro(null)
  }

  function iniciarEdicao(curso: (typeof cursos)[number]) {
    setEditandoId(curso.id)
    setTitulo(curso.titulo)
    setDescricao(curso.descricao)
    setImagemUrl(curso.imagemUrl)
    setUrl(curso.url)
    setErro(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)

    if (!titulo.trim()) return setErro("Informe o título do curso.")
    if (!url.trim()) return setErro("Informe o link do curso na Hotmart.")

    const dados = { titulo: titulo.trim(), descricao: descricao.trim(), imagemUrl: imagemUrl.trim(), url: url.trim() }

    try {
      setEnviando(true)

      if (editandoId) {
        const resultado = await atualizarCurso(editandoId, dados)
        if (!resultado.ok) {
          setErro(resultado.erro ?? "Não foi possível atualizar o curso.")
          return
        }
        toast.success("Curso atualizado!", { description: dados.titulo })
        limparFormulario()
        await recarregarCursos()
        return
      }

      const res = await fetch("/api/cursos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setErro(data.erro ?? "Não foi possível publicar o curso.")
        return
      }

      toast.success("Curso publicado!", { description: dados.titulo })
      limparFormulario()
      await recarregarCursos()
    } catch {
      setErro("Erro de conexão ao salvar o curso.")
    } finally {
      setEnviando(false)
    }
  }

  async function confirmarRemocao() {
    if (!cursoParaRemover) return
    const resultado = await removerCurso(cursoParaRemover.id)
    if (!resultado.ok) {
      toast.error(resultado.erro ?? "Não foi possível excluir o curso.")
      return
    }
    toast.success("Curso excluído com sucesso", { description: cursoParaRemover.titulo })
    if (editandoId === cursoParaRemover.id) limparFormulario()
    setCursoParaRemover(null)
    await recarregarCursos()
  }

  return (
    <>
      <Breadcrumbs
        itens={[
          { label: "Material Didático", href: "/conteudos" },
          { label: "Painel Admin", href: "/admin" },
          { label: "Cursos" },
        ]}
      />

      <div className="max-w-xl">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Cursos</h1>
        <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
          Cadastre os cursos da Hotmart. Cada curso aparece na aba <strong>Cursos</strong> com imagem e resumo, e ao
          clicar o usuário é levado direto para o link informado — visível só para quem está logado.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <Card className="glass rounded-3xl border-0">
          <CardHeader>
            <CardTitle className="font-serif text-xl">{editandoId ? "Editar curso" : "Novo curso"}</CardTitle>
            <CardDescription>
              {editandoId ? "Altere os dados e salve." : "O usuário será redirecionado para o link da Hotmart."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="c-titulo">Título</Label>
                <Input
                  id="c-titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex.: Alfabetização para crianças neurodivergentes"
                  className="rounded-xl bg-card"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="c-descricao">Resumo</Label>
                <Textarea
                  id="c-descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Breve resumo sobre o curso."
                  rows={4}
                  className="rounded-xl bg-card"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="c-imagem">Link da imagem de capa</Label>
                <Input
                  id="c-imagem"
                  value={imagemUrl}
                  onChange={(e) => setImagemUrl(e.target.value)}
                  placeholder="https://..."
                  className="rounded-xl bg-card"
                />
                <span className="text-xs text-muted-foreground">
                  Link direto da imagem (ex.: a capa do curso na Hotmart). Opcional, mas recomendado.
                </span>
                {imagemUrl.trim().startsWith("https://") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagemUrl.trim()}
                    alt="Pré-visualização da capa"
                    className="aspect-video w-full rounded-xl border object-cover"
                  />
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="c-url">Link do curso (Hotmart)</Label>
                <Input
                  id="c-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://pay.hotmart.com/..."
                  className="rounded-xl bg-card"
                />
              </div>

              {erro ? (
                <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                  {erro}
                </p>
              ) : null}

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button type="submit" size="lg" disabled={enviando} className="flex-1 rounded-full">
                  <PlusCircle className="size-4" aria-hidden="true" />
                  {enviando ? "Salvando..." : editandoId ? "Salvar alterações" : "Publicar curso"}
                </Button>
                {editandoId ? (
                  <Button type="button" size="lg" variant="outline" className="rounded-full" onClick={limparFormulario}>
                    <X className="size-4" aria-hidden="true" />
                    Cancelar
                  </Button>
                ) : null}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="glass rounded-3xl border-0">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Cursos publicados ({cursos.length})</CardTitle>
            <CardDescription>Cursos já disponíveis na aba Cursos.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-2xl bg-card/70">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Curso</TableHead>
                    <TableHead className="hidden sm:table-cell">Criado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cursos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="py-8 text-center text-sm text-muted-foreground">
                        Nenhum curso publicado ainda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    cursos.map((curso) => (
                      <TableRow key={curso.id}>
                        <TableCell className="max-w-[16rem] font-medium">
                          <div className="flex items-center gap-3">
                            {curso.imagemUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={curso.imagemUrl} alt="" className="h-9 w-14 shrink-0 rounded-lg object-cover" />
                            ) : (
                              <span className="flex h-9 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <GraduationCap className="size-4 text-primary" aria-hidden="true" />
                              </span>
                            )}
                            <span className="truncate">{curso.titulo}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden text-sm tabular-nums text-muted-foreground sm:table-cell">
                          {curso.criadoEm.split("-").reverse().join("/")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => iniciarEdicao(curso)}
                          >
                            <Pencil className="size-4" aria-hidden="true" />
                            <span className="sr-only">Editar {curso.titulo}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full text-destructive hover:bg-destructive/10"
                            onClick={() => setCursoParaRemover({ id: curso.id, titulo: curso.titulo })}
                          >
                            <Trash2 className="size-4" aria-hidden="true" />
                            <span className="sr-only">Remover {curso.titulo}</span>
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
      </div>

      <Dialog open={Boolean(cursoParaRemover)} onOpenChange={(open) => !open && setCursoParaRemover(null)}>
        <DialogContent className="glass-strong rounded-3xl border p-6 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-serif text-2xl text-destructive">
              <AlertTriangle className="size-5" /> Excluir curso?
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm leading-relaxed">
              Tem certeza que deseja excluir <strong>"{cursoParaRemover?.titulo}"</strong>? Esta ação não poderá ser
              desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" className="rounded-full" onClick={() => setCursoParaRemover(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" className="gap-1.5 rounded-full" onClick={confirmarRemocao}>
              <Trash2 className="size-4" />
              Sim, excluir curso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
