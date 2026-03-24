import type {
  CreatePageInput,
  CreatePageResponse,
  ListPagesResponse,
} from "@/apis/pages/types"

export async function getPages(): Promise<ListPagesResponse> {
  const response = await fetch("/api/pages")

  if (!response.ok) {
    throw new Error("Failed to load pages")
  }

  return response.json()
}

export async function createPage(
  input: CreatePageInput = {}
): Promise<CreatePageResponse> {
  const response = await fetch("/api/pages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error("Failed to create page")
  }

  return response.json()
}
