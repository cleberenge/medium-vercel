import type { MetadataRoute } from "next"
import { posts } from "@/data/posts"
import { absoluteUrl } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = absoluteUrl("/")
  const routes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date() },
    { url: absoluteUrl("/about"), lastModified: new Date() },
    { url: absoluteUrl("/contact"), lastModified: new Date() },
    { url: absoluteUrl("/privacy-policy"), lastModified: new Date() },
    { url: absoluteUrl("/terms"), lastModified: new Date() },
  ]

  const postRoutes = posts.map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    lastModified: new Date(p.updatedAt ?? p.date),
  }))

  return [...routes, ...postRoutes]
}
