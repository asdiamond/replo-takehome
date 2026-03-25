import type { DeletePageResponse, GetPageResponse } from "@/apis/pages/types"
import { deletePage, getPage } from "@/server/pages_db"

type RouteContext = {
  params: Promise<{ pageId: string }> | { pageId: string }
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { pageId } = await params
  const page = getPage(pageId)

  if (!page) {
    return Response.json({ error: "Page not found" }, { status: 404 })
  }

  const response: GetPageResponse = {
    page,
  }

  return Response.json(response)
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
