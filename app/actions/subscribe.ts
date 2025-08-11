"use server"

export async function subscribe(prevState: any, formData: FormData) {
  const email = (formData.get("email") as string)?.trim()
  await new Promise((r) => setTimeout(r, 600))
  if (!email || !/.+@.+/.test(email)) {
    return { success: false, message: "E-mail inválido. Tente novamente." }
  }
  // Aqui você integraria com seu provedor (Brevo, Mailchimp, ConvertKit etc.)
  // Por enquanto, apenas simulamos sucesso.
  return { success: true, message: "Inscrição realizada com sucesso!" }
}
