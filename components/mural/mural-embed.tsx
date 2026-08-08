"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function MuralEmbed() {
  const [carregando, setCarregando] = useState(true)

  return (
    <div className="glass-strong relative w-full overflow-hidden rounded-[1.75rem] border shadow-lg sm:rounded-[2.25rem]">
      {carregando ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#F4F4F4]">
          <Loader2 className="size-7 animate-spin text-primary" aria-hidden="true" />
          <p className="text-xs text-muted-foreground">Carregando o mural ao vivo...</p>
        </div>
      ) : null}

      <iframe
        src="https://padlet.com/embed/adzhhfkolro90huu"
        title="Mural Interativo Diversamente (Padlet)"
        frameBorder={0}
        allow="camera;microphone;geolocation;display-capture;clipboard-write"
        onLoad={() => setCarregando(false)}
        className={cn(
          "block w-full border-0 bg-[#F4F4F4] transition-opacity duration-500",
          // Mobile/tablet mantêm o tamanho original; só o desktop (lg+) fica maior.
          "h-[72vh] min-h-[420px] max-h-[560px] sm:h-[608px] sm:max-h-none lg:h-[780px]",
          carregando ? "opacity-0" : "opacity-100",
        )}
      />
    </div>
  )
}
