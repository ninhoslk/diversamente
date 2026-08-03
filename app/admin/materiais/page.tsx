"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { AlertTriangle, PlusCircle, Search, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Breadcrumbs } from "@/components/app/breadcrumbs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { CATEGORIAS, PUBLICOS, TIPOS, TRILHAS } from "@/lib/catalog"
import { useApp } from "@/lib/app-provider"

export default function AdminMateriaisPage() {
  const { materiais, removerMaterial } = useApp()
  const [busca, setBusca] = useState("")
  const [trilha, setTrilha] = useState("todas")
  const [tipo, setTipo] = useState("todos")
  const [materialParaRemover, setMaterialParaRemover] = useState<{ id: string; titulo: string } | null>(null)

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return materiais.filter((m) => {
      if (trilha !== "todas" && m.trilha !== trilha) return false
      if (tipo !== "todos" && m.tipo !== tipo) return false
      if (termo && !m.titulo.toLowerCase().includes(termo)) return false
      return true
    })
  }, [materiais, busca, trilha, tipo])

  function confirmarRemocao() {
    if (!materialParaRemover) return
    removerMaterial(materialParaRemover.id)
    toast.success("Material excluído com sucesso", { description: materialParaRemover.titulo })
    setMaterialParaRemover(null)
  }

  return (
    <>
      <Breadcrumbs
        itens={[
          { label: "Conteúdos", href: "/conteudos" },
          { label: "Painel Admin", href: "/admin" },
          { label: "Materiais" },
        ]}
      />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Materiais</h1>
          <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
            Gerencie todos os PDFs, vídeos e jogos publicados na plataforma.
          </p>
        </div>
        <Button asChild size="lg" className="rounded-full">
          <Link href="/admin/materiais/novo">
            <PlusCircle className="size-4" aria-hidden="true" />
            Novo material
          </Link>
        </Button>
      </div>

      <Card className="glass mt-8 rounded-3xl border-0">
        <CardContent className="flex flex-col gap-6 pt-6">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto]">
            <div className="flex flex-col gap-2">
              <Label htmlFor="busca">Buscar por título</Label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="busca"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Ex.: caderno de atividades"
                  className="rounded-full bg-card pl-9"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="filtro-trilha">Trilha</Label>
              <Select value={trilha} onValueChange={setTrilha}>
                <SelectTrigger id="filtro-trilha" className="w-full rounded-full bg-card sm:w-52">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="todas">Todas as trilhas</SelectItem>
                  {TRILHAS.map((t) => (
                    <SelectItem key={t.slug} value={t.slug}>
                      {t.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="filtro-tipo">Tipo</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger id="filtro-tipo" className="w-full rounded-full bg-card sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  {TIPOS.map((t) => (
                    <SelectItem key={t.slug} value={t.slug}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-card/70">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden md:table-cell">Trilha</TableHead>
                  <TableHead className="hidden lg:table-cell">Categoria</TableHead>
                  <TableHead className="hidden lg:table-cell">Público</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="hidden sm:table-cell">Criado</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                      Nenhum material encontrado com esses filtros.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtrados.map((m) => {
                    const t = TRILHAS.find((x) => x.slug === m.trilha)
                    const c = CATEGORIAS.find((x) => x.slug === m.categoria)
                    return (
                      <TableRow key={m.id}>
                        <TableCell className="max-w-[22rem] font-medium">{m.titulo}</TableCell>
                        <TableCell className="hidden text-sm text-muted-foreground md:table-cell">{t?.nome}</TableCell>
                        <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">{c?.nome}</TableCell>
                        <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                          {PUBLICOS[m.publico]}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="rounded-full text-[10px] uppercase">
                            {m.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden text-sm tabular-nums text-muted-foreground sm:table-cell">
                          {m.criadoEm.split("-").reverse().join("/")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full text-destructive hover:bg-destructive/10"
                            onClick={() => setMaterialParaRemover({ id: m.id, titulo: m.titulo })}
                          >
                            <Trash2 className="size-4" aria-hidden="true" />
                            <span className="sr-only">Remover {m.titulo}</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <p className="text-xs text-muted-foreground">
            {filtrados.length} de {materiais.length} materiais
          </p>
        </CardContent>
      </Card>

      {/* DIALOG DE CONFIRMAÇÃO DE REMOÇÃO */}
      <Dialog open={Boolean(materialParaRemover)} onOpenChange={(open) => !open && setMaterialParaRemover(null)}>
        <DialogContent className="glass-strong border sm:max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-destructive flex items-center gap-2">
              <AlertTriangle className="size-5" /> Excluir Material?
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm leading-relaxed">
              Tem certeza que deseja excluir o material <strong>"{materialParaRemover?.titulo}"</strong>?
              Esta ação removerá o arquivo da biblioteca pedagógica e não poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => setMaterialParaRemover(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="rounded-full gap-1.5"
              onClick={confirmarRemocao}
            >
              <Trash2 className="size-4" />
              Sim, Excluir Material
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
