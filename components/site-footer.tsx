import Link from "next/link"

export default function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground grid gap-4 md:flex items-center justify-between">
        <p>&copy; {year} Medium-style Blog. Todos os direitos reservados.</p>
        <nav className="flex flex-wrap gap-4">
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
          <Link href="/sitemap.xml" className="hover:underline">
            Sitemap
          </Link>
        </nav>
      </div>
    </footer>
  )
}
