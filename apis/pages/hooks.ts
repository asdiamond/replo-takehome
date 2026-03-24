'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { createPage, getPages } from "@/apis/pages/api"
import type {
  CreatePageInput,
  CreatePageResponse,
  ListPagesResponse,
  Page,
} from "@/apis/pages/types"

export const pagesQueryKey = ["pages"]

export function usePagesQuery() {
  return useQuery<ListPagesResponse, Error>({
    queryKey: pagesQueryKey,
    queryFn: getPages,
  })
}

export function useCreatePageMutation() {
  const queryClient = useQueryClient()

  return useMutation<CreatePageResponse, Error, CreatePageInput>({
    mutationFn: createPage,
    onSuccess: ({ page }) => {
      queryClient.setQueryData<ListPagesResponse>(pagesQueryKey, (currentData) => {
        const currentPages = currentData?.pages ?? []

        return {
          pages: [...currentPages, page as Page],
        }
      })
    },
  })
}
