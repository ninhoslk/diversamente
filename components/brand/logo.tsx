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
    lg: "text-4xl sm:text-5xl",
  }

  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2 transition-opacity hover:opacity-80", className)}
      aria-label="Diversamente — página inicial"
    >
      <span
        className={cn(
          "font-display italic tracking-tight holo-text font-semibold leading-none pb-1",
          tamanhos[size],
        )}
      >
        Diversamente
      </span>
    </Link>
  )
}
