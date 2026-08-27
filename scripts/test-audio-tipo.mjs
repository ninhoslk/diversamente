// Teste end-to-end do novo tipo de material "audio" (Educação Infantil e
// Ensino Fundamental I). Cria usuários e materiais TEMPORÁRIOS via service
// role, faz login real como cada usuário (sessão autenticada de verdade,
// sujeita a RLS), consulta a tabela materials, confere que cada um só vê o
// áudio do próprio ano e no final APAGA tudo que criou.
//
// Uso:
//   node scripts/test-audio-tipo.mjs

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
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !anonKey || !serviceRoleKey) {
  console.error("Defina NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY no .env.local.")
  process.exit(1)
}

const admin = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } })

const SENHA_TESTE = "TesteTemporario!2026audio"
const SUFIXO = Date.now()
const USUARIOS = [
  { chave: "1ano", email: `teste-audio-1ano-${SUFIXO}@teste-temporario.invalid`, categoria_id: "1-ano" },
  { chave: "3ano", email: `teste-audio-3ano-${SUFIXO}@teste-temporario.invalid`, categoria_id: "3-ano" },
]

let falhas = 0
const idsUsuariosCriados = []
const idsMateriaisCriados = []

function checar(condicao, descricao) {
  console.log(`${condicao ? "PASS" : "FAIL"} — ${descricao}`)
  if (!condicao) falhas++
}

async function main() {
  console.log("1. Criando usuários de teste temporários (Fundamental I)...")
  for (const u of USUARIOS) {
    const { data: criado, error } = await admin.auth.admin.createUser({
      email: u.email,
      password: SENHA_TESTE,
      email_confirm: true,
      user_metadata: { nome: `Teste Áudio ${u.chave}` },
    })
    if (error || !criado?.user) throw new Error(`Falha ao criar usuário ${u.email}: ${error?.message}`)
    idsUsuariosCriados.push(criado.user.id)

    const { error: erroPerfil } = await admin.from("profiles").upsert({
      id: criado.user.id,
      nome: `Teste Áudio ${u.chave}`,
      email: u.email,
      papel: "aluno",
      categoria_id: u.categoria_id,
      categoria_nome: `Teste — ${u.categoria_id}`,
    })
    if (erroPerfil) throw new Error(`Falha ao salvar perfil de ${u.email}: ${erroPerfil.message}`)
  }
  console.log("   OK\n")

  console.log("2. Criando materiais de teste do tipo 'audio' (1º ano e 3º ano)...")
  const materiaisParaCriar = [
    {
      titulo: `[TESTE AUDIO ${SUFIXO}] Áudio exclusivo do 1º ano`,
      descricao: "Material temporário de teste — apagar automaticamente.",
      tipo: "audio",
      url: "https://example.com/teste-audio-1ano.mp3",
      storage_path: null,
      trilha: "fundamental-1",
      categoria: "1-ano",
      publico: "aluno",
    },
    {
      titulo: `[TESTE AUDIO ${SUFIXO}] Áudio exclusivo do 3º ano`,
      descricao: "Material temporário de teste — apagar automaticamente.",
      tipo: "audio",
      url: "https://example.com/teste-audio-3ano.mp3",
      storage_path: null,
      trilha: "fundamental-1",
      categoria: "3-ano",
      publico: "aluno",
    },
  ]
  const { data: materiaisCriados, error: erroMateriais } = await admin.from("materials").insert(materiaisParaCriar).select()
  if (erroMateriais) throw new Error(`Falha ao criar materiais de teste: ${erroMateriais.message}`)
  for (const m of materiaisCriados) idsMateriaisCriados.push(m.id)
  const [audio1ano, audio3ano] = materiaisCriados
  console.log("   OK\n")

  console.log("3. Fazendo login real como cada usuário e consultando materials (via RLS)...\n")
  for (const u of USUARIOS) {
    const clienteUsuario = createClient(url, anonKey, { auth: { autoRefreshToken: false, persistSession: false } })
    const { data: login, error: erroLogin } = await clienteUsuario.auth.signInWithPassword({
      email: u.email,
      password: SENHA_TESTE,
    })
    if (erroLogin || !login.session) throw new Error(`Falha no login de ${u.email}: ${erroLogin?.message}`)

    const { data: materiaisVisiveis, error: erroConsulta } = await clienteUsuario
      .from("materials")
      .select("id, titulo, categoria, tipo")
      .in("id", idsMateriaisCriados)

    if (erroConsulta) throw new Error(`Falha ao consultar materials como ${u.email}: ${erroConsulta.message}`)

    const veAudio1ano = materiaisVisiveis.some((m) => m.id === audio1ano.id)
    const veAudio3ano = materiaisVisiveis.some((m) => m.id === audio3ano.id)

    console.log(`--- Usuário "${u.chave}" (categoria_id="${u.categoria_id}") vê ${materiaisVisiveis.length} dos 2 áudios de teste:`)
    materiaisVisiveis.forEach((m) => console.log(`     - ${m.categoria} [${m.tipo}]: ${m.titulo}`))

    if (u.chave === "1ano") {
      checar(veAudio1ano, "Usuário do 1º ano VÊ o áudio exclusivo do 1º ano")
      checar(!veAudio3ano, "Usuário do 1º ano NÃO VÊ o áudio exclusivo do 3º ano")
    }
    if (u.chave === "3ano") {
      checar(!veAudio1ano, "Usuário do 3º ano NÃO VÊ o áudio exclusivo do 1º ano (vice-versa)")
      checar(veAudio3ano, "Usuário do 3º ano VÊ o áudio exclusivo do 3º ano")
    }
    console.log("")

    await clienteUsuario.auth.signOut()
  }
}

async function limpar() {
  console.log("4. Limpando dados de teste...")
  if (idsMateriaisCriados.length) {
    const { error } = await admin.from("materials").delete().in("id", idsMateriaisCriados)
    if (error) console.error("   Aviso: falha ao apagar materiais de teste:", error.message)
    else console.log(`   ${idsMateriaisCriados.length} material(is) de teste removido(s).`)
  }
  for (const id of idsUsuariosCriados) {
    const { error } = await admin.auth.admin.deleteUser(id)
    if (error) console.error(`   Aviso: falha ao apagar usuário de teste ${id}:`, error.message)
  }
  console.log(`   ${idsUsuariosCriados.length} usuário(s) de teste removido(s).`)
}

try {
  await main()
} catch (e) {
  console.error("\nErro durante o teste:", e.message)
  falhas++
} finally {
  await limpar()
}

console.log(`\n${falhas === 0 ? "TODOS OS TESTES PASSARAM." : `${falhas} verificação(ões) falharam.`}`)
process.exit(falhas === 0 ? 0 : 1)
