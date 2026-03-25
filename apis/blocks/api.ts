import type {
  CreateBlockInput,
  CreateBlockResponse,
  ListBlocksResponse,
} from "@/apis/blocks/types"

export async function getBlocks(pageId: string): Promise<ListBlocksResponse> {
  const response = await fetch(`/api/pages/${pageId}/blocks`)

  if (!response.ok) {
    throw new Error(response.status === 404 ? "Page not found" : "Failed to load blocks")
  }

  return response.json()
}

export async function createBlock(
  pageId: string,
  input: CreateBlockInput
): Promise<CreateBlockResponse> {
  const response = await fetch(`/api/pages/${pageId}/blocks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(response.status === 404 ? "Page not found" : "Failed to create block")
  }

  return response.json()
}
