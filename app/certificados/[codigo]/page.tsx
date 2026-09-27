import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Download, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageShell } from "@/components/site/page-shell"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"

type CertificadoPublico = {
  codigo: string
  titulo: string | null
  imagem_frente_url: string
  imagem_verso_url: string
  drive_url: string
}

/**
 * Busca direto com a service_role (ignora RLS) — a tabela "certificados" não
 * tem nenhuma policy de leitura pública (ver supabase/schema.sql, seção 7),
 * então este é o único caminho de leitura para quem não está logado. Só
 * retorna a linha cujo código bate exatamente: sem o código, não há como
 * listar ou descobrir outros certificados por aqui.
 */
async function buscarCertificado(codigo: string): Promise<CertificadoPublico | null> {
  const admin = createAdminSupabaseClient()
  const { data } = await admin
    .from("certificados")
    .select("codigo, titulo, imagem_frente_url, imagem_verso_url, drive_url")
    .eq("codigo", codigo)
    .maybeSingle()
  return data
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ codigo: string }>
}): Promise<Metadata> {
  const { codigo } = await params
  const certificado = await buscarCertificado(codigo)
  return {
    title: certificado ? "Verificação de Certificado" : "Certificado não encontrado",
    description: certificado
      ? `Página oficial de verificação do certificado ${codigo}, emitido pela Coleção Diversamente.`
      : undefined,
  }
}

export default async function CertificadoPage({
  params,
}: {
  params: Promise<{ codigo: string }>
}) {
  const { codigo } = await params
  const certificado = await buscarCertificado(codigo)
  if (!certificado) notFound()

  return (
    <PageShell
      titulo={certificado.titulo || "Certificado"}
      subtitulo={`Código de verificação: ${certificado.codigo}`}
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
        <span className="glass inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          Certificado verificado — Coleção Diversamente
        </span>

        <div className="grid w-full gap-5 sm:grid-cols-2">
          <Card className="overflow-hidden rounded-3xl border p-0 shadow-sm">
            <div className="relative aspect-[4/3] w-full bg-muted/40">
              <img
                src={certificado.imagem_frente_url}
                alt={`Frente do certificado ${certificado.codigo}`}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-contain"
              />
            </div>
            <CardContent className="border-t py-2.5 text-center">
              <span className="text-xs font-medium text-muted-foreground">Frente</span>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-3xl border p-0 shadow-sm">
            <div className="relative aspect-[4/3] w-full bg-muted/40">
              <img
                src={certificado.imagem_verso_url}
                alt={`Verso do certificado ${certificado.codigo}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain"
              />
            </div>
            <CardContent className="border-t py-2.5 text-center">
              <span className="text-xs font-medium text-muted-foreground">Verso</span>
            </CardContent>
          </Card>
        </div>

        <Button asChild size="lg" className="rounded-full px-8">
          <a href={certificado.drive_url} target="_blank" rel="noopener noreferrer">
            <Download className="size-4" aria-hidden="true" />
            Baixar certificado
          </a>
        </Button>

        <p className="max-w-md text-pretty text-center text-xs leading-relaxed text-muted-foreground">
          O download é feito através do Google Drive. Se o link não abrir, confira se o endereço foi copiado
          corretamente ou entre em contato com a Coleção Diversamente.
        </p>
      </div>
    </PageShell>
  )
}
