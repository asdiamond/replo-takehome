'use client'

import { Pencil, Plus } from "lucide-react"
import { type FormEvent, useState } from "react"

import { useBlocksQuery, useCreateBlockMutation, useUpdateBlockMutation } from "@/apis/blocks/hooks"
import type {
  Block,
  CreateBlockInput,
  ImageBlock,
  TextBlock,
  TextBlockStyle,
  UpdateBlockInput,
} from "@/apis/blocks/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type PageBlocksProps = {
  pageId: string
}

type BlockFormProps = {
  allowTypeSelection: boolean
  errorMessage?: string
  initialValues?: CreateBlockInput
  isPending: boolean
  submitLabel: string
  onCancel: () => void
  onSubmit: (input: CreateBlockInput | UpdateBlockInput) => void
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

  return (
    <section className="mt-12 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium text-foreground">Content</h2>
          <p className="text-sm text-muted-foreground">
            Hover over a block to edit it, or add a new one.
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
        <BlockForm
          allowTypeSelection
          errorMessage={createBlockMutation.error?.message}
          isPending={createBlockMutation.isPending}
          submitLabel="Create block"
          onCancel={() => setIsAddingBlock(false)}
          onSubmit={(input) => {
            createBlockMutation.mutate(input as CreateBlockInput, {
              onSuccess: () => {
                setIsAddingBlock(false)
              },
            })
          }}
        />
      ) : null}

      <div className="flex flex-col gap-2">
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
          <EditableBlockRow key={block.id} block={block} pageId={pageId} />
        ))}
      </div>
    </section>
  )
}

function EditableBlockRow({ block, pageId }: { block: Block; pageId: string }) {
  const updateBlockMutation = useUpdateBlockMutation(pageId)
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="group/block grid grid-cols-[32px_minmax(0,1fr)] gap-3 rounded-xl px-1 py-1">
      <div className="flex min-h-8 items-start justify-center pt-1">
        {isEditing ? (
          <div className="mt-2 size-2 rounded-full bg-border" />
        ) : (
          <Button
            aria-label={`Edit ${block.type} block`}
            className="opacity-0 transition-opacity group-hover/block:opacity-100 group-focus-within/block:opacity-100"
            size="icon-xs"
            variant="ghost"
            onClick={() => setIsEditing(true)}
          >
            <Pencil />
          </Button>
        )}
      </div>

      <div className="min-w-0">
        {isEditing ? (
          <BlockForm
            allowTypeSelection={false}
            errorMessage={updateBlockMutation.error?.message}
            initialValues={getInitialValues(block)}
            isPending={updateBlockMutation.isPending}
            submitLabel="Save"
            onCancel={() => setIsEditing(false)}
            onSubmit={(input) => {
              updateBlockMutation.mutate(
                { blockId: block.id, input: input as UpdateBlockInput },
                {
                  onSuccess: () => {
                    setIsEditing(false)
                  },
                }
              )
            }}
          />
        ) : (
          <BlockRenderer block={block} />
        )}
      </div>
    </div>
  )
}

function BlockForm({
  allowTypeSelection,
  errorMessage,
  initialValues,
  isPending,
  submitLabel,
  onCancel,
  onSubmit,
}: BlockFormProps) {
  const initialTextValues =
    initialValues?.type === "text"
      ? initialValues
      : { type: "text" as const, style: "p" as TextBlockStyle, value: "" }
  const initialImageValues =
    initialValues?.type === "image"
      ? initialValues
      : { type: "image" as const, src: "", width: 640, height: 360 }

  const [blockType, setBlockType] = useState<"text" | "image">(initialValues?.type ?? "text")
  const [textStyle, setTextStyle] = useState<TextBlockStyle>(initialTextValues.style)
  const [textValue, setTextValue] = useState(initialTextValues.value)
  const [imageSrc, setImageSrc] = useState(initialImageValues.src)
  const [imageWidth, setImageWidth] = useState(String(initialImageValues.width))
  const [imageHeight, setImageHeight] = useState(String(initialImageValues.height))

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const input: CreateBlockInput | UpdateBlockInput =
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

    onSubmit(input)
  }

  return (
    <form
      className="flex flex-col gap-4 rounded-2xl border bg-card p-5"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {allowTypeSelection ? (
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
        ) : (
          <div className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-foreground">Block type</span>
            <div className="flex h-10 items-center rounded-lg border border-input px-3 text-sm text-muted-foreground">
              {blockType === "text" ? "Text" : "Image"}
            </div>
          </div>
        )}

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
        ) : (
          <div />
        )}
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

      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button disabled={isPending} type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

function BlockRenderer({ block }: { block: Block }) {
  if (block.type === "text") {
    return <TextBlockView block={block} />
  }

  return <ImageBlockView block={block} />
}

function TextBlockView({ block }: { block: TextBlock }) {
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

function ImageBlockView({ block }: { block: ImageBlock }) {
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

function getInitialValues(block: Block): CreateBlockInput {
  if (block.type === "text") {
    return {
      type: "text",
      style: block.style,
      value: block.value,
    }
  }

  return {
    type: "image",
    src: block.src,
    width: block.width,
    height: block.height,
  }
}
