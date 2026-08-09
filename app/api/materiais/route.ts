import { NextResponse } from "next/server"
import { getUsuarioAtual } from "@/lib/supabase/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"
import { CATEGORIAS, TRILHAS, PUBLICOS, type PublicoSlug, type TipoMaterial } from "@/lib/catalog"

const TAMANHO_MAXIMO_PDF = 50 * 1024 * 1024 // 50MB, deve casar com file_size_limit do bucket

function sanitizarNomeArquivo(nome: string) {
  return nome.replace(/[^a-zA-Z0-9.\-_]/g, "_").slice(-140)
}

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
  const formData = await request.formData()
  const titulo = String(formData.get("titulo") ?? "").trim()
  const descricao = String(formData.get("descricao") ?? "").trim()
  const tipo = String(formData.get("tipo") ?? "") as TipoMaterial
  const trilha = String(formData.get("trilha") ?? "")
  const categoria = String(formData.get("categoria") ?? "")
  const publico = String(formData.get("publico") ?? "")
  const url = String(formData.get("url") ?? "").trim()
  const arquivo = formData.get("arquivo")

  if (!titulo) return NextResponse.json({ ok: false, erro: "Informe o título do material." }, { status: 400 })
  if (!["pdf", "video", "jogo"].includes(tipo)) {
    return NextResponse.json({ ok: false, erro: "Tipo de material inválido." }, { status: 400 })
  }

  const erroDestino = validarDestino(trilha, categoria, publico)
  if (erroDestino) return NextResponse.json({ ok: false, erro: erroDestino }, { status: 400 })

  let storagePath: string | null = null
  let urlFinal: string | null = null

  if (tipo === "pdf") {
    const usaArquivo = arquivo instanceof File && arquivo.size > 0

    if (usaArquivo) {
      const file = arquivo as File

      if (file.type !== "application/pdf") {
        return NextResponse.json({ ok: false, erro: "O arquivo enviado precisa ser um PDF." }, { status: 400 })
      }
      if (file.size > TAMANHO_MAXIMO_PDF) {
        return NextResponse.json({ ok: false, erro: "O PDF excede o limite de 50MB." }, { status: 400 })
      }

      const nomeUnico = `${trilha}/${categoria}/${Date.now()}_${sanitizarNomeArquivo(file.name)}`
      const bytes = new Uint8Array(await file.arrayBuffer())

      const { data, error } = await admin.storage.from("materiais").upload(nomeUnico, bytes, {
        contentType: "application/pdf",
        cacheControl: "3600",
        upsert: false,
      })

      if (error || !data?.path) {
        return NextResponse.json({ ok: false, erro: "Não foi possível enviar o arquivo PDF." }, { status: 500 })
      }
      storagePath = data.path
      onStorageUpload(storagePath)
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
