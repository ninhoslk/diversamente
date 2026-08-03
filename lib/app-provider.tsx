"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { MATERIAIS_INICIAIS, type Material } from "@/lib/catalog"
import { CONFIG_PADRAO_SITE, type SiteConfig } from "@/lib/site-config"
import {
  fetchSupabaseMateriais,
  fetchSupabaseSiteConfig,
  inscreverSupabaseRealtime,
  saveSupabaseMateriais,
  saveSupabaseSiteConfig,
} from "@/lib/supabase"

export type Papel = "admin" | "professor" | "aluno" | "pai" | "visitante"

export type Usuario = {
  id: string
  nome: string
  email: string
  papel: Papel
  categoriaId?: string // ex: "fundamental-1", "educacao-infantil", "1-ano", "todas"
  categoriaNome?: string
}

export type ContaDemo = Usuario & { senha: string }

export const CONTAS_INICIAIS: ContaDemo[] = [
  { id: "u1", nome: "Administração", email: "admin@diversamente.com", senha: "admin123", papel: "admin", categoriaId: "todas", categoriaNome: "Todas as salas / anos" },
  { id: "u2", nome: "Prof. Mariana Costa", email: "prof@diversamente.com", senha: "prof123", papel: "professor", categoriaId: "todas", categoriaNome: "Todas as salas / anos" },
  { id: "u3", nome: "Lucas Silva (Estudante)", email: "aluno@diversamente.com", senha: "aluno123", papel: "aluno", categoriaId: "fundamental-1", categoriaNome: "Ensino Fundamental I" },
  { id: "u4", nome: "Roberto Silva (Família)", email: "pai@diversamente.com", senha: "pai123", papel: "pai", categoriaId: "fundamental-1", categoriaNome: "Ensino Fundamental I" },
]

