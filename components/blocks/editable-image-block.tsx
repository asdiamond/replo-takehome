'use client'

import { type FormEvent, useState } from "react"

import { useUpdateBlockMutation } from "@/apis/blocks/hooks"
import type { ImageBlock } from "@/apis/blocks/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import { DEFAULT_IMAGE_HEIGHT, DEFAULT_IMAGE_WIDTH } from "./constants"
import { ImageBlockView } from "./image-block-view"

type EditableImageBlockProps = {
  block: ImageBlock
  onAutoOpenHandled: () => void
  pageId: string
  shouldAutoOpenModal: boolean
}

export function EditableImageBlock({
  block,
  pageId,
  shouldAutoOpenModal,
  onAutoOpenHandled,
}: EditableImageBlockProps) {
  const updateBlockMutation = useUpdateBlockMutation(pageId)
  const [isEditing, setIsEditing] = useState(false)
  const [imageSrc, setImageSrc] = useState(block.src)
  const [imageWidth, setImageWidth] = useState(String(block.width || DEFAULT_IMAGE_WIDTH))
  const [imageHeight, setImageHeight] = useState(String(block.height || DEFAULT_IMAGE_HEIGHT))

  function resetDraft() {
    setImageSrc(block.src)
    setImageWidth(String(block.width || DEFAULT_IMAGE_WIDTH))
    setImageHeight(String(block.height || DEFAULT_IMAGE_HEIGHT))
  }

  function openEditor() {
    updateBlockMutation.reset()
    resetDraft()
    setIsEditing(true)
  }

  function closeEditor() {
    updateBlockMutation.reset()
    setIsEditing(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    updateBlockMutation.mutate(
      {
        blockId: block.id,
        input: {
          type: "image",
          src: imageSrc,
          width: Number(imageWidth),
          height: Number(imageHeight),
        },
      },
      { onSuccess: () => setIsEditing(false) }
    )
  }

  return (
    <div className="min-w-0 rounded-xl px-1 py-1">
      <div
        className="cursor-pointer rounded-xl transition-colors hover:bg-muted/30 focus-visible:bg-muted/30"
        role="button"
        tabIndex={0}
        onClick={openEditor}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            openEditor()
          }
        }}
      >
        <ImageBlockView block={block} />
      </div>

      <Dialog
        open={isEditing || shouldAutoOpenModal}
        onOpenChange={(open) => {
          if (open) {
            openEditor()
            return
          }
          closeEditor()
        }}
      >
        <DialogContent
          className="max-w-xl gap-5 p-0"
          onOpenAutoFocus={() => {
            if (shouldAutoOpenModal) {
              updateBlockMutation.reset()
              onAutoOpenHandled()
            }
          }}
        >
          <form className="flex flex-col gap-5 p-5" onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{block.src.trim() ? "Edit image" : "Add an image"}</DialogTitle>
              <DialogDescription>
                Add an image URL and size for this block. Leave the source empty to keep the placeholder.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium text-foreground">Image source</span>
                <Input
                  placeholder="https://example.com/image.png"
                  value={imageSrc}
                  onChange={(event) => setImageSrc(event.target.value)}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm">
                  <span className="font-medium text-foreground">Width</span>
                  <Input
                    required
                    min={1}
                    type="number"
                    value={imageWidth}
                    onChange={(event) => setImageWidth(event.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm">
                  <span className="font-medium text-foreground">Height</span>
                  <Input
                    required
                    min={1}
                    type="number"
                    value={imageHeight}
                    onChange={(event) => setImageHeight(event.target.value)}
                  />
                </label>
              </div>
            </div>

            {updateBlockMutation.error ? (
              <p className="text-sm text-destructive">{updateBlockMutation.error.message}</p>
            ) : null}

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={closeEditor}>
                Cancel
              </Button>
              <Button disabled={updateBlockMutation.isPending} type="submit">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
