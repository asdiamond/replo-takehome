export type Page = {
  id: string
  title: string
  createdAt: string
}

export type CreatePageInput = {
  title?: string
}

export type CreatePageResponse = {
  page: Page
}
