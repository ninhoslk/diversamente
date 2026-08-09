"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { AuthChangeEvent, Session } from "@supabase/supabase-js"
import type { Material } from "@/lib/catalog"
import { CONFIG_PADRAO_SITE, type SiteConfig } from "@/lib/site-config"
import { createClient } from "@/lib/supabase/client"
import { fetchSupabaseSiteConfig, saveSupabaseSiteConfig } from "@/lib/supabase"

export type Papel = "admin" | "professor" | "aluno" | "pai" | "visitante"

export type Usuario = {
  id: string
  nome: string
  email: string
  papel: Papel
  categoriaId?: string
  categoriaNome?: string
}

export type ContaUsuario = Usuario & { criadoEm?: string }

type AppContextValue = {
  usuario: Usuario | null
  carregando: boolean
  entrar: (email: string, senha: string) => Promise<{ ok: boolean; erro?: string }>
  sair: () => Promise<void>
  usuarios: ContaUsuario[]
  carregarUsuarios: () => Promise<void>
  cadastrarUsuarioPeloAdmin: (novo: {
    nome: string
    email: string
    senha: string
    papel: Papel
    categoriaId?: string
    categoriaNome?: string
  }) => Promise<{ ok: boolean; erro?: string }>
  removerUsuarioPeloAdmin: (id: string) => Promise<{ ok: boolean; erro?: string }>
  materiais: Material[]
  carregandoMateriais: boolean
  erroMateriais: string | null
  recarregarMateriais: () => Promise<void>
  removerMaterial: (id: string) => Promise<{ ok: boolean; erro?: string }>
  atualizarMaterial: (
    id: string,
    dados: { titulo: string; descricao: string; trilha: string; categoria: string; publico: string; url?: string },
  ) => Promise<{ ok: boolean; erro?: string }>
  siteConfig: SiteConfig
  atualizarSiteConfig: (novaConfig: SiteConfig) => void
  restaurarSiteConfig: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

const CHAVE_SITE_CONFIG = "diversamente:site-config"

function linhaParaMaterial(row: Record<string, unknown>): Material {
  return {
    id: row.id as string,
    titulo: row.titulo as string,
    descricao: (row.descricao as string) ?? "",
    tipo: row.tipo as Material["tipo"],
    url: (row.url as string) ?? "",
    storagePath: (row.storage_path as string | null) ?? null,
    trilha: row.trilha as string,
    categoria: row.categoria as string,
    publico: row.publico as Material["publico"],
    criadoEm: ((row.created_at as string) ?? new Date().toISOString()).slice(0, 10),
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), [])

  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [usuarios, setUsuarios] = useState<ContaUsuario[]>([])
  const [materiais, setMateriais] = useState<Material[]>([])
  const [carregandoMateriais, setCarregandoMateriais] = useState(true)
  const [erroMateriais, setErroMateriais] = useState<string | null>(null)
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(CONFIG_PADRAO_SITE)

  const carregarPerfil = useCallback(
    async (userId: string, email: string | undefined) => {
      const { data: perfil, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) {
        // Erro de rede/timeout: não derruba a sessão existente por uma falha transitória
        // (o usuário continua autenticado no Supabase; só não conseguimos o perfil agora).
        // "PGRST116" = nenhuma linha encontrada — aí sim não há perfil e a sessão é inválida.
        if (error.code === "PGRST116") setUsuario(null)
        return
      }
      if (!perfil) {
        setUsuario(null)
        return
      }

      setUsuario({
        id: userId,
        nome: perfil.nome,
        email: perfil.email ?? email ?? "",
        papel: perfil.papel,
        categoriaId: perfil.categoria_id ?? undefined,
        categoriaNome: perfil.categoria_nome ?? undefined,
      })
    },
    [supabase],
  )

  const recarregarMateriais = useCallback(async () => {
    setCarregandoMateriais(true)
    const { data, error } = await supabase.from("materials").select("*").order("created_at", { ascending: false })
    if (!error && data) {
      setMateriais(data.map(linhaParaMaterial))
      setErroMateriais(null)
    } else {
      // Não zera a lista anterior numa falha transitória — evita mostrar
      // "biblioteca vazia" quando na verdade a consulta falhou.
      setErroMateriais("Não foi possível carregar os materiais agora. Tente novamente em instantes.")
    }
    setCarregandoMateriais(false)
  }, [supabase])

  useEffect(() => {
    let ativo = true

    async function iniciar() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        await carregarPerfil(session.user.id, session.user.email)
      }

      const configSupabase = await fetchSupabaseSiteConfig()
      if (configSupabase && configSupabase.home) {
        setSiteConfig(configSupabase)
      } else {
        try {
          const salvo = localStorage.getItem(CHAVE_SITE_CONFIG)
          if (salvo) setSiteConfig(JSON.parse(salvo))
        } catch {}
      }

      if (ativo) setCarregando(false)
    }

    iniciar()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((evento: AuthChangeEvent, session: Session | null) => {
      // INITIAL_SESSION já foi tratado por iniciar() acima (getSession + carregarPerfil).
      // Sem este guard, o perfil era buscado duas vezes a cada carregamento da página.
      if (evento === "INITIAL_SESSION") return

      if (session?.user) {
        carregarPerfil(session.user.id, session.user.email)
      } else {
        setUsuario(null)
      }
    })

    return () => {
      ativo = false
      subscription.unsubscribe()
    }
  }, [supabase, carregarPerfil])

  // Assina mudanças na aparência do site (Elementor). A leitura é pública, então
  // esta assinatura roda para todo mundo — visitante ou logado — e não depende
  // de "usuario", garantindo que edições do admin apareçam em tempo real para
  // qualquer pessoa com o site aberto, sem precisar recarregar a página.
  useEffect(() => {
    const canal = supabase
      .channel("site_config_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_config" }, async () => {
        const configAtualizada = await fetchSupabaseSiteConfig()
        if (configAtualizada && configAtualizada.home) {
          setSiteConfig(configAtualizada)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(canal)
    }
  }, [supabase])

  // Carrega materiais assim que há um usuário logado (RLS exige autenticação) e assina mudanças em tempo real.
  useEffect(() => {
    if (!usuario) {
      setMateriais([])
      setErroMateriais(null)
      setCarregandoMateriais(false)
      return
    }

    recarregarMateriais()

    const canal = supabase
      .channel("materials_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "materials" }, () => {
        recarregarMateriais()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(canal)
    }
  }, [usuario, supabase, recarregarMateriais])

  // Carrega a lista de usuários apenas quando o logado é admin (a rota já exige isso no servidor).
  useEffect(() => {
    if (usuario?.papel === "admin") {
      carregarUsuarios()
    } else {
      setUsuarios([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario?.papel])

  const entrar = useCallback(
    async (email: string, senha: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha })
      if (error || !data.user) {
        return { ok: false, erro: "E-mail ou senha incorretos." }
      }
      await carregarPerfil(data.user.id, data.user.email)
      return { ok: true }
    },
    [supabase, carregarPerfil],
  )

  const sair = useCallback(async () => {
    await supabase.auth.signOut()
    setUsuario(null)
  }, [supabase])

  const carregarUsuarios = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/usuarios")
      if (!res.ok) return
      const data = await res.json()
      setUsuarios(data.usuarios ?? [])
    } catch {
      // ignora
    }
  }, [])

  const cadastrarUsuarioPeloAdmin = useCallback(
    async (novo: { nome: string; email: string; senha: string; papel: Papel; categoriaId?: string; categoriaNome?: string }) => {
      try {
        const res = await fetch("/api/admin/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(novo),
        })
        const data = await res.json()
        if (!res.ok) return { ok: false, erro: data.erro ?? "Erro ao cadastrar usuário." }
        await carregarUsuarios()
        return { ok: true }
      } catch {
        return { ok: false, erro: "Erro de conexão ao cadastrar usuário." }
      }
    },
    [carregarUsuarios],
  )

  const removerUsuarioPeloAdmin = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/admin/usuarios/${id}`, { method: "DELETE" })
        const data = await res.json()
        if (!res.ok) return { ok: false, erro: data.erro ?? "Erro ao remover usuário." }
        await carregarUsuarios()
        return { ok: true }
      } catch {
        return { ok: false, erro: "Erro de conexão ao remover usuário." }
      }
    },
    [carregarUsuarios],
  )

  const removerMaterial = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/materiais/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) return { ok: false, erro: data.erro ?? "Erro ao remover material." }
      return { ok: true }
    } catch {
      return { ok: false, erro: "Erro de conexão ao remover material." }
    }
  }, [])

  const atualizarMaterial = useCallback(
    async (
      id: string,
      dados: { titulo: string; descricao: string; trilha: string; categoria: string; publico: string; url?: string },
    ) => {
      try {
        const res = await fetch(`/api/materiais/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        })
        const data = await res.json()
        if (!res.ok || !data.ok) return { ok: false, erro: data.erro ?? "Erro ao atualizar material." }
        return { ok: true }
      } catch {
        return { ok: false, erro: "Erro de conexão ao atualizar material." }
      }
    },
    [],
  )

  const atualizarSiteConfig = useCallback((novaConfig: SiteConfig) => {
    setSiteConfig(novaConfig)
    saveSupabaseSiteConfig(novaConfig).catch(() => {})
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
      carregarUsuarios,
      cadastrarUsuarioPeloAdmin,
      removerUsuarioPeloAdmin,
      materiais,
      carregandoMateriais,
      erroMateriais,
      recarregarMateriais,
      removerMaterial,
      atualizarMaterial,
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
      carregarUsuarios,
      cadastrarUsuarioPeloAdmin,
      removerUsuarioPeloAdmin,
      materiais,
      carregandoMateriais,
      erroMateriais,
      recarregarMateriais,
      removerMaterial,
      atualizarMaterial,
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
