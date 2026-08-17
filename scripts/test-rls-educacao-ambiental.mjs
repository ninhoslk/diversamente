// Teste end-to-end (ponta a ponta) da restrição de acesso por ano na trilha
// Educação Ambiental. Cria usuários e materiais TEMPORÁRIOS via service role,
// faz login real como cada usuário (sessão autenticada de verdade, sujeita a
// RLS), consulta a tabela materials, confere o resultado e no final APAGA
// tudo que criou — não deixa nenhum dado de teste para trás.
//
// Uso:
//   node scripts/test-rls-educacao-ambiental.mjs

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

const SENHA_TESTE = "TesteTemporario!2026xyz"
const SUFIXO = Date.now()
const USUARIOS = [
  { chave: "amb2", email: `teste-rls-amb2-${SUFIXO}@teste-temporario.invalid`, categoria_id: "amb-2-ano" },
  { chave: "amb3", email: `teste-rls-amb3-${SUFIXO}@teste-temporario.invalid`, categoria_id: "amb-3-ano" },
]

let falhas = 0
const idsUsuariosCriados = []
const idsMateriaisCriados = []

function checar(condicao, descricao) {
  console.log(`${condicao ? "PASS" : "FAIL"} — ${descricao}`)
  if (!condicao) falhas++
}

async function main() {
  console.log("1. Criando usuários de teste temporários...")
  const sessoes = {}
  for (const u of USUARIOS) {
    const { data: criado, error } = await admin.auth.admin.createUser({
      email: u.email,
      password: SENHA_TESTE,
      email_confirm: true,
      user_metadata: { nome: `Teste RLS ${u.chave}` },
    })
    if (error || !criado?.user) throw new Error(`Falha ao criar usuário ${u.email}: ${error?.message}`)
    idsUsuariosCriados.push(criado.user.id)

    const { error: erroPerfil } = await admin.from("profiles").upsert({
      id: criado.user.id,
      nome: `Teste RLS ${u.chave}`,
      email: u.email,
      papel: "aluno",
      categoria_id: u.categoria_id,
      categoria_nome: `Teste — ${u.categoria_id}`,
    })
    if (erroPerfil) throw new Error(`Falha ao salvar perfil de ${u.email}: ${erroPerfil.message}`)
  }
  console.log("   OK\n")

  console.log("2. Criando materiais de teste temporários (Ed. Ambiental)...")
  const materiaisParaCriar = [
    {
      titulo: `[TESTE RLS ${SUFIXO}] Manual exclusivo do 2º ano`,
      descricao: "Material temporário de teste — apagar automaticamente.",
      tipo: "manual",
      url: "https://example.com/teste-manual-2ano.pdf",
      storage_path: null,
      trilha: "educacao-ambiental",
      categoria: "amb-2-ano",
      publico: "aluno",
    },
    {
      titulo: `[TESTE RLS ${SUFIXO}] Manual para todos os anos`,
      descricao: "Material temporário de teste — apagar automaticamente.",
      tipo: "manual",
      url: "https://example.com/teste-manual-todos.pdf",
      storage_path: null,
      trilha: "educacao-ambiental",
      categoria: "amb-todos-anos",
      publico: "aluno",
    },
  ]
  const { data: materiaisCriados, error: erroMateriais } = await admin.from("materials").insert(materiaisParaCriar).select()
  if (erroMateriais) throw new Error(`Falha ao criar materiais de teste: ${erroMateriais.message}`)
  for (const m of materiaisCriados) idsMateriaisCriados.push(m.id)
  const [materialAno2, materialTodos] = materiaisCriados
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
      .select("id, titulo, categoria")
      .in("id", idsMateriaisCriados)

    if (erroConsulta) throw new Error(`Falha ao consultar materials como ${u.email}: ${erroConsulta.message}`)

    const veApenasSeuAno = materiaisVisiveis.some((m) => m.id === materialAno2.id)
    const veTodos = materiaisVisiveis.some((m) => m.id === materialTodos.id)

    console.log(`--- Usuário "${u.chave}" (categoria_id="${u.categoria_id}") vê ${materiaisVisiveis.length} dos 2 materiais de teste:`)
    materiaisVisiveis.forEach((m) => console.log(`     - ${m.categoria}: ${m.titulo}`))

    if (u.chave === "amb2") {
      checar(veApenasSeuAno, 'Usuário do 2º ano VÊ o material exclusivo do 2º ano')
      checar(veTodos, 'Usuário do 2º ano VÊ o material de "todos os anos" — depende do schema.sql atualizado estar aplicado no Supabase')
    }
    if (u.chave === "amb3") {
      checar(!veApenasSeuAno, 'Usuário do 3º ano NÃO VÊ o material exclusivo do 2º ano (vice-versa)')
      checar(veTodos, 'Usuário do 3º ano também VÊ o material de "todos os anos" — depende do schema.sql atualizado estar aplicado no Supabase')
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
