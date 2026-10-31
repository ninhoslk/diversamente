export type Curso = {
  id: string
  titulo: string
  descricao: string
  imagemUrl: string
  criadoEm: string
}

export type AulaCurso = {
  id: string
  moduloId: string
  titulo: string
  descricao: string
  videoUrl: string
  ordem: number
}

export type ModuloCurso = {
  id: string
  cursoId: string
  titulo: string
  ordem: number
  aulas: AulaCurso[]
}

/** Percentual (0–100, inteiro) de aulas assistidas entre as aulas informadas. */
export function percentualAssistido(aulas: { id: string }[], assistidas: Set<string>) {
  if (aulas.length === 0) return 0
  const feitas = aulas.filter((a) => assistidas.has(a.id)).length
  return Math.round((feitas / aulas.length) * 100)
}
