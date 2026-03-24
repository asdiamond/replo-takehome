import type { CreatePageInput, Page } from "@/apis/pages/types"
import db from "@/server/db"

type PageRow = {
  id: string
  title: string
  created_at: string
}

const insertPage = db.query(`
  INSERT INTO pages (id, title, created_at)
  VALUES (?1, ?2, ?3)
`)

const selectPages = db.query(`
  SELECT id, title, created_at
  FROM pages
  ORDER BY created_at ASC
`)

export function getPages(): Page[] {
  return (selectPages.all() as PageRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
  }))
}

export function createPage(input: CreatePageInput): Page {
  const page: Page = {
    id: crypto.randomUUID(),
    title: input.title?.trim() || "Untitled",
    createdAt: new Date().toISOString(),
  }


  insertPage.run(page.id, page.title, page.createdAt)

  return page
}
