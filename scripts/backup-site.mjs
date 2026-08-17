// Faz um backup local dos dados do Supabase antes de mudanças estruturais:
//   - site_config (todos os textos/imagens editados pelo Elementor)
//   - materials (metadados de todos os materiais cadastrados)
//   - profiles (contas de usuário e papéis)
//   - lista completa dos arquivos no bucket "materiais" (nome/caminho/tamanho)
//
// Não baixa os arquivos binários dos PDFs (eles continuam intactos no Storage
// do Supabase, que não é afetado por mudanças no código) — apenas garante que
// temos uma cópia de tudo que é texto/metadado, caso algo precise ser restaurado.
//
// Uso:
//   node scripts/backup-site.mjs

import fs from "node:fs"
import path from "node:path"
import { createClient } from "@supabase/supabase-js"

function carregarEnvLocal() {
  const arquivo = path.join(process.cwd(), ".env.local")
  if (!fs.existsSync(arquivo)) return
  for (const linha of fs.readFileSync(arquivo, "utf-8").split("\n")) {
    const l = linha.trim()
    if (!l || l.startsWith("#")) continue
    const igual = l.indexOf("=")
    if (igual === -1) continue
    const chave = l.slice(0, igual).trim()
    const valor = l.slice(igual + 1).trim()
    if (!process.env[chave]) process.env[chave] = valor
  }
}

carregarEnvLocal()

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceRoleKey) {
  console.error("Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local antes de rodar este script.")
  process.exit(1)
}

const supabase = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } })

async function listarArquivosRecursivo(bucket, pasta = "") {
  const { data, error } = await supabase.storage.from(bucket).list(pasta, { limit: 1000 })
  if (error) {
    console.error(`Erro ao listar "${pasta}" no bucket ${bucket}:`, error.message)
    return []
  }

  let arquivos = []
  for (const item of data ?? []) {
    const caminho = pasta ? `${pasta}/${item.name}` : item.name
    // Pastas no Supabase Storage vêm sem "id" e sem metadata de tamanho.
    if (item.id === null && !item.metadata) {
      arquivos = arquivos.concat(await listarArquivosRecursivo(bucket, caminho))
    } else {
      arquivos.push({ caminho, tamanhoBytes: item.metadata?.size ?? null, atualizadoEm: item.updated_at ?? null })
    }
  }
  return arquivos
}

async function main() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const pastaBackup = path.join(process.cwd(), "backups", timestamp)
  fs.mkdirSync(pastaBackup, { recursive: true })

  console.log(`Criando backup em: ${pastaBackup}\n`)

  const [siteConfig, materials, profiles, arquivosStorage] = await Promise.all([
    supabase.from("site_config").select("*"),
    supabase.from("materials").select("*").order("created_at", { ascending: true }),
    supabase.from("profiles").select("*").order("created_at", { ascending: true }),
    listarArquivosRecursivo("materiais"),
  ])

  if (siteConfig.error) console.error("Erro ao ler site_config:", siteConfig.error.message)
  if (materials.error) console.error("Erro ao ler materials:", materials.error.message)
  if (profiles.error) console.error("Erro ao ler profiles:", profiles.error.message)

  fs.writeFileSync(path.join(pastaBackup, "site_config.json"), JSON.stringify(siteConfig.data ?? [], null, 2), "utf-8")
  fs.writeFileSync(path.join(pastaBackup, "materials.json"), JSON.stringify(materials.data ?? [], null, 2), "utf-8")
  fs.writeFileSync(path.join(pastaBackup, "profiles.json"), JSON.stringify(profiles.data ?? [], null, 2), "utf-8")
  fs.writeFileSync(
    path.join(pastaBackup, "storage_materiais_lista.json"),
    JSON.stringify(arquivosStorage, null, 2),
    "utf-8",
  )

  const resumo = {
    criadoEm: new Date().toISOString(),
    siteConfigLinhas: siteConfig.data?.length ?? 0,
    materiaisRegistros: materials.data?.length ?? 0,
    perfisUsuarios: profiles.data?.length ?? 0,
    arquivosNoStorage: arquivosStorage.length,
    tamanhoTotalStorageBytes: arquivosStorage.reduce((soma, a) => soma + (a.tamanhoBytes ?? 0), 0),
  }
  fs.writeFileSync(path.join(pastaBackup, "resumo.json"), JSON.stringify(resumo, null, 2), "utf-8")

  console.log("Backup concluído:")
  console.log(`  site_config: ${resumo.siteConfigLinhas} linha(s)`)
  console.log(`  materials:   ${resumo.materiaisRegistros} registro(s)`)
  console.log(`  profiles:    ${resumo.perfisUsuarios} usuário(s)`)
  console.log(`  storage:     ${resumo.arquivosNoStorage} arquivo(s), ${(resumo.tamanhoTotalStorageBytes / (1024 * 1024)).toFixed(1)} MB`)
  console.log(`\nArquivos salvos em: ${pastaBackup}`)
}

main()
