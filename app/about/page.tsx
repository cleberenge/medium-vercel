import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata = {
  title: "Sobre",
  description: "Saiba mais sobre este blog estilo Medium, focado em conteúdo de qualidade e experiência de leitura.",
}

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 md:py-14 prose prose-neutral dark:prose-invert">
        <h1>Sobre</h1>
        <p>
          Este projeto é um blog estilo Medium, construído com Next.js e boas práticas de SEO para maximizar indexação e
          performance, pronto para integração com Google AdSense.
        </p>
        <h2>Objetivo</h2>
        <p>
          Oferecer uma experiência de leitura limpa, veloz e responsiva, com estrutura semântica e conteúdo de
          qualidade.
        </p>
        <h2>Tecnologias</h2>
        <ul>
          <li>Next.js (App Router, Server Components, Metadata API)</li>
          <li>Tailwind CSS e shadcn/ui</li>
          <li>Estruturas de SEO: Open Graph, Twitter Cards e JSON-LD</li>
        </ul>
      </main>
      <SiteFooter />
    </div>
  )
}
