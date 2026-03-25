import type { DeletePageResponse } from "@/apis/pages/types"
import { deletePage } from "@/server/pages_db"

type RouteContext = {
  params: Promise<{ pageId: string }> | { pageId: string }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { pageId } = await params
  const page = deletePage(pageId)

  if (!page) {
    return Response.json({ error: "Page not found" }, { status: 404 })
  }

  const response: DeletePageResponse = {
    page,
  }

  return Response.json(response)
}
