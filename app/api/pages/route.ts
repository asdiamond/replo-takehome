import type { CreatePageInput, CreatePageResponse } from "@/apis/pages/types"

export async function POST(request: Request) {
  const body = (await request.json()) as CreatePageInput
  const title = body.title?.trim() || "Untitled"

  const response: CreatePageResponse = {
    page: {
      id: crypto.randomUUID(),
      title,
      createdAt: new Date().toISOString(),
    },
  }

  return Response.json(response, { status: 201 })
}
