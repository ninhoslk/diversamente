import { cn } from "@/lib/utils"

/**
 * Selo discreto de parceria com a EcosBio, usado no card de Educação Ambiental.
 * Reconstruído em SVG (fundo transparente, sem imagem raster) a partir dos
 * elementos reais da marca — ícone de folha (Lucide "leaf") e verde
 * institucional (#27684A) extraídos diretamente de ecosbio.com.br — para ficar
 * nítido em qualquer tamanho e não pesar a página com um arquivo de imagem.
 */
export function EcosBioBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-[#27684A]/20 bg-white/90 px-2.5 py-1 shadow-sm backdrop-blur-sm dark:bg-black/70",
        className,
      )}
      title="Parceria com a EcosBio"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#27684A"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
      <span className="text-[10px] font-semibold leading-none text-[#1f4d38] dark:text-[#6fcf9e]">
        Ecos<span className="text-[#27684A] dark:text-[#8fe0b6]">Bio</span>
      </span>
    </span>
  )
}
