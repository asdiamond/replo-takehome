'use client'

import { ImageIcon } from "lucide-react"
import { useState } from "react"

import type { ImageBlock } from "@/apis/blocks/types"

import { DEFAULT_IMAGE_HEIGHT, DEFAULT_IMAGE_WIDTH } from "./constants"

export function ImageBlockView({ block }: { block: ImageBlock }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const width = block.width || DEFAULT_IMAGE_WIDTH
  const height = block.height || DEFAULT_IMAGE_HEIGHT
  const hasImage = block.src.trim().length > 0 && failedSrc !== block.src

  if (!hasImage) {
    return (
      <div className="flex w-full items-center gap-3 rounded-lg bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
        <ImageIcon className="size-5 shrink-0" />
        <span>{block.src.trim() ? "Image unavailable" : "Add an image"}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        className="max-w-full rounded-2xl border object-cover"
        height={height}
        onError={() => setFailedSrc(block.src)}
        src={block.src}
        width={width}
      />
      <p className="text-sm text-muted-foreground">
        {width} x {height}
      </p>
    </div>
  )
}
