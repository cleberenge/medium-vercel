export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"

export function absoluteUrl(path: string) {
  try {
    return new URL(path, siteUrl).toString()
  } catch {
    return `${siteUrl}${path}`
  }
}
