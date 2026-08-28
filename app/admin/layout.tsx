import type { Metadata } from "next"
import { AppHeader } from "@/components/app/app-header"
import { RouteGuard } from "@/components/auth/route-guard"

// Painel administrativo — não deve ser indexado por buscadores
// (ver também app/robots.ts, que já bloqueia o rastreamento deste caminho).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard somenteAdmin>
      <div className="holo-surface min-h-screen">
        <AppHeader />
        <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">{children}</main>
      </div>
    </RouteGuard>
  )
}
