"use client"

import { useActionState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { subscribe } from "@/app/actions/subscribe"

type State = { success: boolean; message: string }

export default function Newsletter({
  title = "Fique por dentro das novidades",
  subtitle = "Receba as curiosidades mais interessantes da engenharia diretamente no seu email",
  accent = "#FFEF00",
}: {
  title?: string
  subtitle?: string
  accent?: string
}) {
  const [state, action, pending] = useActionState<State, FormData>(subscribe as any, {
    success: false,
    message: "",
  })

  return (
    <section
      className="mt-12 rounded-none"
      style={{
        backgroundColor: accent,
      }}
    >
      <div className="mx-auto max-w-4xl px-6 py-10 text-black">
        <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
        <p className="mt-1">{subtitle}</p>

        <form action={action} className="mt-6 flex flex-col sm:flex-row gap-3">
          <label htmlFor="newsletter-email" className="sr-only">
            Seu e-mail
          </label>
          <Input
            id="newsletter-email"
            type="email"
            name="email"
            required
            placeholder="seu@email.com"
            className="bg-white text-black placeholder:text-muted-foreground rounded-none"
          />
          <Button type="submit" disabled={pending} className="bg-black text-white hover:bg-black/90 rounded-none">
            {pending ? "Enviando..." : "Inscrever"}
          </Button>
        </form>

        {state?.message && (
          <p className="mt-3 text-sm" role="status">
            {state.message}
          </p>
        )}
      </div>
    </section>
  )
}
