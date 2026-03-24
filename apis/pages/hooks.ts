'use client'

import { useMutation } from "@tanstack/react-query"

import { createPage } from "@/apis/pages/api"
import type { CreatePageInput, CreatePageResponse } from "@/apis/pages/types"

export function useCreatePageMutation() {
  return useMutation<CreatePageResponse, Error, CreatePageInput>({
    mutationFn: createPage,
  })
}
