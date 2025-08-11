export default function PainelTestePage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-4">Painel de Teste</h1>
      <p className="mb-4">Esta é uma página Server Component simples.</p>

      <div className="space-y-2 text-sm bg-blue-50 p-4 rounded">
        <p>
          <strong>Rota:</strong> /painel-teste
        </p>
        <p>
          <strong>Status:</strong> Funcionando ✅
        </p>
        <p>
          <strong>Tipo:</strong> Server Component
        </p>
      </div>

      <div className="mt-6">
        <a href="/" className="text-blue-600 underline">
          ← Voltar ao blog
        </a>
      </div>
    </div>
  )
}
