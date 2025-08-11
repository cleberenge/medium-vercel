import { neon } from "@neondatabase/serverless"

let sql: ReturnType<typeof neon> | null = null

export function getSql() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.warn("DATABASE_URL não está configurada. O banco de dados não será usado.")
    return null
  }
  if (!sql) {
    sql = neon(url)
  }
  return sql
}

export type DbPost = {
  id: number
  slug: string
  title: string
  description: string
  content: string
  tags: string[]
  cover_url: string | null
  status: "draft" | "published" | "scheduled"
  published_at: string | null
  created_at: string
  updated_at: string
}

export function toSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}
