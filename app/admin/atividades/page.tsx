"use client"

import { useState } from "react"
import { AlertTriangle, Link2, PlayCircle, PlusCircle, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Breadcrumbs } from "@/components/app/breadcrumbs"
import { Badge } from "@/components/ui/badge"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { TIPOS_ATIVIDADE, type TipoAtividade } from "@/lib/atividades"
import { useApp } from "@/lib/app-provider"

const ICONES: Record<TipoAtividade, typeof PlayCircle> = {
  video: PlayCircle,
  link: Link2,
}

export default function AdminAtividadesPage() {
  const { atividadesItens, recarregarAtividades, removerItemAtividade } = useApp()

  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [tipo, setTipo] = useState<TipoAtividade>("video")
  const [url, setUrl] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [itemParaRemover, setItemParaRemover] = useState<{ id: string; titulo: string } | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)

    if (!titulo.trim()) return setErro("Informe o título.")
    if (!url.trim()) return setErro("Informe o link do conteúdo.")

    try {
      setEnviando(true)
      const res = await fetch("/api/atividades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: titulo.trim(), descricao: descricao.trim(), tipo, url: url.trim() }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setErro(data.erro ?? "Não foi possível publicar o item.")
        return
      }

      toast.success("Item publicado na biblioteca de atividades!", { description: titulo.trim() })
      setTitulo("")
      setDescricao("")
      setUrl("")
      setTipo("video")
      await recarregarAtividades()
    } catch {
      setErro("Erro de conexão ao publicar o item.")
    } finally {
      setEnviando(false)
    }
  }

  async function confirmarRemocao() {
    if (!itemParaRemover) return
    const resultado = await removerItemAtividade(itemParaRemover.id)
    if (!resultado.ok) {
      toast.error(resultado.erro ?? "Não foi possível excluir o item.")
      return
    }
    toast.success("Item excluído com sucesso", { description: itemParaRemover.titulo })
    setItemParaRemover(null)
  }

  return (
    <>
      <Breadcrumbs
        itens={[
          { label: "Material Didático", href: "/conteudos" },
          { label: "Painel Admin", href: "/admin" },
          { label: "Biblioteca de Atividades" },
        ]}
      />

      <div className="max-w-xl">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Biblioteca de Atividades
        </h1>
        <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
          Publique vídeos (tocam direto na página, como no Material Didático) e links de atividades. Visível para
          qualquer estudante, educador ou família autenticado, sem restrição de turma.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <Card className="glass rounded-3xl border-0">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Novo item</CardTitle>
            <CardDescription>
              Vídeo: link do YouTube/Vimeo/arquivo. Link: o usuário é redirecionado para o endereço informado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="a-titulo">Título</Label>
                <Input
                  id="a-titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex.: Roda de conversa sobre reciclagem"
                  className="rounded-xl bg-card"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="a-descricao">Descrição</Label>
                <Textarea
                  id="a-descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Resumo curto sobre a atividade."
                  rows={3}
                  className="rounded-xl bg-card"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="a-tipo">Tipo</Label>
                <Select value={tipo} onValueChange={(v) => setTipo((v as TipoAtividade) ?? "video")}>
                  <SelectTrigger id="a-tipo" className="rounded-xl bg-card">
                    <SelectValue>{(v: TipoAtividade) => TIPOS_ATIVIDADE.find((t) => t.slug === v)?.label ?? v}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {TIPOS_ATIVIDADE.map((t) => (
                      <SelectItem key={t.slug} value={t.slug}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="a-url">{tipo === "video" ? "Link do vídeo" : "Link do conteúdo"}</Label>
                <Input
                  id="a-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={tipo === "video" ? "https://youtube.com/watch?v=..." : "https://..."}
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
                {enviando ? "Publicando..." : "Publicar item"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="glass rounded-3xl border-0">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Itens publicados ({atividadesItens.length})</CardTitle>
            <CardDescription>Vídeos e links já disponíveis na biblioteca de atividades.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-2xl bg-card/70">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="hidden sm:table-cell">Criado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {atividadesItens.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                        Nenhum item publicado ainda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    atividadesItens.map((item) => {
                      const Icone = ICONES[item.tipo] ?? Link2
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="max-w-[16rem] font-medium">
                            <div className="flex items-center gap-2">
                              <Icone className="size-4 shrink-0 text-primary" aria-hidden="true" />
                              <span className="truncate">{item.titulo}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="rounded-full text-[10px] uppercase">
                              {item.tipo}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden text-sm tabular-nums text-muted-foreground sm:table-cell">
                            {item.criadoEm.split("-").reverse().join("/")}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full text-destructive hover:bg-destructive/10"
                              onClick={() => setItemParaRemover({ id: item.id, titulo: item.titulo })}
                            >
                              <Trash2 className="size-4" aria-hidden="true" />
                              <span className="sr-only">Remover {item.titulo}</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={Boolean(itemParaRemover)} onOpenChange={(open) => !open && setItemParaRemover(null)}>
        <DialogContent className="glass-strong border sm:max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-destructive flex items-center gap-2">
              <AlertTriangle className="size-5" /> Excluir item?
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm leading-relaxed">
              Tem certeza que deseja excluir <strong>"{itemParaRemover?.titulo}"</strong> da biblioteca de atividades?
              Esta ação não poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" className="rounded-full" onClick={() => setItemParaRemover(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" className="rounded-full gap-1.5" onClick={confirmarRemocao}>
              <Trash2 className="size-4" />
              Sim, excluir item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
