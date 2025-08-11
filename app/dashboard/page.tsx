import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import DashboardClient from "@/components/dashboard-component"

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const adminPass = cookieStore.get("admin-auth")?.value

  if (!adminPass || adminPass !== process.env.NEXT_PUBLIC_ADMIN_PASS) {
    redirect("/admin-simples")
  }

  // Check integrations
  const isDbConnected = !!process.env.DATABASE_URL
  const isBlobConnected = !!process.env.BLOB_READ_WRITE_TOKEN

  const handleLogout = async () => {
    "use server"
    const cookieStore = await cookies()
    cookieStore.delete("admin-auth")
    redirect("/admin-simples")
  }

  return (
    <DashboardClient
      isDbConnected={isDbConnected}
      isBlobConnected={isBlobConnected}
      adminPass={adminPass}
      onLogout={handleLogout}
    />
  )
}
