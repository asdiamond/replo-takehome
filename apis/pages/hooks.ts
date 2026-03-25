'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { createPage, deletePage, getPage, getPages } from "@/apis/pages/api"
import type {
  CreatePageInput,
  CreatePageResponse,
  DeletePageResponse,
  GetPageResponse,
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

export function usePageQuery(pageId: string) {
  return useQuery<GetPageResponse, Error>({
    queryKey: [...pagesQueryKey, pageId],
    queryFn: () => getPage(pageId),
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

export function useDeletePageMutation() {
  const queryClient = useQueryClient()

  return useMutation<DeletePageResponse, Error, string>({
    mutationFn: deletePage,
    onSuccess: ({ page }) => {
      queryClient.setQueryData<ListPagesResponse>(pagesQueryKey, (currentData) => {
        const currentPages = currentData?.pages ?? []

        return {
          pages: currentPages.filter((currentPage) => currentPage.id !== page.id),
        }
      })
    },
  })
}
