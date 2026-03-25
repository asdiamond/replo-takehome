import type {
  TextBlockStyle,
  UpdateBlockInput,
  UpdateBlockResponse,
} from "@/apis/blocks/types"
import { updateBlock } from "@/server/blocks_db"

type RouteContext = {
  params: Promise<{ blockId: string }> | { blockId: string }
}

const textBlockStyles: TextBlockStyle[] = ["h1", "h2", "h3", "p"]

function isTextBlockStyle(value: unknown): value is TextBlockStyle {
  return typeof value === "string" && textBlockStyles.includes(value as TextBlockStyle)
}

function parseUpdateBlockInput(body: unknown): UpdateBlockInput | null {
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

export async function PATCH(request: Request, { params }: RouteContext) {
  const { blockId } = await params
  const input = parseUpdateBlockInput(await request.json())

  if (!input) {
    return Response.json({ error: "Invalid block payload" }, { status: 400 })
  }

  const block = updateBlock(blockId, input)

  if (!block) {
    return Response.json({ error: "Block not found" }, { status: 404 })
  }

  const response: UpdateBlockResponse = {
    block,
  }

  return Response.json(response)
}
