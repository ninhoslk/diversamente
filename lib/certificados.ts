export type Certificado = {
  id: string
  codigo: string
  titulo: string
  imagemFrenteUrl: string
  imagemVersoUrl: string
  driveUrl: string
  criadoEm: string
}

/** Mesmo formato validado no banco (CHECK em supabase/schema.sql) e na API. */
export const CODIGO_CERTIFICADO_REGEX = /^[A-Za-z0-9-]{3,80}$/
