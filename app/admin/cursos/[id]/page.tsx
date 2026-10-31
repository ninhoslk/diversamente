"use client"

import { use, useState } from "react"
import Link from "next/link"
import { AlertTriangle, ArrowLeft, Eye, Pencil, PlayCircle, PlusCircle, Trash2 } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import type { AulaCurso, ModuloCurso } from "@/lib/cursos"
import { useApp } from "@/lib/app-provider"
import { useCursosConteudo } from "@/lib/use-cursos-conteudo"

type FormModulo = { id: string | null; titulo: string; ordem: string }
type FormAula = { id: string | null; moduloId: string; titulo: string; descricao: string; videoUrl: string; ordem: string }
type Remocao = { tipo: "modulo" | "aula"; id: string; titulo: string }

async function enviar(url: string, method: string, body?: unknown) {
  try {
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
    const data = await res.json()
    if (!res.ok || !data.ok) return { ok: false, erro: (data.erro as string) ?? "Não foi possível salvar." }
    return { ok: true, erro: null }
  } catch {
    return { ok: false, erro: "Erro de conexão." }
  }
}

export default function AdminCursoModulosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: cursoId } = use(params)
  const { cursos } = useApp()
  const { modulosDoCurso, carregando, erro, recarregar } = useCursosConteudo()

  const curso = cursos.find((c) => c.id === cursoId)
  const modulos = modulosDoCurso(cursoId)

  const [formModulo, setFormModulo] = useState<FormModulo | null>(null)
  const [formAula, setFormAula] = useState<FormAula | null>(null)
  const [remocao, setRemocao] = useState<Remocao | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [erroForm, setErroForm] = useState<string | null>(null)

  function abrirNovoModulo() {
    setErroForm(null)
    setFormModulo({ id: null, titulo: "", ordem: String(modulos.length + 1) })
  }

  function abrirEdicaoModulo(m: ModuloCurso) {
    setErroForm(null)
    setFormModulo({ id: m.id, titulo: m.titulo, ordem: String(m.ordem) })
  }

  function abrirNovaAula(m: ModuloCurso) {
    setErroForm(null)
    setFormAula({ id: null, moduloId: m.id, titulo: "", descricao: "", videoUrl: "", ordem: String(m.aulas.length + 1) })
  }

  function abrirEdicaoAula(a: AulaCurso) {
    setErroForm(null)
    setFormAula({
      id: a.id,
      moduloId: a.moduloId,
      titulo: a.titulo,
      descricao: a.descricao,
      videoUrl: a.videoUrl,
      ordem: String(a.ordem),
    })
  }

  async function salvarModulo(e: React.FormEvent) {
    e.preventDefault()
    if (!formModulo) return
    if (!formModulo.titulo.trim()) return setErroForm("Informe o título do módulo.")

    setSalvando(true)
    const dados = { cursoId, titulo: formModulo.titulo.trim(), ordem: formModulo.ordem }
    const r = formModulo.id
      ? await enviar(`/api/curso-modulos/${formModulo.id}`, "PATCH", dados)
      : await enviar("/api/curso-modulos", "POST", dados)
    setSalvando(false)

    if (!r.ok) return setErroForm(r.erro)
    toast.success(formModulo.id ? "Módulo atualizado!" : "Módulo criado!", { description: dados.titulo })
    setFormModulo(null)
    await recarregar()
  }

  async function salvarAula(e: React.FormEvent) {
    e.preventDefault()
    if (!formAula) return
    if (!formAula.titulo.trim()) return setErroForm("Informe o título da aula.")
    if (!formAula.videoUrl.trim()) return setErroForm("Informe o link do vídeo do YouTube.")

    setSalvando(true)
    const dados = {
      moduloId: formAula.moduloId,
      titulo: formAula.titulo.trim(),
      descricao: formAula.descricao.trim(),
      videoUrl: formAula.videoUrl.trim(),
      ordem: formAula.ordem,
    }
    const r = formAula.id
      ? await enviar(`/api/curso-aulas/${formAula.id}`, "PATCH", dados)
      : await enviar("/api/curso-aulas", "POST", dados)
    setSalvando(false)

    if (!r.ok) return setErroForm(r.erro)
    toast.success(formAula.id ? "Aula atualizada!" : "Aula adicionada!", { description: dados.titulo })
    setFormAula(null)
    await recarregar()
  }

  async function confirmarRemocao() {
    if (!remocao) return
    const r = await enviar(
      remocao.tipo === "modulo" ? `/api/curso-modulos/${remocao.id}` : `/api/curso-aulas/${remocao.id}`,
      "DELETE",
    )
    if (!r.ok) {
      toast.error(r.erro ?? "Não foi possível excluir.")
      return
    }
    toast.success(remocao.tipo === "modulo" ? "Módulo excluído" : "Aula excluída", { description: remocao.titulo })
    setRemocao(null)
    await recarregar()
  }

  return (
    <>
      <Breadcrumbs
        itens={[
          { label: "Painel Admin", href: "/admin" },
          { label: "Cursos", href: "/admin/cursos" },
          { label: curso?.titulo ?? "Curso" },
        ]}
      />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {curso?.titulo ?? "Curso"}
          </h1>
          <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
            Monte os módulos do curso e adicione as aulas (vídeos do YouTube). A ordem define a sequência que o aluno
            segue.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/admin/cursos">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Voltar
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href={`/cursos/${cursoId}`}>
              <Eye className="size-4" aria-hidden="true" />
              Ver como aluno
            </Link>
          </Button>
          <Button className="rounded-full" onClick={abrirNovoModulo}>
            <PlusCircle className="size-4" aria-hidden="true" />
            Novo módulo
          </Button>
        </div>
      </div>

      {erro ? (
        <p role="alert" className="mt-6 rounded-xl bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
          {erro}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-4">
        {carregando ? (
          <div className="h-40 animate-pulse rounded-3xl bg-card/60" />
        ) : modulos.length === 0 ? (
          <Card className="glass rounded-3xl border-0">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Nenhum módulo ainda. Clique em <strong>Novo módulo</strong> para começar.
            </CardContent>
          </Card>
        ) : (
          modulos.map((modulo, i) => (
            <Card key={modulo.id} className="glass rounded-3xl border-0">
              <CardHeader className="flex-row flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="font-serif text-xl">
                    Módulo {i + 1} · {modulo.titulo}
                  </CardTitle>
                  <CardDescription>
                    {modulo.aulas.length} {modulo.aulas.length === 1 ? "aula" : "aulas"} · ordem {modulo.ordem}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="rounded-full" onClick={() => abrirNovaAula(modulo)}>
                    <PlusCircle className="size-4" aria-hidden="true" />
                    Aula
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => abrirEdicaoModulo(modulo)}>
                    <Pencil className="size-4" aria-hidden="true" />
                    <span className="sr-only">Editar módulo {modulo.titulo}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-destructive hover:bg-destructive/10"
                    onClick={() => setRemocao({ tipo: "modulo", id: modulo.id, titulo: modulo.titulo })}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                    <span className="sr-only">Excluir módulo {modulo.titulo}</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {modulo.aulas.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sem aulas neste módulo.</p>
                ) : (
                  <ul className="flex flex-col divide-y rounded-2xl bg-card/70">
                    {modulo.aulas.map((aula, j) => (
                      <li key={aula.id} className="flex items-center gap-3 px-3 py-2.5">
                        <PlayCircle className="size-4 shrink-0 text-primary" aria-hidden="true" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {j + 1}. {aula.titulo}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">{aula.videoUrl}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => abrirEdicaoAula(aula)}>
                          <Pencil className="size-4" aria-hidden="true" />
                          <span className="sr-only">Editar aula {aula.titulo}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full text-destructive hover:bg-destructive/10"
                          onClick={() => setRemocao({ tipo: "aula", id: aula.id, titulo: aula.titulo })}
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                          <span className="sr-only">Excluir aula {aula.titulo}</span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={Boolean(formModulo)} onOpenChange={(open) => !open && setFormModulo(null)}>
        <DialogContent className="glass-strong rounded-3xl border p-6 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{formModulo?.id ? "Editar módulo" : "Novo módulo"}</DialogTitle>
          </DialogHeader>
          {formModulo ? (
            <form onSubmit={salvarModulo} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="m-titulo">Título</Label>
                <Input
                  id="m-titulo"
                  value={formModulo.titulo}
                  onChange={(e) => setFormModulo({ ...formModulo, titulo: e.target.value })}
                  placeholder="Ex.: Introdução"
                  className="rounded-xl bg-card"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="m-ordem">Ordem</Label>
                <Input
                  id="m-ordem"
                  type="number"
                  value={formModulo.ordem}
                  onChange={(e) => setFormModulo({ ...formModulo, ordem: e.target.value })}
                  className="rounded-xl bg-card"
                />
              </div>
              {erroForm ? (
                <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                  {erroForm}
                </p>
              ) : null}
              <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" className="rounded-full" onClick={() => setFormModulo(null)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={salvando} className="rounded-full">
                  {salvando ? "Salvando..." : "Salvar módulo"}
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(formAula)} onOpenChange={(open) => !open && setFormAula(null)}>
        <DialogContent className="glass-strong rounded-3xl border p-6 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{formAula?.id ? "Editar aula" : "Nova aula"}</DialogTitle>
            <DialogDescription>O vídeo é reproduzido dentro do site, no mesmo player dos outros vídeos.</DialogDescription>
          </DialogHeader>
          {formAula ? (
            <form onSubmit={salvarAula} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="a-titulo">Título</Label>
                <Input
                  id="a-titulo"
                  value={formAula.titulo}
                  onChange={(e) => setFormAula({ ...formAula, titulo: e.target.value })}
                  placeholder="Ex.: Aula 1 — Boas-vindas"
                  className="rounded-xl bg-card"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="a-video">Link do vídeo (YouTube)</Label>
                <Input
                  id="a-video"
                  value={formAula.videoUrl}
                  onChange={(e) => setFormAula({ ...formAula, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="rounded-xl bg-card"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="a-descricao">Descrição (opcional)</Label>
                <Textarea
                  id="a-descricao"
                  value={formAula.descricao}
                  onChange={(e) => setFormAula({ ...formAula, descricao: e.target.value })}
                  rows={3}
                  className="rounded-xl bg-card"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="a-ordem">Ordem no módulo</Label>
                <Input
                  id="a-ordem"
                  type="number"
                  value={formAula.ordem}
                  onChange={(e) => setFormAula({ ...formAula, ordem: e.target.value })}
                  className="rounded-xl bg-card"
                />
              </div>
              {erroForm ? (
                <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                  {erroForm}
                </p>
              ) : null}
              <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" className="rounded-full" onClick={() => setFormAula(null)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={salvando} className="rounded-full">
                  {salvando ? "Salvando..." : "Salvar aula"}
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(remocao)} onOpenChange={(open) => !open && setRemocao(null)}>
        <DialogContent className="glass-strong rounded-3xl border p-6 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-serif text-2xl text-destructive">
              <AlertTriangle className="size-5" /> {remocao?.tipo === "modulo" ? "Excluir módulo?" : "Excluir aula?"}
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm leading-relaxed">
              Tem certeza que deseja excluir <strong>"{remocao?.titulo}"</strong>?
              {remocao?.tipo === "modulo" ? " Todas as aulas deste módulo também serão excluídas." : ""} Esta ação não
              poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" className="rounded-full" onClick={() => setRemocao(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" className="gap-1.5 rounded-full" onClick={confirmarRemocao}>
              <Trash2 className="size-4" />
              Sim, excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
