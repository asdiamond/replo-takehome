import type {
  CreatePageInput,
  CreatePageResponse,
  DeletePageResponse,
  GetPageResponse,
  ListPagesResponse,
  UpdatePageInput,
  UpdatePageResponse,
} from "@/apis/pages/types"

export async function getPages(): Promise<ListPagesResponse> {
  const response = await fetch("/api/pages")

  if (!response.ok) {
    throw new Error("Failed to load pages")
  }

  return response.json()
}

export async function getPage(pageId: string): Promise<GetPageResponse> {
  const response = await fetch(`/api/pages/${pageId}`)

  if (!response.ok) {
    throw new Error(response.status === 404 ? "Page not found" : "Failed to load page")
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

export async function deletePage(pageId: string): Promise<DeletePageResponse> {
  const response = await fetch(`/api/pages/${pageId}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error(response.status === 404 ? "Page not found" : "Failed to delete page")
  }

  return response.json()
}

export async function updatePage(
  pageId: string,
  input: UpdatePageInput
): Promise<UpdatePageResponse> {
  const response = await fetch(`/api/pages/${pageId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(response.status === 404 ? "Page not found" : "Failed to update page")
  }

  return response.json()
}
