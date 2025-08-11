import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { getSql, toSlug } from "@/lib/db"

// Rota para criar um novo post
export async function POST(request: NextRequest) {
  console.log("POST /api/posts: Iniciando requisição.")
  console.log("DATABASE_URL configurada:", Boolean(process.env.DATABASE_URL))
  console.log("BLOB_READ_WRITE_TOKEN configurada:", Boolean(process.env.BLOB_READ_WRITE_TOKEN))

  const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS || "admin"
  const authHeader = request.headers.get("Authorization")
  console.log("Auth Header recebido:", authHeader ? "Sim" : "Não")
  console.log("Admin Pass (comparação):", authHeader === `Bearer ${adminPass}`)

  if (!authHeader || authHeader !== `Bearer ${adminPass}`) {
    console.error("POST /api/posts: Não autorizado. Header:", authHeader)
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
  }

  try {
    const formData = await request.formData()

    const title = String(formData.get("title") || "").trim()
    const description = String(formData.get("description") || "").trim()
    const content = String(formData.get("content") || "").trim()
    const tagsCsv = String(formData.get("tags") || "")
    const status = String(formData.get("status") || "draft") as "draft" | "published" | "scheduled"
    const publishedAtStr = String(formData.get("published_at") || "")
    const file = formData.get("cover") as File | null

    if (!title || !description || !content) {
      console.error("POST /api/posts: Dados obrigatórios faltando.")
      return NextResponse.json({ success: false, message: "Preencha título, descrição e conteúdo." }, { status: 400 })
    }

    const slug = toSlug(String(formData.get("slug") || title))
    const tags = tagsCsv
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    let coverUrl: string | null = null
    if (file && file.size > 0) {
      console.log("POST /api/posts: Tentando upload de imagem para Vercel Blob.")
      try {
        const path = `posts/${Date.now()}-${slug}`
        const blob = await put(path, file, { access: "public" })
        coverUrl = blob.url
        console.log("POST /api/posts: Upload para Vercel Blob concluído. URL:", coverUrl)
      } catch (blobError) {
        console.error("POST /api/posts: Erro ao fazer upload para Vercel Blob:", blobError)
        return NextResponse.json({ success: false, message: "Erro no upload da imagem." }, { status: 500 })
      }
    } else {
      console.log("POST /api/posts: Nenhuma imagem de capa fornecida ou arquivo vazio.")
    }

    const sql = getSql()
    if (!sql) {
      console.error("POST /api/posts: Banco de dados não configurado (getSql retornou null).")
      return NextResponse.json({ success: false, message: "Banco de dados não configurado." }, { status: 500 })
    }
    console.log("POST /api/posts: Conexão SQL obtida.")

    const publishedAt =
      status === "published" || status === "scheduled" ? (publishedAtStr ? new Date(publishedAtStr) : new Date()) : null

    console.log("POST /api/posts: Inserindo dados no banco de dados.")
    await sql`
      insert into posts (slug, title, description, content, tags, cover_url, status, published_at)
      values (${slug}, ${title}, ${description}, ${content}, ${tags}, ${coverUrl}, ${status}, ${publishedAt})
    `
    console.log("POST /api/posts: Dados inseridos com sucesso.")

    return NextResponse.json({ success: true, message: "Post criado com sucesso!", slug }, { status: 201 })
  } catch (e: any) {
    if (String(e?.message || "").includes("duplicate key")) {
      console.error("POST /api/posts: Erro de slug duplicado:", e.message)
      return NextResponse.json({ success: false, message: "Slug já existe. Tente outro." }, { status: 409 })
    }
    console.error("POST /api/posts: Erro inesperado ao criar post:", e)
    return NextResponse.json({ success: false, message: "Erro interno do servidor." }, { status: 500 })
  }
}

// Rota para listar posts
export async function GET(request: NextRequest) {
  console.log("GET /api/posts: Iniciando requisição.")
  console.log("DATABASE_URL configurada:", Boolean(process.env.DATABASE_URL))
  console.log("BLOB_READ_WRITE_TOKEN configurada:", Boolean(process.env.BLOB_READ_WRITE_TOKEN))

  const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS || "admin"
  const authHeader = request.headers.get("Authorization")
  console.log("Auth Header recebido:", authHeader ? "Sim" : "Não")
  console.log("Admin Pass (comparação):", authHeader === `Bearer ${adminPass}`)

  if (!authHeader || authHeader !== `Bearer ${adminPass}`) {
    console.error("GET /api/posts: Não autorizado. Header:", authHeader)
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
  }

  const sql = getSql()
  if (!sql) {
    console.error("GET /api/posts: Banco de dados não configurado (getSql retornou null).")
    return NextResponse.json({ success: false, message: "Banco de dados não configurado." }, { status: 500 })
  }
  console.log("GET /api/posts: Conexão SQL obtida.")

  try {
    console.log("GET /api/posts: Buscando posts no banco de dados.")
    const posts = await sql`select * from posts order by coalesce(published_at, created_at) desc`
    console.log("GET /api/posts: Posts buscados com sucesso. Quantidade:", posts.length)
    return NextResponse.json({ success: true, posts }, { status: 200 })
  } catch (e) {
    console.error("GET /api/posts: Erro ao buscar posts:", e)
    return NextResponse.json({ success: false, message: "Erro ao buscar posts." }, { status: 500 })
  }
}
