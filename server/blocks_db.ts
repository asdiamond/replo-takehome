import type {
  Block,
  CreateBlockInput,
  ImageBlock,
  TextBlock,
  TextBlockStyle,
  UpdateBlockInput,
} from "@/apis/blocks/types"
import db from "@/server/db"

type BlockRow = {
  id: string
  page_id: string
  type: "text" | "image"
  sort_order: number
  text_style: TextBlockStyle | null
  text_value: string | null
  image_src: string | null
  image_width: number | null
  image_height: number | null
  created_at: string
}

type PageExistsRow = {
  id: string
}

type MaxSortOrderRow = {
  max_sort_order: number | null
}

const selectPageById = db.query(`
  SELECT id
  FROM pages
  WHERE id = ?1
`)

const selectBlocksByPageId = db.query(`
  SELECT
    id,
    page_id,
    type,
    sort_order,
    text_style,
    text_value,
    image_src,
    image_width,
    image_height,
    created_at
  FROM blocks
  WHERE page_id = ?1
  ORDER BY sort_order ASC, created_at ASC
`)

const selectBlockById = db.query(`
  SELECT
    id,
    page_id,
    type,
    sort_order,
    text_style,
    text_value,
    image_src,
    image_width,
    image_height,
    created_at
  FROM blocks
  WHERE id = ?1
`)

const selectMaxSortOrderByPageId = db.query(`
  SELECT MAX(sort_order) AS max_sort_order
  FROM blocks
  WHERE page_id = ?1
`)

const insertBlock = db.query(`
  INSERT INTO blocks (
    id,
    page_id,
    type,
    sort_order,
    text_style,
    text_value,
    image_src,
    image_width,
    image_height,
    created_at
  )
  VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)
`)

const updateTextBlockStatement = db.query(`
  UPDATE blocks
  SET
    type = ?2,
    text_style = ?3,
    text_value = ?4,
    image_src = NULL,
    image_width = NULL,
    image_height = NULL
  WHERE id = ?1
`)

const updateImageBlockStatement = db.query(`
  UPDATE blocks
  SET
    type = ?2,
    text_style = NULL,
    text_value = NULL,
    image_src = ?3,
    image_width = ?4,
    image_height = ?5
  WHERE id = ?1
`)

const deleteBlocksByPageIdStatement = db.query(`
  DELETE FROM blocks
  WHERE page_id = ?1
`)

function mapBlockRow(row: BlockRow): Block {
  if (row.type === "text") {
    return {
      id: row.id,
      pageId: row.page_id,
      type: "text",
      sortOrder: row.sort_order,
      style: row.text_style ?? "p",
      value: row.text_value ?? "",
      createdAt: row.created_at,
    } satisfies TextBlock
  }

  return {
    id: row.id,
    pageId: row.page_id,
    type: "image",
    sortOrder: row.sort_order,
    src: row.image_src ?? "",
    width: row.image_width ?? 0,
    height: row.image_height ?? 0,
    createdAt: row.created_at,
  } satisfies ImageBlock
}

function getNextSortOrder(pageId: string): number {
  const maxSortOrderRow = selectMaxSortOrderByPageId.get(pageId) as MaxSortOrderRow | null

  return (maxSortOrderRow?.max_sort_order ?? -1) + 1
}

function pageExists(pageId: string): boolean {
  return Boolean(selectPageById.get(pageId) as PageExistsRow | null)
}

export function getBlocksByPageId(pageId: string): Block[] {
  return (selectBlocksByPageId.all(pageId) as BlockRow[]).map(mapBlockRow)
}

export function createBlock(pageId: string, input: CreateBlockInput): Block | null {
  if (!pageExists(pageId)) {
    return null
  }

  const now = new Date().toISOString()
  const sortOrder = getNextSortOrder(pageId)

  if (input.type === "text") {
    const block: TextBlock = {
      id: crypto.randomUUID(),
      pageId,
      type: "text",
      sortOrder,
      style: input.style,
      value: input.value.trim(),
      createdAt: now,
    }

    insertBlock.run(
      block.id,
      block.pageId,
      block.type,
      block.sortOrder,
      block.style,
      block.value,
      null,
      null,
      null,
      block.createdAt
    )

    return block
  }

  const block: ImageBlock = {
    id: crypto.randomUUID(),
    pageId,
    type: "image",
    sortOrder,
    src: input.src.trim(),
    width: input.width,
    height: input.height,
    createdAt: now,
  }

  insertBlock.run(
    block.id,
    block.pageId,
    block.type,
    block.sortOrder,
    null,
    null,
    block.src,
    block.width,
    block.height,
    block.createdAt
  )

  return block
}

export function updateBlock(blockId: string, input: UpdateBlockInput): Block | null {
  const existingBlockRow = selectBlockById.get(blockId) as BlockRow | null

  if (!existingBlockRow) {
    return null
  }

  if (input.type === "text") {
    const block: TextBlock = {
      id: existingBlockRow.id,
      pageId: existingBlockRow.page_id,
      type: "text",
      sortOrder: existingBlockRow.sort_order,
      style: input.style,
      value: input.value.trim(),
      createdAt: existingBlockRow.created_at,
    }

    updateTextBlockStatement.run(block.id, block.type, block.style, block.value)

    return block
  }

  const block: ImageBlock = {
    id: existingBlockRow.id,
    pageId: existingBlockRow.page_id,
    type: "image",
    sortOrder: existingBlockRow.sort_order,
    src: input.src.trim(),
    width: input.width,
    height: input.height,
    createdAt: existingBlockRow.created_at,
  }

  updateImageBlockStatement.run(block.id, block.type, block.src, block.width, block.height)

  return block
}

export function deleteBlocksByPageId(pageId: string) {
  deleteBlocksByPageIdStatement.run(pageId)
}
