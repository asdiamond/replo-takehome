'use client'

import { Plus } from "lucide-react"
import { type FormEvent, useState } from "react"

import { useBlocksQuery, useCreateBlockMutation } from "@/apis/blocks/hooks"
import type { Block, CreateBlockInput, TextBlockStyle } from "@/apis/blocks/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type PageBlocksProps = {
  pageId: string
}

const textStyleOptions: Array<{ label: string; value: TextBlockStyle }> = [
  { label: "Heading 1", value: "h1" },
  { label: "Heading 2", value: "h2" },
  { label: "Heading 3", value: "h3" },
  { label: "Paragraph", value: "p" },
]

export function PageBlocks({ pageId }: PageBlocksProps) {
  const blocksQuery = useBlocksQuery(pageId)
  const createBlockMutation = useCreateBlockMutation(pageId)
  const [isAddingBlock, setIsAddingBlock] = useState(false)
  const [blockType, setBlockType] = useState<"text" | "image">("text")
  const [textStyle, setTextStyle] = useState<TextBlockStyle>("p")
  const [textValue, setTextValue] = useState("")
  const [imageSrc, setImageSrc] = useState("")
  const [imageWidth, setImageWidth] = useState("640")
  const [imageHeight, setImageHeight] = useState("360")

  function resetForm() {
    setBlockType("text")
    setTextStyle("p")
    setTextValue("")
    setImageSrc("")
    setImageWidth("640")
    setImageHeight("360")
  }

  function handleCancel() {
    resetForm()
    setIsAddingBlock(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const input: CreateBlockInput =
      blockType === "text"
        ? {
            type: "text",
            style: textStyle,
            value: textValue,
          }
        : {
            type: "image",
            src: imageSrc,
            width: Number(imageWidth),
            height: Number(imageHeight),
          }

    createBlockMutation.mutate(input, {
      onSuccess: () => {
        handleCancel()
      },
    })
  }

  return (
    <section className="mt-12 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium text-foreground">Content</h2>
          <p className="text-sm text-muted-foreground">
            Add simple text and image blocks to this page.
          </p>
        </div>
        {!isAddingBlock ? (
          <Button onClick={() => setIsAddingBlock(true)}>
            <Plus />
            Add block
          </Button>
        ) : null}
      </div>

      {isAddingBlock ? (
        <form
          className="flex flex-col gap-4 rounded-2xl border bg-card p-5"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-foreground">Block type</span>
              <select
                className="h-10 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                value={blockType}
                onChange={(event) => setBlockType(event.target.value as "text" | "image")}
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
              </select>
            </label>

            {blockType === "text" ? (
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium text-foreground">Text style</span>
                <select
                  className="h-10 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  value={textStyle}
                  onChange={(event) => setTextStyle(event.target.value as TextBlockStyle)}
                >
                  {textStyleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>

          {blockType === "text" ? (
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-foreground">Text value</span>
              <textarea
                required
                className="min-h-28 rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                placeholder="Write something..."
                value={textValue}
                onChange={(event) => setTextValue(event.target.value)}
              />
            </label>
          ) : (
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_140px_140px]">
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium text-foreground">Image source</span>
                <Input
                  required
                  placeholder="https://example.com/image.png"
                  value={imageSrc}
                  onChange={(event) => setImageSrc(event.target.value)}
                />
              </label>
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
          )}

          {createBlockMutation.error ? (
            <p className="text-sm text-destructive">{createBlockMutation.error.message}</p>
          ) : null}

          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button disabled={createBlockMutation.isPending} type="submit">
              Create block
            </Button>
          </div>
        </form>
      ) : null}

      <div className="flex flex-col gap-4">
        {blocksQuery.isLoading ? (
          <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
            Loading blocks...
          </div>
        ) : null}

        {blocksQuery.error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
            {blocksQuery.error.message}
          </div>
        ) : null}

        {!blocksQuery.isLoading && !blocksQuery.error && blocksQuery.data?.blocks.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
            No blocks yet. Use the + button to add your first one.
          </div>
        ) : null}

        {blocksQuery.data?.blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>
    </section>
  )
}

function BlockRenderer({ block }: { block: Block }) {
  if (block.type === "text") {
    switch (block.style) {
      case "h1":
        return <h2 className="text-4xl font-semibold tracking-tight">{block.value}</h2>
      case "h2":
        return <h3 className="text-3xl font-semibold tracking-tight">{block.value}</h3>
      case "h3":
        return <h4 className="text-2xl font-semibold tracking-tight">{block.value}</h4>
      default:
        return <p className="text-base leading-7 text-foreground/90">{block.value}</p>
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* A plain img keeps arbitrary user-provided URLs working for this MVP. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        className="max-w-full rounded-2xl border object-cover"
        height={block.height}
        src={block.src}
        width={block.width}
      />
      <p className="text-sm text-muted-foreground">
        {block.width} x {block.height}
      </p>
    </div>
  )
}
