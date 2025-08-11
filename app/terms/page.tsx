import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata = {
  title: "Termos de Uso",
  description: "Termos e condições de uso do site.",
  alternates: {
    canonical: "/terms",
  },
}

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 md:py-14 prose prose-neutral dark:prose-invert">
        <h1>Termos de Uso</h1>
        <p>Ao acessar este site, você concorda com estes termos e condições.</p>
        <h2>Uso Aceitável</h2>
        <p>Você concorda em não utilizar o site para fins ilegais ou não autorizados.</p>
        <h2>Limitação de Responsabilidade</h2>
        <p>Não nos responsabilizamos por danos indiretos decorrentes do uso do site.</p>
        <p className="text-xs text-muted-foreground">
          Observação: personalize este texto para refletir sua realidade e cumprir as exigências legais do seu país.
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
