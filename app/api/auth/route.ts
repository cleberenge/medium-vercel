import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS || "admin"

    if (password === adminPass) {
      const cookieStore = cookies()
      cookieStore.set("dashboard-auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 horas
      })

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, message: "Senha incorreta" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}
