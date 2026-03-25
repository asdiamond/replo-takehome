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
      <div className="flex flex-col gap-3">
        <div
          className="flex w-full items-center gap-4 rounded-2xl border border-dashed bg-muted/40 px-6 py-5 text-left"
          style={{
            maxWidth: `${width}px`,
            minHeight: `${Math.max(Math.min(height, 260), 96)}px`,
          }}
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-background text-muted-foreground">
            <ImageIcon />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-medium text-foreground">
              {block.src.trim() ? "Image unavailable" : "Add an image"}
            </p>
            <p className="text-sm text-muted-foreground">
              {block.src.trim()
                ? "Click to update the image URL."
                : "Click to open the image settings."}
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {width} x {height}
        </p>
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
