import Link from "next/link"
import { ChevronRight } from "lucide-react"

export type Migalha = { label: string; href?: string }

export function Breadcrumbs({ itens }: { itens: Migalha[] }) {
  return (
    <nav aria-label="Você está aqui" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {itens.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-1">
            {item.href ? (
              <Link href={item.href} className="rounded-md px-1 transition-colors hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className="px-1 font-medium text-foreground" aria-current="page">
                {item.label}
              </span>
            )}
            {i < itens.length - 1 ? <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" /> : null}
          </li>
        ))}
      </ol>
    </nav>
  )
}
