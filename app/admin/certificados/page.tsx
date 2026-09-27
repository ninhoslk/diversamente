"use client"

import { useState } from "react"
import Link from "next/link"
import { AlertTriangle, Award, ExternalLink, PlusCircle, RefreshCw, Trash2 } from "lucide-react"
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
import { useApp } from "@/lib/app-provider"

function gerarCodigoSugerido() {
  return crypto.randomUUID()
}

export default function AdminCertificadosPage() {
  const { certificados, recarregarCertificados, removerCertificado } = useApp()

  const [codigo, setCodigo] = useState("")
  const [titulo, setTitulo] = useState("")
  const [imagemFrenteUrl, setImagemFrenteUrl] = useState("")
  const [imagemVersoUrl, setImagemVersoUrl] = useState("")
  const [driveUrl, setDriveUrl] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [certificadoParaRemover, setCertificadoParaRemover] = useState<{ id: string; codigo: string } | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)

    if (!codigo.trim()) return setErro("Informe o código do certificado.")
    if (!imagemFrenteUrl.trim()) return setErro("Informe o link da imagem de frente.")
    if (!imagemVersoUrl.trim()) return setErro("Informe o link da imagem de verso.")
    if (!driveUrl.trim()) return setErro("Informe o link do Google Drive.")

    try {
      setEnviando(true)
      const res = await fetch("/api/certificados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo: codigo.trim(),
          titulo: titulo.trim(),
          imagemFrenteUrl: imagemFrenteUrl.trim(),
          imagemVersoUrl: imagemVersoUrl.trim(),
          driveUrl: driveUrl.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setErro(data.erro ?? "Não foi possível publicar o certificado.")
        return
      }

      toast.success("Certificado publicado!", { description: `Código: ${codigo.trim()}` })
      setCodigo("")
      setTitulo("")
      setImagemFrenteUrl("")
      setImagemVersoUrl("")
      setDriveUrl("")
      await recarregarCertificados()
    } catch {
      setErro("Erro de conexão ao publicar o certificado.")
    } finally {
      setEnviando(false)
    }
  }

  async function confirmarRemocao() {
    if (!certificadoParaRemover) return
    const resultado = await removerCertificado(certificadoParaRemover.id)
    if (!resultado.ok) {
      toast.error(resultado.erro ?? "Não foi possível excluir o certificado.")
      return
    }
    toast.success("Certificado excluído.", { description: certificadoParaRemover.codigo })
    setCertificadoParaRemover(null)
  }

  return (
    <>
      <Breadcrumbs
        itens={[
          { label: "Material Didático", href: "/conteudos" },
          { label: "Painel Admin", href: "/admin" },
          { label: "Certificados" },
        ]}
      />

      <div className="max-w-xl">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Certificados</h1>
        <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
          Cada certificado ganha uma página pública própria em <code className="rounded bg-secondary px-1 py-0.5 text-xs">/certificados/&lt;código&gt;</code>,
          com as duas imagens e um botão de download que leva ao Google Drive. As imagens ficam hospedadas fora da
          plataforma — só o link é salvo aqui.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <Card className="glass rounded-3xl border-0">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Novo certificado</CardTitle>
            <CardDescription>O código vira a URL pública de verificação.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="c-codigo">Código</Label>
                <div className="flex gap-2">
                  <Input
                    id="c-codigo"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="ex.: turma2026-000123"
                    className="rounded-xl bg-card"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0 rounded-xl"
                    onClick={() => setCodigo(gerarCodigoSugerido())}
                    title="Gerar código aleatório"
                  >
                    <RefreshCw className="size-4" aria-hidden="true" />
                  </Button>
                </div>
                <span className="text-xs text-muted-foreground">
                  Apenas letras, números e hífen. Escolha um padrão próprio ou use o gerador.
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="c-titulo">Título (opcional)</Label>
                <Input
                  id="c-titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex.: Certificado de Participação — Turma 2026"
                  className="rounded-xl bg-card"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="c-frente">Link da imagem de frente</Label>
                <Input
                  id="c-frente"
                  value={imagemFrenteUrl}
                  onChange={(e) => setImagemFrenteUrl(e.target.value)}
                  placeholder="https://..."
                  className="rounded-xl bg-card"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="c-verso">Link da imagem de verso</Label>
                <Input
                  id="c-verso"
                  value={imagemVersoUrl}
                  onChange={(e) => setImagemVersoUrl(e.target.value)}
                  placeholder="https://..."
                  className="rounded-xl bg-card"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="c-drive">Link do Google Drive (download)</Label>
                <Input
                  id="c-drive"
                  value={driveUrl}
                  onChange={(e) => setDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="rounded-xl bg-card"
                />
              </div>

              {erro ? (
                <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive font-medium">
                  {erro}
                </p>
              ) : null}

              <Button type="submit" size="lg" disabled={enviando} className="rounded-full">
                <PlusCircle className="size-4" aria-hidden="true" />
                {enviando ? "Publicando..." : "Publicar certificado"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="glass rounded-3xl border-0">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Certificados publicados ({certificados.length})</CardTitle>
            <CardDescription>Clique no link para abrir a página pública de verificação.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-2xl bg-card/70">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead className="hidden md:table-cell">Título</TableHead>
                    <TableHead className="hidden sm:table-cell">Criado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                        Nenhum certificado publicado ainda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    certificados.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="max-w-[14rem] font-medium">
                          <div className="flex items-center gap-2">
                            <Award className="size-4 shrink-0 text-primary" aria-hidden="true" />
                            <span className="truncate font-mono text-xs sm:text-sm">{c.codigo}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden max-w-[14rem] truncate text-sm text-muted-foreground md:table-cell">
                          {c.titulo || "—"}
                        </TableCell>
                        <TableCell className="hidden text-sm tabular-nums text-muted-foreground sm:table-cell">
                          {c.criadoEm.split("-").reverse().join("/")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button asChild variant="ghost" size="icon" className="rounded-full">
                              <Link href={`/certificados/${c.codigo}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="size-4" aria-hidden="true" />
                                <span className="sr-only">Abrir página pública de {c.codigo}</span>
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full text-destructive hover:bg-destructive/10"
                              onClick={() => setCertificadoParaRemover({ id: c.id, codigo: c.codigo })}
                            >
                              <Trash2 className="size-4" aria-hidden="true" />
                              <span className="sr-only">Remover {c.codigo}</span>
                            </Button>
                          </div>
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

      <Dialog open={Boolean(certificadoParaRemover)} onOpenChange={(open) => !open && setCertificadoParaRemover(null)}>
        <DialogContent className="glass-strong border sm:max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-destructive flex items-center gap-2">
              <AlertTriangle className="size-5" /> Excluir certificado?
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm leading-relaxed">
              Tem certeza que deseja excluir o certificado <strong>"{certificadoParaRemover?.codigo}"</strong>? O link
              público deixará de funcionar imediatamente. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" className="rounded-full" onClick={() => setCertificadoParaRemover(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" className="rounded-full gap-1.5" onClick={confirmarRemocao}>
              <Trash2 className="size-4" />
              Sim, excluir certificado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
