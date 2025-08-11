import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata = {
  title: "Política de Privacidade",
  description: "Política de Privacidade do site.",
  alternates: {
    canonical: "/privacy-policy",
  },
}

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 md:py-14 prose prose-neutral dark:prose-invert">
        <h1>Política de Privacidade</h1>
        <p>
          Esta Política de Privacidade descreve como coletamos, usamos e compartilhamos suas informações quando você
          utiliza este site.
        </p>
        <h2>Coleta de Informações</h2>
        <p>Podemos coletar informações como IP, páginas visitadas e dados de uso para melhorar a experiência.</p>
        <h2>Cookies</h2>
        <p>Utilizamos cookies para análises e funcionalidades essenciais. Você pode desativá-los no navegador.</p>
        <h2>Contato</h2>
        <p>Para dúvidas sobre esta política, envie um e-mail para contato@example.com.</p>
        <p className="text-xs text-muted-foreground">
          Observação: personalize este texto para refletir sua realidade e cumprir as exigências legais do seu país.
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
