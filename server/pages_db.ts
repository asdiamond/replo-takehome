import type { CreatePageInput, Page } from "@/apis/pages/types"
import { deleteBlocksByPageId } from "@/server/blocks_db"
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

const selectPageById = db.query(`
  SELECT id, title, created_at
  FROM pages
  WHERE id = ?1
`)

const deletePageById = db.query(`
  DELETE FROM pages
  WHERE id = ?1
`)

function mapPageRow(row: PageRow): Page {
  return {
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
  }
}

export function getPages(): Page[] {
  return (selectPages.all() as PageRow[]).map(mapPageRow)
}

export function getPage(pageId: string): Page | null {
  const pageRow = selectPageById.get(pageId) as PageRow | null

  if (!pageRow) {
    return null
  }

  return mapPageRow(pageRow)
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

export function deletePage(pageId: string): Page | null {
  const pageRow = selectPageById.get(pageId) as PageRow | null

  if (!pageRow) {
    return null
  }

  deleteBlocksByPageId(pageId)
  deletePageById.run(pageId)

  return mapPageRow(pageRow)
}
