import type {
  CreatePageInput,
  CreatePageResponse,
  ListPagesResponse,
} from "@/apis/pages/types"
import { createPage, getPages } from "@/server/pages_db"

export async function GET() {
  const response: ListPagesResponse = {
    pages: getPages(),
  }

  return Response.json(response)
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreatePageInput

  const response: CreatePageResponse = {
    page: createPage(body),
  }

  return Response.json(response, { status: 201 })
}
