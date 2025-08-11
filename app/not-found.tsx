import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Página não encontrada</h1>
        <p className="text-muted-foreground mt-2">
          A página que você procura pode ter sido removida ou está temporariamente indisponível.
        </p>
        <div className="mt-6">
          <Link href="/" className="underline">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  )
}
