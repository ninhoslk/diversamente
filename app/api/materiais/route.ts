import { NextResponse } from "next/server"
import { getUsuarioAtual } from "@/lib/supabase/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"
import { CATEGORIAS, TRILHAS, PUBLICOS, TIPOS, tiposDisponiveisNaTrilha, type PublicoSlug, type TipoMaterial } from "@/lib/catalog"

export function validarDestino(trilha: string, categoria: string, publico: string) {
  const trilhaValida = TRILHAS.some((t) => t.slug === trilha)
  if (!trilhaValida) return "Trilha inválida."

  const categoriaObj = CATEGORIAS.find((c) => c.slug === categoria && c.trilha === trilha)
  if (!categoriaObj) return "Categoria inválida para a trilha selecionada."

  if (!Object.keys(PUBLICOS).includes(publico) || !categoriaObj.publicos.includes(publico as PublicoSlug)) {
    return "Público inválido para a categoria selecionada."
  }

  return null
}

export async function POST(request: Request) {
  const usuario = await getUsuarioAtual()
  if (!usuario || usuario.papel !== "admin") {
    return NextResponse.json({ ok: false, erro: "Acesso restrito a administradores." }, { status: 403 })
  }

  const admin = createAdminSupabaseClient()
  // Rastreado fora do try para que o catch consiga limpar o arquivo já enviado
  // caso algo inesperado (timeout, conexão caindo) aconteça depois do upload.
  let storagePathParaLimpeza: string | null = null

  try {
    return await processarEnvio(request, usuario, admin, (path) => {
      storagePathParaLimpeza = path
    })
  } catch (e) {
    console.error("Erro inesperado ao processar envio de material:", e)
    if (storagePathParaLimpeza) {
      await admin.storage.from("materiais").remove([storagePathParaLimpeza]).catch(() => {})
    }
    return NextResponse.json(
      { ok: false, erro: "Erro inesperado ao processar o envio. Tente novamente." },
      { status: 500 },
    )
  }
}

async function processarEnvio(
  request: Request,
  usuario: { id: string },
  admin: ReturnType<typeof createAdminSupabaseClient>,
  onStorageUpload: (path: string) => void,
) {
  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ ok: false, erro: "Dados inválidos." }, { status: 400 })

  const titulo = String(body.titulo ?? "").trim()
  const descricao = String(body.descricao ?? "").trim()
  const tipo = String(body.tipo ?? "") as TipoMaterial
  const trilha = String(body.trilha ?? "")
  const categoria = String(body.categoria ?? "")
  const publico = String(body.publico ?? "")
  const url = String(body.url ?? "").trim()
  // Caminho de um arquivo já enviado diretamente ao Storage via URL assinada
  // (ver /api/materiais/upload-url) — o binário nunca passa por esta rota.
  const storagePathEnviado = typeof body.storagePath === "string" ? body.storagePath.trim() : ""

  if (!titulo) return NextResponse.json({ ok: false, erro: "Informe o título do material." }, { status: 400 })
  if (!TIPOS.some((t) => t.slug === tipo)) {
    return NextResponse.json({ ok: false, erro: "Tipo de material inválido." }, { status: 400 })
  }
  // Cada trilha só aceita os tipos base (pdf/vídeo/jogo) + seus tiposExtras
  // (ex.: manual/projeto só na Educação Ambiental, áudio só na Educação
  // Infantil e no Fundamental I) — evita criar material "órfão" que nunca
  // aparece em nenhuma aba de tipo naquela trilha. Ver lib/catalog.ts.
  if (!tiposDisponiveisNaTrilha(trilha).includes(tipo)) {
    return NextResponse.json(
      { ok: false, erro: "Este tipo de material não está disponível para a trilha selecionada." },
      { status: 400 },
    )
  }

  const erroDestino = validarDestino(trilha, categoria, publico)
  if (erroDestino) return NextResponse.json({ ok: false, erro: erroDestino }, { status: 400 })

  let storagePath: string | null = null
  let urlFinal: string | null = null

  if (tipo === "pdf" || tipo === "manual" || tipo === "projeto") {
    if (storagePathEnviado) {
      if (!storagePathEnviado.startsWith(`${trilha}/${categoria}/`)) {
        return NextResponse.json({ ok: false, erro: "Caminho de arquivo inválido." }, { status: 400 })
      }

      const ultimaBarra = storagePathEnviado.lastIndexOf("/")
      const pasta = storagePathEnviado.slice(0, ultimaBarra)
      const nomeArquivo = storagePathEnviado.slice(ultimaBarra + 1)
      const { data: listagem, error: erroListagem } = await admin.storage
        .from("materiais")
        .list(pasta, { search: nomeArquivo })

      if (erroListagem || !listagem?.some((f) => f.name === nomeArquivo)) {
        return NextResponse.json(
          { ok: false, erro: "O arquivo enviado não foi encontrado. Tente enviar novamente." },
          { status: 400 },
        )
      }

      storagePath = storagePathEnviado
      onStorageUpload(storagePathEnviado)
    } else if (url) {
      try {
        const parsed = new URL(url)
        if (parsed.protocol !== "https:") throw new Error("protocolo inválido")
      } catch {
        return NextResponse.json({ ok: false, erro: "Informe um link https:// válido para o PDF." }, { status: 400 })
      }
      urlFinal = url
    } else {
      return NextResponse.json(
        { ok: false, erro: "Envie um arquivo PDF ou informe um link para o PDF." },
        { status: 400 },
      )
    }
  } else {
    if (!url) return NextResponse.json({ ok: false, erro: "Informe o link do material." }, { status: 400 })
    urlFinal = url
  }

  const { data: novoMaterial, error: erroInsert } = await admin
    .from("materials")
    .insert({
      titulo,
      descricao,
      tipo,
      url: urlFinal,
      storage_path: storagePath,
      trilha,
      categoria,
      publico,
      created_by: usuario.id,
    })
    .select()
    .single()

  if (erroInsert) {
    console.error("Erro ao inserir material:", erroInsert)
    // limpa o arquivo já enviado se o registro no banco falhar
    if (storagePath) await admin.storage.from("materiais").remove([storagePath])
    return NextResponse.json({ ok: false, erro: "Não foi possível salvar o material." }, { status: 500 })
  }

  return NextResponse.json({ ok: true, material: novoMaterial })
}
