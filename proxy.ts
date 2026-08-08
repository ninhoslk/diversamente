import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return response
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value)
        }
        response = NextResponse.next({ request })
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options)
        }
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")

  if (isAdminRoute) {
    if (!user) {
      const loginUrl = new URL("/entrar", request.url)
      return NextResponse.redirect(loginUrl)
    }

    const { data: perfil } = await supabase.from("profiles").select("papel").eq("id", user.id).single()

    if (!perfil || perfil.papel !== "admin") {
      const homeUrl = new URL("/conteudos", request.url)
      return NextResponse.redirect(homeUrl)
    }
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*"],
}
