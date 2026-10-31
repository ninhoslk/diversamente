"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { AulaCurso, ModuloCurso } from "@/lib/cursos"
import { createClient } from "@/lib/supabase/client"
import { useApp } from "@/lib/app-provider"

/**
 * Módulos, aulas e o progresso do usuário logado em TODOS os cursos. São
 * listas pequenas, então uma única busca serve tanto à aba /cursos (percentual
 * por curso) quanto à página do curso e ao painel admin.
 */
export function useCursosConteudo() {
  const { usuario } = useApp()
  const supabase = useMemo(() => createClient(), [])

  const [modulos, setModulos] = useState<ModuloCurso[]>([])
  const [assistidas, setAssistidas] = useState<Set<string>>(new Set())
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const recarregar = useCallback(async () => {
    if (!usuario) return
    setCarregando(true)

    const [resModulos, resAulas, resProgresso] = await Promise.all([
      supabase.from("curso_modulos").select("*").order("ordem").order("created_at"),
      supabase.from("curso_aulas").select("*").order("ordem").order("created_at"),
      supabase.from("curso_progresso").select("aula_id").eq("user_id", usuario.id),
    ])

    if (resModulos.error || resAulas.error || resProgresso.error) {
      setErro("Não foi possível carregar o conteúdo dos cursos agora. Tente novamente em instantes.")
      setCarregando(false)
      return
    }

    const aulas: AulaCurso[] = (resAulas.data ?? []).map((row: Record<string, unknown>) => ({
      id: row.id as string,
      moduloId: row.modulo_id as string,
      titulo: row.titulo as string,
      descricao: (row.descricao as string) ?? "",
      videoUrl: (row.video_url as string) ?? "",
      ordem: (row.ordem as number) ?? 0,
    }))

    setModulos(
      (resModulos.data ?? []).map((row: Record<string, unknown>) => ({
        id: row.id as string,
        cursoId: row.curso_id as string,
        titulo: row.titulo as string,
        ordem: (row.ordem as number) ?? 0,
        aulas: aulas.filter((a) => a.moduloId === row.id),
      })),
    )
    setAssistidas(new Set((resProgresso.data ?? []).map((row: { aula_id: string }) => row.aula_id)))
    setErro(null)
    setCarregando(false)
  }, [supabase, usuario])

  useEffect(() => {
    recarregar()
  }, [recarregar])

  const modulosDoCurso = useCallback((cursoId: string) => modulos.filter((m) => m.cursoId === cursoId), [modulos])

  const aulasDoCurso = useCallback(
    (cursoId: string) => modulosDoCurso(cursoId).flatMap((m) => m.aulas),
    [modulosDoCurso],
  )

  /** Marca/desmarca uma aula como assistida (otimista; desfaz se o banco recusar). */
  const alternarAssistida = useCallback(
    async (aulaId: string) => {
      if (!usuario) return
      const jaAssistida = assistidas.has(aulaId)

      setAssistidas((atual) => {
        const novo = new Set(atual)
        if (jaAssistida) novo.delete(aulaId)
        else novo.add(aulaId)
        return novo
      })

      const { error } = jaAssistida
        ? await supabase.from("curso_progresso").delete().eq("user_id", usuario.id).eq("aula_id", aulaId)
        : await supabase.from("curso_progresso").insert({ user_id: usuario.id, aula_id: aulaId })

      if (error) {
        setAssistidas((atual) => {
          const novo = new Set(atual)
          if (jaAssistida) novo.add(aulaId)
          else novo.delete(aulaId)
          return novo
        })
        return false
      }
      return true
    },
    [assistidas, supabase, usuario],
  )

  return { modulos, assistidas, carregando, erro, recarregar, modulosDoCurso, aulasDoCurso, alternarAssistida }
}
