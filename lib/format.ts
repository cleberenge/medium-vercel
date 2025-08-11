export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 200))
  return minutes
}
