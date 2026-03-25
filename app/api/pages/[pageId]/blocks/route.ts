import type {
  CreateBlockInput,
  CreateBlockResponse,
  ListBlocksResponse,
  TextBlockStyle,
} from "@/apis/blocks/types"
import { createBlock, getBlocksByPageId } from "@/server/blocks_db"
import { getPage } from "@/server/pages_db"

type RouteContext = {
  params: Promise<{ pageId: string }> | { pageId: string }
}

const textBlockStyles: TextBlockStyle[] = ["h1", "h2", "h3", "p"]

function isTextBlockStyle(value: unknown): value is TextBlockStyle {
  return typeof value === "string" && textBlockStyles.includes(value as TextBlockStyle)
}

function parseCreateBlockInput(body: unknown): CreateBlockInput | null {
  if (!body || typeof body !== "object") {
    return null
  }

  const input = body as Record<string, unknown>

  if (input.type === "text") {
    if (!isTextBlockStyle(input.style) || typeof input.value !== "string") {
      return null
    }

    return {
      type: "text",
      style: input.style,
      value: input.value,
    }
  }

  if (input.type === "image") {
    if (
      typeof input.src !== "string" ||
      typeof input.width !== "number" ||
      typeof input.height !== "number" ||
      input.width < 1 ||
      input.height < 1
    ) {
      return null
    }

    return {
      type: "image",
      src: input.src,
      width: input.width,
      height: input.height,
    }
  }

  return null
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { pageId } = await params
  const page = getPage(pageId)

  if (!page) {
    return Response.json({ error: "Page not found" }, { status: 404 })
  }

  const response: ListBlocksResponse = {
    blocks: getBlocksByPageId(pageId),
  }

  return Response.json(response)
}

export async function POST(request: Request, { params }: RouteContext) {
  const { pageId } = await params
  const input = parseCreateBlockInput(await request.json())

  if (!input) {
    return Response.json({ error: "Invalid block payload" }, { status: 400 })
  }

  const block = createBlock(pageId, input)

  if (!block) {
    return Response.json({ error: "Page not found" }, { status: 404 })
  }

  const response: CreateBlockResponse = {
    block,
  }

  return Response.json(response, { status: 201 })
}
