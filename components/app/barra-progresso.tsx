import { cn } from "@/lib/utils"

/** Barra de progresso simples (0–100). */
export function BarraProgresso({ valor, rotulo, className }: { valor: number; rotulo: string; className?: string }) {
  const v = Math.max(0, Math.min(100, valor))
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
      aria-label={rotulo}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-primary/10", className)}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-500", v === 100 ? "bg-emerald-500" : "bg-primary")}
        style={{ width: `${v}%` }}
      />
    </div>
  )
}
