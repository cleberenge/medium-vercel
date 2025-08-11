import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import ContactForm from "./ContactForm"

export const metadata = {
  title: "Contato",
  description: "Entre em contato conosco.",
}

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-10 md:py-14">
        <h1 className="text-2xl md:text-3xl font-bold">Contato</h1>
        <p className="text-muted-foreground mt-1">
          Preencha o formulário e clique em Enviar. Você será redirecionado ao seu e-mail.
        </p>

        <ContactForm />
      </main>
      <SiteFooter />
    </div>
  )
}
