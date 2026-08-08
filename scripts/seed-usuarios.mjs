// Script de configuração inicial: cria as 4 contas de demonstração como
// usuários REAIS do Supabase Auth (substituindo as senhas em texto puro que
// existiam antes no código-fonte). Rode uma única vez após colar o schema.sql
// no Editor SQL do Supabase e preencher SUPABASE_SERVICE_ROLE_KEY no .env.local.
//
// Uso:
//   node scripts/seed-usuarios.mjs
//
// Troque as senhas de demonstração assim que possível pelo painel
// /admin/usuarios (ou pelo painel do Supabase) antes de usar em produção.

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

const CONTAS = [
  {
    nome: "Administração",
    email: "admin@diversamente.com",
    senha: "TrocarSenha!admin123",
    papel: "admin",
    categoria_id: "todas",
    categoria_nome: "Todas as salas / anos",
  },
  {
    nome: "Prof. Mariana Costa",
    email: "prof@diversamente.com",
    senha: "TrocarSenha!prof123",
    papel: "professor",
    categoria_id: "todas",
    categoria_nome: "Todas as salas / anos",
  },
  {
    nome: "Lucas Silva (Estudante)",
    email: "aluno@diversamente.com",
    senha: "TrocarSenha!aluno123",
    papel: "aluno",
    categoria_id: "fundamental-1",
    categoria_nome: "Ensino Fundamental I",
  },
  {
    nome: "Roberto Silva (Família)",
    email: "pai@diversamente.com",
    senha: "TrocarSenha!pai123",
    papel: "pai",
    categoria_id: "fundamental-1",
    categoria_nome: "Ensino Fundamental I",
  },
]

for (const conta of CONTAS) {
  const { data: criado, error: erroCriacao } = await supabase.auth.admin.createUser({
    email: conta.email,
    password: conta.senha,
    email_confirm: true,
    user_metadata: { nome: conta.nome },
  })

  let userId = criado?.user?.id

  if (erroCriacao) {
    if (erroCriacao.message?.toLowerCase().includes("already")) {
      const { data: lista } = await supabase.auth.admin.listUsers()
      userId = lista?.users.find((u) => u.email === conta.email)?.id
      console.log(`Já existia: ${conta.email}`)
    } else {
      console.error(`Erro ao criar ${conta.email}:`, erroCriacao.message)
      continue
    }
  } else {
    console.log(`Criado: ${conta.email} (senha provisória: ${conta.senha})`)
  }

  if (!userId) continue

  const { error: erroPerfil } = await supabase.from("profiles").upsert({
    id: userId,
    nome: conta.nome,
    email: conta.email,
    papel: conta.papel,
    categoria_id: conta.categoria_id,
    categoria_nome: conta.categoria_nome,
  })

  if (erroPerfil) {
    console.error(`Erro ao salvar perfil de ${conta.email}:`, erroPerfil.message)
  }
}

console.log("\nConcluído. Troque as senhas provisórias pelo painel /admin/usuarios assim que possível.")
