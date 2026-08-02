import Link from "next/link"
import { cn } from "@/lib/utils"

export function Logo({
  href = "/",
  className,
  size = "md",
}: {
  href?: string
  className?: string
  size?: "sm" | "md" | "lg"
}) {
  const tamanhos = {
    sm: "text-xl",
    md: "text-2xl sm:text-3xl",
    lg: "text-3xl sm:text-4xl",
  }

  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2.5 transition-opacity hover:opacity-90", className)}
      aria-label="Diversamente — página inicial"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-serif font-bold text-base shadow-sm">
        D
      </span>
      <span className={cn("font-serif font-bold tracking-tight text-foreground", tamanhos[size])}>
        Diversamente
      </span>
    </Link>
  )
}
