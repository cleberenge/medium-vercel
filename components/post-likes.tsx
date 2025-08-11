"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

type PostLikesProps = {
  slug: string
  className?: string
}

function getKey(slug: string) {
  return `postClicks:${slug}`
}

export default function PostLikes({ slug, className }: PostLikesProps) {
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(getKey(slug))
      setCount(stored ? Number(stored) || 0 : 0)
    } catch {
      setCount(0)
    }
  }, [slug])

  return (
    <div
      className={cn("inline-flex items-center gap-1.5 text-rose-600/80", className)}
      role="status"
      aria-label={`Cliques neste post: ${count}`}
      title={`${count} cliques`}
    >
      <Heart className="h-4 w-4" />
      <span className="tabular-nums">{count}</span>
    </div>
  )
}
