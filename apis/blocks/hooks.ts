'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { createBlock, getBlocks } from "@/apis/blocks/api"
import type {
  Block,
  CreateBlockInput,
  CreateBlockResponse,
  ListBlocksResponse,
} from "@/apis/blocks/types"

export function getBlocksQueryKey(pageId: string) {
  return ["pages", pageId, "blocks"] as const
}

export function useBlocksQuery(pageId: string) {
  return useQuery<ListBlocksResponse, Error>({
    queryKey: getBlocksQueryKey(pageId),
    queryFn: () => getBlocks(pageId),
  })
}

export function useCreateBlockMutation(pageId: string) {
  const queryClient = useQueryClient()

  return useMutation<CreateBlockResponse, Error, CreateBlockInput>({
    mutationFn: (input) => createBlock(pageId, input),
    onSuccess: ({ block }) => {
      queryClient.setQueryData<ListBlocksResponse>(getBlocksQueryKey(pageId), (currentData) => {
        const currentBlocks = currentData?.blocks ?? []

        return {
          blocks: [...currentBlocks, block as Block],
        }
      })
    },
  })
}