type AppContextValue = {
  usuario: Usuario | null
  carregando: boolean
  entrar: (email: string, senha: string) => { ok: boolean; erro?: string }
  sair: () => void
  usuarios: ContaDemo[]
  cadastrarUsuarioPeloAdmin: (novo: Omit<ContaDemo, "id">) => { ok: boolean; erro?: string }
  removerUsuarioPeloAdmin: (id: string) => void
  materiais: Material[]
  adicionarMaterial: (material: Omit<Material, "id" | "criadoEm">) => void
  removerMaterial: (id: string) => void
  siteConfig: SiteConfig
  atualizarSiteConfig: (novaConfig: SiteConfig) => void
  restaurarSiteConfig: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

const CHAVE_SESSAO = "diversamente:sessao"
const CHAVE_USUARIOS = "diversamente:usuarios"
const CHAVE_SITE_CONFIG = "diversamente:site-config"
const CHAVE_MATERIAIS = "diversamente:materiais"

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [usuarios, setUsuarios] = useState<ContaDemo[]>(CONTAS_INICIAIS)
  const [materiais, setMateriais] = useState<Material[]>(MATERIAIS_INICIAIS)
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(CONFIG_PADRAO_SITE)

  useEffect(() => {
    try {
      const sessaoSalva = sessionStorage.getItem(CHAVE_SESSAO)
      if (sessaoSalva) setUsuario(JSON.parse(sessaoSalva) as Usuario)

      const usuariosSalvos = localStorage.getItem(CHAVE_USUARIOS)
      if (usuariosSalvos) setUsuarios(JSON.parse(usuariosSalvos))

      const materiaisSalvos = localStorage.getItem(CHAVE_MATERIAIS)
      if (materiaisSalvos) {
        const parsed = JSON.parse(materiaisSalvos)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMateriais(parsed)
        }
      }
    } catch {
      // ignora erros de parsing em ambiente de dev
    }

    async function carregarDadosGlobais() {
      // 1. Carrega configuracoes do layout (Elementor) do Supabase DB
      const configSupabase = await fetchSupabaseSiteConfig()
      if (configSupabase && configSupabase.home) {
        setSiteConfig(configSupabase)
      } else {
        try {
          const res = await fetch("/api/site-config")
          const data = await res.json()
          if (data && typeof data === "object" && data.home) {
            setSiteConfig(data)
          }
        } catch {}
      }

      // 2. Carrega materiais globais (PDFs, videos, jogos) do Supabase DB
      const materiaisSupabase = await fetchSupabaseMateriais()
      if (materiaisSupabase && Array.isArray(materiaisSupabase) && materiaisSupabase.length > 0) {
        setMateriais(materiaisSupabase)
      }

      setCarregando(false)
    }

    carregarDadosGlobais()

    // 3. Inscreve no Supabase Realtime para sincronizar alteracoes instantaneamente
    const cancelarRealtime = inscreverSupabaseRealtime(
      (novaConfig) => setSiteConfig(novaConfig),
      (novosMateriais) => {
        if (Array.isArray(novosMateriais) && novosMateriais.length > 0) {
          setMateriais(novosMateriais)
        }
      }
    )

    return () => {
      cancelarRealtime()
    }
  }, [])

  const persistirSessao = useCallback((u: Usuario | null) => {
    setUsuario(u)
    try {
      if (u) sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(u))
      else sessionStorage.removeItem(CHAVE_SESSAO)
    } catch {
      // ignora
    }
  }, [])

  const entrar = useCallback(
    (email: string, senha: string) => {
      const conta = usuarios.find((c) => c.email.toLowerCase() === email.trim().toLowerCase())
      if (!conta || conta.senha !== senha) {
        return { ok: false, erro: "E-mail ou senha incorretos." }
      }
      const userSemSenha: Usuario = {
        id: conta.id,
        nome: conta.nome,
        email: conta.email,
        papel: conta.papel,
        categoriaId: conta.categoriaId,
        categoriaNome: conta.categoriaNome,
      }
      persistirSessao(userSemSenha)
      return { ok: true }
    },
    [usuarios, persistirSessao],
  )

  const sair = useCallback(() => persistirSessao(null), [persistirSessao])

  const cadastrarUsuarioPeloAdmin = useCallback(
    (novo: Omit<ContaDemo, "id">) => {
      if (usuarios.some((c) => c.email.toLowerCase() === novo.email.trim().toLowerCase())) {
        return { ok: false, erro: "Este e-mail já está cadastrado na plataforma." }
      }
      const novaConta: ContaDemo = {
        ...novo,
        id: `u${Date.now()}`,
        email: novo.email.trim(),
      }
      const listaAtualizada = [...usuarios, novaConta]
      setUsuarios(listaAtualizada)
      try {
        localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(listaAtualizada))
      } catch {
        // ignora
      }
      return { ok: true }
    },
    [usuarios],
  )

  const removerUsuarioPeloAdmin = useCallback(
    (id: string) => {
      const listaAtualizada = usuarios.filter((u) => u.id !== id)
      setUsuarios(listaAtualizada)
      try {
        localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(listaAtualizada))
      } catch {
        // ignora
      }
    },
    [usuarios],
  )

  const adicionarMaterial = useCallback((material: Omit<Material, "id" | "criadoEm">) => {
    setMateriais((anteriores) => {
      const novaLista = [
        {
          ...material,
          id: `m${Date.now()}`,
          criadoEm: new Date().toISOString().slice(0, 10),
        },
        ...anteriores,
      ]
      saveSupabaseMateriais(novaLista).catch(() => {})
      try {
        localStorage.setItem(CHAVE_MATERIAIS, JSON.stringify(novaLista))
      } catch {}
      return novaLista
    })
  }, [])

  const removerMaterial = useCallback((id: string) => {
    setMateriais((anteriores) => {
      const filtrada = anteriores.filter((m) => m.id !== id)
      // Se apagar tudo, mantém pelo menos a lista de backup dos materiais de catálogo
      const novaLista = filtrada.length > 0 ? filtrada : MATERIAIS_INICIAIS
      saveSupabaseMateriais(novaLista).catch(() => {})
      try {
        localStorage.setItem(CHAVE_MATERIAIS, JSON.stringify(novaLista))
      } catch {}
      return novaLista
    })
  }, [])

  const atualizarSiteConfig = useCallback((novaConfig: SiteConfig) => {
    setSiteConfig(novaConfig)
    
    saveSupabaseSiteConfig(novaConfig).catch(() => {})

    fetch("/api/site-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaConfig),
    }).catch(() => {})

    try {
      localStorage.setItem(CHAVE_SITE_CONFIG, JSON.stringify(novaConfig))
    } catch {
      // ignora
    }
  }, [])

  const restaurarSiteConfig = useCallback(() => {
    setSiteConfig(CONFIG_PADRAO_SITE)
    try {
      localStorage.removeItem(CHAVE_SITE_CONFIG)
    } catch {
      // ignora
    }
  }, [])

  const valor = useMemo<AppContextValue>(
    () => ({
      usuario,
      carregando,
      entrar,
      sair,
      usuarios,
      cadastrarUsuarioPeloAdmin,
      removerUsuarioPeloAdmin,
      materiais,
      adicionarMaterial,
      removerMaterial,
      siteConfig,
      atualizarSiteConfig,
      restaurarSiteConfig,
    }),
    [
      usuario,
      carregando,
      entrar,
      sair,
      usuarios,
      cadastrarUsuarioPeloAdmin,
      removerUsuarioPeloAdmin,
      materiais,
      adicionarMaterial,
      removerMaterial,
      siteConfig,
      atualizarSiteConfig,
      restaurarSiteConfig,
    ],
  )

  return <AppContext.Provider value={valor}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp precisa estar dentro de AppProvider")
  return ctx
}
