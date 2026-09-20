import { Construction } from "lucide-react"
import { cn } from "@/lib/utils"

/** Selo de aviso para trilhas ainda em desenvolvimento (ex.: Educação Infantil Regular). */
export function EmConstrucaoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-50/95 px-2.5 py-1 text-[11px] font-semibold leading-none text-amber-800 shadow-sm backdrop-blur-sm dark:bg-black/70 dark:text-amber-300",
        className,
      )}
    >
      <Construction className="size-3" aria-hidden="true" />
      Em construção
    </span>
  )
}
