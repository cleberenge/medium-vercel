"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SiteHeader({
  logo = "Medium-style Blog",
}: {
  logo?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="font-semibold tracking-tight">
          {logo}
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/about" className="hover:underline">
            Sobre
          </Link>
          <Link href="/contact" className="hover:underline">
            Contato
          </Link>
          <Link href="/privacy-policy" className="hover:underline">
            Privacidade
          </Link>
          <Link href="/terms" className="hover:underline">
            Termos
          </Link>

          {/* Campo de busca (desktop) */}
          <form action="/" method="GET" className="ml-2 flex items-center gap-2">
            <label htmlFor="site-search" className="sr-only">
              Buscar
            </label>
            <Input id="site-search" name="q" type="search" placeholder="Buscar…" className="h-8 w-44" defaultValue="" />
            <Button type="submit" size="icon" variant="secondary" className="h-8 w-8">
              <Search className="h-4 w-4" />
              <span className="sr-only">Buscar</span>
            </Button>
          </form>
        </nav>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Abrir menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="mx-auto max-w-6xl px-4 py-3 grid gap-3">
            <nav className="grid gap-2">
              <Link href="/about" className="hover:underline" onClick={() => setOpen(false)}>
                Sobre
              </Link>
              <Link href="/contact" className="hover:underline" onClick={() => setOpen(false)}>
                Contato
              </Link>
              <Link href="/privacy-policy" className="hover:underline" onClick={() => setOpen(false)}>
                Privacidade
              </Link>
              <Link href="/terms" className="hover:underline" onClick={() => setOpen(false)}>
                Termos
              </Link>
            </nav>

            {/* Campo de busca (mobile) */}
            <form action="/" method="GET" className="flex items-center gap-2">
              <label htmlFor="site-search-mobile" className="sr-only">
                Buscar
              </label>
              <Input
                id="site-search-mobile"
                name="q"
                type="search"
                placeholder="Buscar…"
                className="h-9"
                defaultValue=""
              />
              <Button type="submit" size="icon" variant="secondary">
                <Search className="h-4 w-4" />
                <span className="sr-only">Buscar</span>
              </Button>
            </form>
          </div>
        </div>
      )}
    </header>
  )
}
