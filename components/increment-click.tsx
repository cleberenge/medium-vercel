"use client"

import { useEffect } from "react"

type IncrementClickProps = {
  slug: string
  oncePerSession?: boolean
}

function keyClicks(slug: string) {
  return `postClicks:${slug}`
}
function keySession(slug: string) {
  return `postClickedSession:${slug}`
}

/**
 * Incrementa o contador de cliques/visualizações do post.
 * - Padrão: incrementa uma vez por sessão para evitar inflar números em refresh.
 */
export default function IncrementClick({ slug, oncePerSession = true }: IncrementClickProps) {
  useEffect(() => {
    try {
      if (oncePerSession) {
        const seen = sessionStorage.getItem(keySession(slug))
        if (seen) return
        sessionStorage.setItem(keySession(slug), "1")
      }
      const current = Number(localStorage.getItem(keyClicks(slug)) || "0")
      localStorage.setItem(keyClicks(slug), String(current + 1))
    } catch {
      // ignore
    }
  }, [slug, oncePerSession])

  return null
}
