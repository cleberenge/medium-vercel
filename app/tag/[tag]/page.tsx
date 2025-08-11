import Link from "next/link"
import { posts } from "@/data/posts"
import { formatDate } from "@/lib/format"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { absoluteUrl } from "@/lib/seo"
import PostLikes from "@/components/post-likes"
import type { Metadata } from "next"

export async function generateStaticParams() {
  const allTags = new Set(posts.flatMap((p) => p.tags))
  return Array.from(allTags).map((tag) => ({ tag }))
}

export async function generateMetadata({
  params,
}: {
  params: { tag: string }
}): Promise<Metadata> {
  const tag = decodeURIComponent(params.tag)
  const title = `Artigos sobre ${tag}`
  const desc = `Leia artigos marcados com ${tag}.`
  return {
    title,
    description: desc,
    alternates: { canonical: absoluteUrl(`/tag/${encodeURIComponent(tag)}`) },
    openGraph: {
      title,
      description: desc,
      url: absoluteUrl(`/tag/${encodeURIComponent(tag)}`),
      type: "website",
    },
  }
}

export default function Page({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag)
  const filtered = posts.filter((p) => p.tags.includes(tag))

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 md:py-14">
        <h1 className="text-2xl md:text-3xl font-bold">Tag: {tag}</h1>
        <p className="text-muted-foreground mt-1">{filtered.length} artigo(s)</p>

        <ul className="mt-8 grid gap-6">
          {filtered.map((p) => (
            <li key={p.slug} className="border rounded-lg p-5 hover:bg-muted/30 transition">
              <Link href={`/blog/${p.slug}`} className="block">
                <h2 className="font-semibold text-lg">{p.title}</h2>
                <p className="text-muted-foreground line-clamp-2">{p.description}</p>
                <div className="mt-3 text-sm text-muted-foreground flex items-center gap-2 justify-between">
                  <span>{formatDate(p.date)}</span>
                  <PostLikes slug={p.slug} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </div>
  )
}
