"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { DbPost } from "@/lib/db"

type DashboardClientProps = {
  isDbConnected: boolean
  isBlobConnected: boolean
  adminPass: string
  onLogout: () => Promise<void>
}

export default function DashboardClient({ isDbConnected, isBlobConnected, adminPass, onLogout }: DashboardClientProps) {
  const [view, setView] = useState<"dashboard" | "create">("dashboard")
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [posts, setPosts] = useState<DbPost[]>([])
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [view])

  const fetchPosts = async () => {
    if (view !== "dashboard") return
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
        setMessage(`❌ Erro ao carregar posts: ${data.message}`)
      }
    } catch (err) {
      setMessage("❌ Erro de rede ao carregar posts")
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage("")

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminPass}`,
        },
        body: formData,
      })
      const data = await res.json()

      if (data.success) {
        setMessage("✅ Post criado com sucesso!")
        e.currentTarget.reset()
        setCoverPreview(null)
        setView("dashboard")
      } else {
        setMessage(`❌ Erro ao criar post: ${data.message || "Erro desconhecido"}`)
      }
    } catch (err) {
      setMessage("❌ Erro de rede ao criar post")
    } finally {
      setSubmitting(false)
    }
  }

  if (view === "dashboard") {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b">
          <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
            <h1 className="font-semibold">Dashboard</h1>
            <div className="flex items-center gap-4">
              <Button onClick={() => setView("create")}>Criar Post</Button>
              <button onClick={onLogout} className="text-sm underline text-muted-foreground">
                Sair
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-6">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Gerenciar Blog</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="border rounded-lg p-6">
                <h3 className="font-medium mb-2">Status</h3>
                <ul className="text-sm space-y-1">
                  <li>✅ Dashboard funcionando</li>
                  <li>{isDbConnected ? "✅ Banco de dados conectado" : "⚠️ Configure DATABASE_URL"}</li>
                  <li>{isBlobConnected ? "✅ Vercel Blob conectado" : "⚠️ Configure Vercel Blob"}</li>
                </ul>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="font-medium mb-2">Ações</h3>
                <div className="space-y-2">
                  <Button onClick={() => setView("create")} className="w-full">
                    Criar Post
                  </Button>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/">Ver Blog</Link>
                  </Button>
                </div>
              </div>
            </div>

            {message && (
              <div
                className={cn(
                  "text-sm p-3 rounded",
                  message.includes("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700",
                )}
              >
                {message}
              </div>
            )}

            <h3 className="text-xl font-semibold mt-8">Posts Existentes</h3>
            {posts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum post encontrado. Crie um novo!</p>
            ) : (
              <ul className="divide-y border rounded-lg">
                {posts.map((p) => (
                  <li key={p.id} className="py-3 px-4 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{p.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.status} • {p.slug} •{" "}
                        {p.published_at ? new Date(p.published_at).toLocaleString("pt-BR") : "Sem data"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="secondary" size="sm">
                        <Link href={`/blog/${p.slug}`}>Ver</Link>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    )
  }

  if (view === "create") {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b">
          <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
            <h1 className="font-semibold">Criar Post</h1>
            <Button onClick={() => setView("dashboard")} variant="outline" size="sm">
              ← Voltar
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-4 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Título *
              </label>
              <Input id="title" name="title" required placeholder="Ex: Como usar IA na prática" />
            </div>

            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-medium">
                Slug (opcional)
              </label>
              <Input id="slug" name="slug" placeholder="como-usar-ia-na-pratica" />
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
                rows={12}
                placeholder="# Título

Conteúdo do post..."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">
                Tags (separadas por vírgula)
              </label>
              <Input id="tags" name="tags" placeholder="IA, Tecnologia, Programação" />
            </div>

            <div className="space-y-2">
              <label htmlFor="cover" className="text-sm">
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
                    const url = URL.createObjectURL(f)
                    setCoverPreview(url)
                  } else {
                    setCoverPreview(null)
                  }
                }}
              />
              {coverPreview && (
                <div className="relative aspect-[16/9] w-full overflow-hidden border">
                  <img
                    src={coverPreview || "/placeholder.svg"}
                    alt="Pré-visualização da capa"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <select id="status" name="status" className="h-10 border rounded-md px-3 w-full">
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
                  <option value="scheduled">Agendado</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="published_at" className="text-sm font-medium">
                  Data de publicação
                </label>
                <Input id="published_at" name="published_at" type="datetime-local" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Salvando..." : "Salvar Post"}
              </Button>

              {message && (
                <span className={cn("text-sm", message.includes("✅") ? "text-green-600" : "text-red-600")}>
                  {message}
                </span>
              )}
            </div>
          </form>
        </main>
      </div>
    )
  }

  return null
}
