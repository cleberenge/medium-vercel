import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { posts } from "@/data/posts"
import { formatDate } from "@/lib/format"
import { absoluteUrl } from "@/lib/seo"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import AdSlot from "@/components/ad-slot"
import PostLikes from "@/components/post-likes"
import IncrementClick from "@/components/increment-click"
import type { Metadata } from "next"

type Params = { slug: string }

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const post = posts.find((p) => p.slug === params.slug)
  if (!post) return {}
  const url = absoluteUrl(`/blog/${post.slug}`)
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      images: [{ url: post.coverImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.coverImage],
    },
  }
}

export default function Page({ params }: { params: Params }) {
  const post = posts.find((p) => p.slug === params.slug)
  if (!post) notFound()

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: [post.coverImage],
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${post.slug}`),
    },
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Incrementa o contador ao abrir o post (uma vez por sessão) */}
      <IncrementClick slug={post.slug} />

      <SiteHeader />
      <article className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <header className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <Link key={t} href={`/tag/${encodeURIComponent(t)}`}>
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs">{t}</span>
              </Link>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{post.title}</h1>
          <p className="text-muted-foreground">{post.description}</p>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{formatDate(post.date)}</span>
            <span>•</span>
            <PostLikes slug={post.slug} />
          </div>

          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border">
            <Image
              src={post.coverImage || "/placeholder.svg?height=540&width=960&query=capa%20do%20artigo"}
              alt={`Imagem de capa do post ${post.title}`}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>
        </header>

        <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-24">
          {post.content.split("\n").map((line, idx) => {
            if (line.startsWith("# ")) {
              return <h2 key={idx}>{line.replace("# ", "")}</h2>
            }
            if (line.startsWith("## ")) {
              return <h3 key={idx}>{line.replace("## ", "")}</h3>
            }
            if (line.trim() === "") {
              return <p key={idx}>&nbsp;</p>
            }
            return <p key={idx}>{line}</p>
          })}
        </div>

        <div className="my-10">
          <AdSlot adClient="" adSlot="" layout="in-article" className="mx-auto" />
        </div>

        <footer className="mt-10 border-t pt-6 text-sm text-muted-foreground flex items-center justify-between">
          <Link href="/" className="hover:underline">
            ← Voltar ao blog
          </Link>
          <div className="flex gap-2">
            {post.tags.map((t) => (
              <Link key={t} href={`/tag/${encodeURIComponent(t)}`} className="hover:underline">
                #{t}
              </Link>
            ))}
          </div>
        </footer>

        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
        />
      </article>
      <SiteFooter />
    </div>
  )
}
