"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Post } from "@/lib/supabase"

type DashboardClientProps = {
  isDbConnected: boolean
  isBlobConnected: boolean
  adminPass: string
  onLogout: () => Promise<void>
}

export default function DashboardClient({ isDbConnected, isBlobConnected, adminPass, onLogout }: DashboardClientProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts", {
        headers: {
          Authorization: `Bearer ${adminPass}`,
        },
      })
      const data = await res.json()
      if (data.success) {
        setPosts(data.posts)
      } else {
        setMessage(`Erro ao carregar posts: ${data.message}`)
      }
    } catch (err) {
      console.error("Erro ao buscar posts:", err)
      setMessage("Erro de rede ao carregar posts.")
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage("")

    const formData = new FormData(e.currentTarget)
    const method = editingPost ? "PUT" : "POST"

    if (editingPost) {
      formData.append("id", editingPost.id)
    }

    try {
      const res = await fetch("/api/posts", {
        method,
        headers: {
          Authorization: `Bearer ${adminPass}`,
        },
        body: formData,
      })
      const data = await res.json()

      if (data.success) {
        setMessage(editingPost ? "✅ Post atualizado com sucesso!" : "✅ Post criado com sucesso!")
        e.currentTarget.reset()
        setCoverPreview(null)
        setEditingPost(null)
        setShowCreateForm(false)
        fetchPosts()
      } else {
        setMessage(`❌ Erro: ${data.message || "Erro desconhecido"}`)
      }
    } catch (err) {
      console.error("Erro ao salvar post:", err)
      setMessage("❌ Erro de rede ao salvar post.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (postId: string) => {
    if (!confirm("Tem certeza que deseja deletar este post?")) return

    try {
      const res = await fetch(`/api/posts?id=${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminPass}`,
        },
      })
      const data = await res.json()

      if (data.success) {
        setMessage("✅ Post deletado com sucesso!")
        fetchPosts()
      } else {
        setMessage(`❌ Erro ao deletar: ${data.message}`)
      }
    } catch (err) {
      console.error("Erro ao deletar post:", err)
      setMessage("❌ Erro de rede ao deletar post.")
    }
  }

  const startEdit = (post: Post) => {
    setEditingPost(post)
    setShowCreateForm(true)
    setCoverPreview(post.image_url || null)
  }

  const cancelEdit = () => {
    setEditingPost(null)
    setShowCreateForm(false)
    setCoverPreview(null)
    setMessage("")
  }

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <h1 className="font-semibold">Dashboard - Gerenciar Blog</h1>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline">
              <Link href="/">Ver Blog</Link>
            </Button>
            <button onClick={onLogout} className="text-sm underline text-muted-foreground">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{editingPost ? "Editando Post" : "Posts do Blog"}</h2>
            {!showCreateForm && <Button onClick={() => setShowCreateForm(true)}>Criar Novo Post</Button>}
          </div>

          {message && (
            <div
              className={cn(
                "p-3 rounded-md text-sm",
                message.includes("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700",
              )}
            >
              {message}
            </div>
          )}

          {showCreateForm && (
            <div className="border rounded-lg p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">{editingPost ? "Editar Post" : "Criar Novo Post"}</h3>
                <Button onClick={cancelEdit} variant="outline" size="sm">
                  Cancelar
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Título *
                  </label>
                  <Input
                    id="title"
                    name="title"
                    required
                    defaultValue={editingPost?.title || ""}
                    placeholder="Ex: Como usar IA na prática"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Descrição *
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    rows={3}
                    defaultValue={editingPost?.description || ""}
                    placeholder="Resumo do que o post aborda..."
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium">
                    Conteúdo *
                  </label>
                  <Textarea
                    id="content"
                    name="content"
                    required
                    rows={8}
                    defaultValue={editingPost?.content || ""}
                    placeholder="# Título&#10;&#10;Conteúdo do post..."
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="cover" className="text-sm font-medium">
                    Imagem de capa
                  </label>
                  <Input
                    id="cover"
                    name="cover"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) {
                        setCoverPreview(URL.createObjectURL(f))
                      }
                    }}
                  />
                </div>

                {coverPreview && (
                  <div className="relative aspect-[16/9] w-full max-w-md overflow-hidden border rounded-md">
                    <img
                      src={coverPreview || "/placeholder.svg"}
                      alt="Pré-visualização da capa"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={editingPost?.status || "draft"}
                    className="h-10 border rounded-md px-3 w-full"
                  >
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                  </select>
                </div>

                <Button type="submit" disabled={submitting}>
                  {submitting ? "Salvando..." : editingPost ? "Atualizar Post" : "Criar Post"}
                </Button>
              </form>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Posts Existentes ({posts.length})</h3>
            {posts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum post encontrado.</p>
                <Button onClick={() => setShowCreateForm(true)} className="mt-2">
                  Criar seu primeiro post
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {posts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium truncate">{post.title}</h4>
                          <span
                            className={cn(
                              "px-2 py-1 text-xs rounded-full",
                              post.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700",
                            )}
                          >
                            {post.status === "published" ? "Publicado" : "Rascunho"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{post.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>/{generateSlug(post.title)}</span>
                          <span>{new Date(post.created_at).toLocaleString("pt-BR")}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/blog/${generateSlug(post.title)}`} target="_blank">
                            Ver
                          </Link>
                        </Button>
                        <Button onClick={() => startEdit(post)} variant="outline" size="sm">
                          Editar
                        </Button>
                        <Button onClick={() => handleDelete(post.id)} variant="destructive" size="sm">
                          Deletar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
