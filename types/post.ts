export type Post = {
  slug: string
  title: string
  description: string
  date: string
  updatedAt?: string
  author: {
    name: string
    avatar?: string
  }
  tags: string[]
  coverImage: string
  content: string
}
