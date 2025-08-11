import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

// Rota para criar um novo post
export async function POST(request: NextRequest) {
  console.log("POST /api/posts: Iniciando requisição.")
  console.log("Supabase configurado:", isSupabaseConfigured)
  console.log("BLOB_READ_WRITE_TOKEN configurada:", Boolean(process.env.BLOB_READ_WRITE_TOKEN))

  if (!isSupabaseConfigured) {
    console.error("POST /api/posts: Supabase não configurado.")
    return NextResponse.json({ success: false, message: "Banco de dados não configurado." }, { status: 500 })
  }

  const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS || "admin"
  const authHeader = request.headers.get("Authorization")
  console.log("Auth Header recebido:", authHeader ? "Sim" : "Não")

  if (!authHeader || authHeader !== `Bearer ${adminPass}`) {
    console.error("POST /api/posts: Não autorizado. Header:", authHeader)
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
  }

  try {
    const formData = await request.formData()

    const title = String(formData.get("title") || "").trim()
    const description = String(formData.get("description") || "").trim()
    const content = String(formData.get("content") || "").trim()
    const status = String(formData.get("status") || "draft") as "draft" | "published"
    const file = formData.get("cover") as File | null

    if (!title || !description || !content) {
      console.error("POST /api/posts: Dados obrigatórios faltando.")
      return NextResponse.json({ success: false, message: "Preencha título, descrição e conteúdo." }, { status: 400 })
    }

    let imageUrl: string | null = null
    if (file && file.size > 0) {
      console.log("POST /api/posts: Tentando upload de imagem para Vercel Blob.")
      try {
        const path = `posts/${Date.now()}-${toSlug(title)}`
        const blob = await put(path, file, { access: "public" })
        imageUrl = blob.url
        console.log("POST /api/posts: Upload para Vercel Blob concluído. URL:", imageUrl)
      } catch (blobError) {
        console.error("POST /api/posts: Erro ao fazer upload para Vercel Blob:", blobError)
        return NextResponse.json({ success: false, message: "Erro no upload da imagem." }, { status: 500 })
      }
    }

    console.log("POST /api/posts: Inserindo dados no Supabase.")
    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          title,
          description,
          content,
          image_url: imageUrl,
          status,
        },
      ])
      .select()

    if (error) {
      console.error("POST /api/posts: Erro ao inserir no Supabase:", error)
      return NextResponse.json({ success: false, message: "Erro ao criar post." }, { status: 500 })
    }

    console.log("POST /api/posts: Post criado com sucesso.")
    return NextResponse.json({ success: true, message: "Post criado com sucesso!", post: data[0] }, { status: 201 })
  } catch (e: any) {
    console.error("POST /api/posts: Erro inesperado ao criar post:", e)
    return NextResponse.json({ success: false, message: "Erro interno do servidor." }, { status: 500 })
  }
}

// Rota para listar posts
export async function GET(request: NextRequest) {
  console.log("GET /api/posts: Iniciando requisição.")
  console.log("Supabase configurado:", isSupabaseConfigured)

  if (!isSupabaseConfigured) {
    console.error("GET /api/posts: Supabase não configurado.")
    return NextResponse.json({ success: false, message: "Banco de dados não configurado." }, { status: 500 })
  }

  const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS || "admin"
  const authHeader = request.headers.get("Authorization")

  if (!authHeader || authHeader !== `Bearer ${adminPass}`) {
    console.error("GET /api/posts: Não autorizado.")
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
  }

  try {
    console.log("GET /api/posts: Buscando posts no Supabase.")
    const { data: posts, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("GET /api/posts: Erro ao buscar posts:", error)
      return NextResponse.json({ success: false, message: "Erro ao buscar posts." }, { status: 500 })
    }

    console.log("GET /api/posts: Posts buscados com sucesso. Quantidade:", posts?.length || 0)
    return NextResponse.json({ success: true, posts: posts || [] }, { status: 200 })
  } catch (e) {
    console.error("GET /api/posts: Erro ao buscar posts:", e)
    return NextResponse.json({ success: false, message: "Erro ao buscar posts." }, { status: 500 })
  }
}

// Rota para editar posts
export async function PUT(request: NextRequest) {
  console.log("PUT /api/posts: Iniciando requisição.")

  if (!isSupabaseConfigured) {
    return NextResponse.json({ success: false, message: "Banco de dados não configurado." }, { status: 500 })
  }

  const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS || "admin"
  const authHeader = request.headers.get("Authorization")

  if (!authHeader || authHeader !== `Bearer ${adminPass}`) {
    console.error("PUT /api/posts: Não autorizado.")
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const id = String(formData.get("id") || "")

    if (!id) {
      return NextResponse.json({ success: false, message: "ID do post é obrigatório." }, { status: 400 })
    }

    const title = String(formData.get("title") || "").trim()
    const description = String(formData.get("description") || "").trim()
    const content = String(formData.get("content") || "").trim()
    const status = String(formData.get("status") || "draft") as "draft" | "published"
    const file = formData.get("cover") as File | null

    if (!title || !description || !content) {
      return NextResponse.json({ success: false, message: "Preencha título, descrição e conteúdo." }, { status: 400 })
    }

    // Buscar post atual
    const { data: currentPost, error: fetchError } = await supabase
      .from("posts")
      .select("image_url")
      .eq("id", id)
      .single()

    if (fetchError || !currentPost) {
      return NextResponse.json({ success: false, message: "Post não encontrado." }, { status: 404 })
    }

    let imageUrl = currentPost.image_url

    // Upload nova imagem se fornecida
    if (file && file.size > 0) {
      try {
        const path = `posts/${Date.now()}-${toSlug(title)}`
        const blob = await put(path, file, { access: "public" })
        imageUrl = blob.url
      } catch (blobError) {
        console.error("PUT /api/posts: Erro ao fazer upload:", blobError)
        return NextResponse.json({ success: false, message: "Erro no upload da imagem." }, { status: 500 })
      }
    }

    const { error } = await supabase
      .from("posts")
      .update({
        title,
        description,
        content,
        image_url: imageUrl,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      console.error("PUT /api/posts: Erro ao atualizar:", error)
      return NextResponse.json({ success: false, message: "Erro ao atualizar post." }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Post atualizado com sucesso!" }, { status: 200 })
  } catch (e: any) {
    console.error("PUT /api/posts: Erro ao atualizar post:", e)
    return NextResponse.json({ success: false, message: "Erro interno do servidor." }, { status: 500 })
  }
}

// Rota para deletar posts
export async function DELETE(request: NextRequest) {
  console.log("DELETE /api/posts: Iniciando requisição.")

  if (!isSupabaseConfigured) {
    return NextResponse.json({ success: false, message: "Banco de dados não configurado." }, { status: 500 })
  }

  const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS || "admin"
  const authHeader = request.headers.get("Authorization")

  if (!authHeader || authHeader !== `Bearer ${adminPass}`) {
    console.error("DELETE /api/posts: Não autorizado.")
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, message: "ID do post é obrigatório." }, { status: 400 })
    }

    const { error } = await supabase.from("posts").delete().eq("id", id)

    if (error) {
      console.error("DELETE /api/posts: Erro ao deletar:", error)
      return NextResponse.json({ success: false, message: "Erro ao deletar post." }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Post deletado com sucesso!" }, { status: 200 })
  } catch (e) {
    console.error("DELETE /api/posts: Erro ao deletar post:", e)
    return NextResponse.json({ success: false, message: "Erro interno do servidor." }, { status: 500 })
  }
}
