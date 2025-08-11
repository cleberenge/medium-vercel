"use client"

import { useEffect } from "react"
import Script from "next/script"
import { cn } from "@/lib/utils"

type AdSlotProps = {
  adClient?: string
  adSlot?: string
  layout?: "in-article" | "in-feed" | "display"
  className?: string
  width?: number
  height?: number
}

/**
 * Componente de placeholder para Google AdSense.
 * - Mantém espaço reservado (evita CLS).
 * - Só injeta o script se adClient for fornecido.
 * - Preencha adClient (ca-pub-XXXX) e adSlot para ativar.
 */
export default function AdSlot({
  adClient = "",
  adSlot = "",
  layout = "display",
  className,
  width = 728,
  height = 90,
}: AdSlotProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).adsbygoogle && adClient && adSlot) {
      ;(window as any).adsbygoogle.push({})
    }
  }, [adClient, adSlot])

  const isActive = Boolean(adClient && adSlot)

  return (
    <div
      className={cn("w-full border rounded-md bg-muted/20 flex items-center justify-center", className)}
      style={{
        minHeight: layout === "in-article" ? 250 : height,
      }}
      aria-label="Espaço publicitário"
    >
      {!isActive ? (
        <div className="text-sm text-muted-foreground p-4 text-center">
          Espaço para anúncio (configure seu AdSense para ativar)
        </div>
      ) : (
        <>
          <Script
            id="adsbygoogle-lib"
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            async
            strategy="afterInteractive"
          />
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%" }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            data-ad-format={layout === "display" ? "auto" : layout}
            data-full-width-responsive="true"
          />
        </>
      )}
    </div>
  )
}
