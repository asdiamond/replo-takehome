import type { DeletePageResponse, GetPageResponse, UpdatePageInput, UpdatePageResponse } from "@/apis/pages/types"
import { deletePage, getPage, updatePage } from "@/server/pages_db"

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

export async function PATCH(request: Request, { params }: RouteContext) {
  const { pageId } = await params
  const body = (await request.json()) as Partial<UpdatePageInput>

  if (typeof body.title !== "string") {
    return Response.json({ error: "Invalid page payload" }, { status: 400 })
  }

  const page = updatePage(pageId, { title: body.title })

  if (!page) {
    return Response.json({ error: "Page not found" }, { status: 404 })
  }

  const response: UpdatePageResponse = {
    page,
  }

  return Response.json(response)
}
