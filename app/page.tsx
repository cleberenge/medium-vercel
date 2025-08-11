import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoveRight, ChevronLeft, ChevronRight } from "lucide-react"
import { posts } from "@/data/posts"
import { formatDate } from "@/lib/format"
import { absoluteUrl } from "@/lib/seo"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import AdSlot from "@/components/ad-slot"
import PostLikes from "@/components/post-likes"
import Newsletter from "@/components/newsletter"

export const metadata = {
  title: "Blog | Medium-style",
  description: "Um blog estilo Medium com boas práticas de SEO, pronto para integração com Google AdSense.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: "Blog | Medium-style",
    description: "Um blog estilo Medium com boas práticas de SEO, pronto para integração com Google AdSense.",
    url: absoluteUrl("/"),
    siteName: "Medium-style Blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Medium-style",
    description: "Um blog estilo Medium com boas práticas de SEO, pronto para integração com Google AdSense.",
  },
}

const PAGE_SIZE = 6

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const q = typeof sp.q === "string" ? sp.q.trim() : ""
  const pageParam = typeof sp.page === "string" ? sp.page : "1"
  const currentPage = Math.max(1, Number.parseInt(pageParam || "1", 10) || 1)

  const sorted = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Filtro por busca (título, descrição, tags)
  const filtered = q
    ? sorted.filter((p) => {
        const hay = (p.title + " " + p.description + " " + p.tags.join(" ")).toLowerCase()
        return hay.includes(q.toLowerCase())
      })
    : sorted

  const hasQuery = q.length > 0

  // Mostra hero apenas na página 1 sem busca
  const showHero = !hasQuery && currentPage === 1 && filtered.length > 0
  const hero = showHero ? filtered[0] : null
  const listBase = showHero ? filtered.slice(1) : filtered

  const totalPages = Math.max(1, Math.ceil(listBase.length / PAGE_SIZE))
  const perPage = PAGE_SIZE // Página 1: hero + 6 cards. Páginas seguintes: 6 cards.
  // Quando há hero, removemos o primeiro item do array (listBase = filtered.slice(1)),
  // então o slicing abaixo entrega 6 cards por página consistentemente.
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const pageItems = listBase.slice(startIndex, startIndex + perPage)

  // Helper para construir URLs mantendo q
  function pageHref(page: number) {
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (page > 1) params.set("page", String(page))
    return `/?${params.toString()}`
  }

  const jsonLdWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: absoluteUrl("/"),
    name: "Medium-style Blog",
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        {showHero && hero && (
          <section className="border-b">
            <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 grid gap-8 md:grid-cols-2 items-center">
              <div className="space-y-4">
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  Destaque
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{hero.title}</h1>
                <p className="text-muted-foreground text-base md:text-lg">{hero.description}</p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span>{formatDate(hero.date)}</span>
                  <span>•</span>
                  <PostLikes slug={hero.slug} />
                </div>
                <div className="flex gap-2">
                  {hero.tags.map((t) => (
                    <Link key={t} href={`/tag/${encodeURIComponent(t)}`}>
                      <Badge variant="outline" className="rounded-full">
                        {t}
                      </Badge>
                    </Link>
                  ))}
                </div>
                <div>
                  <Button asChild className="gap-2">
                    <Link href={`/blog/${hero.slug}`}>
                      Ler agora <MoveRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-none border">
                <Image
                  src={hero.coverImage || "/placeholder.svg?height=540&width=960&query=capa%20do%20artigo%20destaque"}
                  alt={`Capa: ${hero.title}`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </section>
        )}

        <section aria-labelledby="lista-artigos" className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <h2 id="lista-artigos" className="sr-only">
            Artigos
          </h2>

          {hasQuery && (
            <p className="text-sm text-muted-foreground mb-4">
              Resultado da busca por: <span className="font-medium">{q}</span>
            </p>
          )}

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {pageItems.map((post) => (
              <Card key={post.slug} className="overflow-hidden flex flex-col">
                <CardHeader className="p-0">
                  <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/9]">
                    <Image
                      src={
                        post.coverImage ||
                        "/placeholder.svg?height=300&width=540&query=capa%20de%20artigo%20do%20blog" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt={`Capa: ${post.title}`}
                      fill
                      sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </Link>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <div className="flex gap-2 flex-wrap">
                    {post.tags.slice(0, 3).map((t) => (
                      <Link key={t} href={`/tag/${encodeURIComponent(t)}`}>
                        <Badge variant="outline" className="rounded-full">
                          {t}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                  <h3 className="font-semibold text-lg leading-snug">
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground line-clamp-3">{post.description}</p>
                </CardContent>
                <CardFooter className="mt-auto flex items-center justify-between text-sm text-muted-foreground">
                  <span>{formatDate(post.date)}</span>
                  <PostLikes slug={post.slug} />
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Paginação: Anterior, Página X de Y, Próxima (bem próximos) */}
          <div className="mt-10 flex items-center justify-center gap-2">
            <Button asChild variant="outline" disabled={currentPage <= 1} aria-disabled={currentPage <= 1}>
              <Link
                href={pageHref(Math.max(1, currentPage - 1))}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                prefetch
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Anterior
              </Link>
            </Button>

            <div className="text-sm text-muted-foreground tabular-nums">
              Página {currentPage} de {totalPages}
            </div>

            <Button
              asChild
              variant="outline"
              disabled={currentPage >= totalPages}
              aria-disabled={currentPage >= totalPages}
            >
              <Link
                href={pageHref(Math.min(totalPages, currentPage + 1))}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                prefetch
              >
                Próxima
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-10">
            <AdSlot
              // Preencha com seu ID do AdSense quando tiver
              adClient=""
              adSlot=""
              layout="in-article"
              className="mx-auto"
            />
          </div>

          {/* Newsletter com cantos retos e textos pedidos */}
          <Newsletter
            accent="#FFEF00"
            title="Fique por dentro das novidades"
            subtitle="Receba as curiosidades mais interessantes da engenharia diretamente no seu email"
          />
        </section>
      </main>
      <SiteFooter />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
      />
    </div>
  )
}
