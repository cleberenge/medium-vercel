"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function LoginButton() {
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (data.success) {
        window.location.reload()
      } else {
        setError(data.message || "Senha incorreta")
      }
    } catch (err) {
      setError("Erro de conexão")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <input
        id="password"
        type="password"
        name="password"
        placeholder="Digite a senha"
        required
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit" disabled={loading} className="w-full" onClick={handleLogin}>
        {loading ? "Entrando..." : "Entrar"}
      </Button>
      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
    </>
  )
}
