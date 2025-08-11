import { cookies } from "next/headers"
import DashboardClient from "@/components/dashboard-client"
import LoginButton from "@/components/login-button"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const cookieStore = cookies()

  const isSessionAuthenticated = cookieStore.get("dashboard-auth")?.value === "true"

  const handleLogout = async () => {
    "use server"
    cookieStore.delete("dashboard-auth")
    redirect("/dashboard")
  }

  if (!isSessionAuthenticated) {
    return (
      <div className="min-h-screen grid place-items-center bg-white">
        <form className="w-full max-w-sm border rounded-lg p-6 space-y-4">
          <h1 className="text-xl font-semibold text-center">Dashboard</h1>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Senha
            </label>
            <LoginButton />
          </div>

          <div className="text-xs text-muted-foreground text-center">
            <p>
              Senha padrão: <code>admin</code> (se NEXT_PUBLIC_ADMIN_PASS não estiver configurado)
            </p>
          </div>
        </form>
      </div>
    )
  }

  const isDbConnected = Boolean(process.env.DATABASE_URL)
  const isBlobConnected = Boolean(process.env.BLOB_READ_WRITE_TOKEN)
  const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS || "admin"

  return (
    <DashboardClient
      isDbConnected={isDbConnected}
      isBlobConnected={isBlobConnected}
      adminPass={adminPass}
      onLogout={handleLogout}
    />
  )
}
