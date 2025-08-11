"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const mailto = `mailto:contato@example.com?subject=${encodeURIComponent(
    "Contato pelo blog",
  )}&body=${encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\n${message}`)}`

  return (
    <form
      className="mt-8 grid gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        window.location.href = mailto
      }}
    >
      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm font-medium">
          Nome
        </label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
      </div>
      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm font-medium">
          E-mail
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@email.com"
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="message" className="text-sm font-medium">
          Mensagem
        </label>
        <Textarea
          id="message"
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escreva sua mensagem..."
        />
      </div>
      <div>
        <Button type="submit">Enviar</Button>
      </div>
    </form>
  )
}
