'use client'

import { Pencil, Plus } from "lucide-react"
import { type FormEvent, type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react"

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

type EditableImageBlockRowProps = {
  block: ImageBlock
  pageId: string
}

type EditableTextBlockRowProps = {
  block: TextBlock
  pageId: string
}

type SlashCommandOption = {
  label: string
  value: TextBlockStyle
  keywords: string[]
}

const textStyleOptions: Array<{ label: string; value: TextBlockStyle }> = [
  { label: "Heading 1", value: "h1" },
  { label: "Heading 2", value: "h2" },
  { label: "Heading 3", value: "h3" },
  { label: "Paragraph", value: "p" },
]

const slashCommandOptions: SlashCommandOption[] = [
  { label: "Heading 1", value: "h1", keywords: ["h1", "heading1", "heading", "title", "large"] },
  { label: "Heading 2", value: "h2", keywords: ["h2", "heading2", "heading", "medium"] },
  { label: "Heading 3", value: "h3", keywords: ["h3", "heading3", "heading", "small"] },
  { label: "Paragraph", value: "p", keywords: ["p", "paragraph", "text", "body"] },
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
            Click into a text block to edit inline, or add a new block.
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
  if (block.type === "text") {
    return <EditableTextBlockRow block={block} pageId={pageId} />
  }

  return <EditableImageBlockRow block={block} pageId={pageId} />
}

function EditableTextBlockRow({ block, pageId }: EditableTextBlockRowProps) {
  const updateBlockMutation = useUpdateBlockMutation(pageId)
  const [isEditing, setIsEditing] = useState(false)
  const [draftValue, setDraftValue] = useState(block.value)
  const [draftStyle, setDraftStyle] = useState<TextBlockStyle>(block.style)
  const contentRef = useRef<HTMLDivElement>(null)
  const skipBlurSaveRef = useRef(false)

  useEffect(() => {
    if (!isEditing || !contentRef.current || contentRef.current.textContent === draftValue) {
      return
    }

    contentRef.current.textContent = draftValue
    focusEditableAtEnd(contentRef.current)
  }, [draftValue, isEditing])

  const slashCommandState = useMemo(() => getSlashCommandState(draftValue), [draftValue])
  const visibleSlashCommands = useMemo(() => {
    if (!slashCommandState) {
      return []
    }

    const query = slashCommandState.query.trim().toLowerCase()

    return slashCommandOptions.filter((option) => {
      if (!query) {
        return true
      }

      return (
        option.label.toLowerCase().includes(query) ||
        option.keywords.some((keyword) => keyword.includes(query))
      )
    })
  }, [slashCommandState])

  function startEditing() {
    updateBlockMutation.reset()
    setDraftValue(block.value)
    setDraftStyle(block.style)
    setIsEditing(true)
  }

  function handleInput() {
    const nextValue = getEditableText(contentRef.current, draftValue)
    setDraftValue(nextValue)
  }

  function handleCancelEditing() {
    skipBlurSaveRef.current = true
    updateBlockMutation.reset()
    setDraftValue(block.value)
    setDraftStyle(block.style)
    setIsEditing(false)
    contentRef.current?.blur()
  }

  function handleSlashCommandSelect(style: TextBlockStyle) {
    const nextValue = slashCommandState?.remainder ?? draftValue

    setDraftStyle(style)
    setDraftValue(nextValue)

    if (contentRef.current) {
      contentRef.current.textContent = nextValue
      focusEditableAtEnd(contentRef.current)
    }
  }

  function saveDraft() {
    const nextValue = getEditableText(contentRef.current, draftValue)
    const hasChanges = nextValue !== block.value || draftStyle !== block.style

    setDraftValue(nextValue)

    if (!hasChanges) {
      setIsEditing(false)
      return
    }

    updateBlockMutation.mutate(
      {
        blockId: block.id,
        input: {
          type: "text",
          style: draftStyle,
          value: nextValue,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false)
        },
      }
    )
  }

  function handleBlur() {
    if (skipBlurSaveRef.current) {
      skipBlurSaveRef.current = false
      return
    }

    saveDraft()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault()
      handleCancelEditing()
      return
    }

    if (event.key === "Enter") {
      event.preventDefault()

      if (visibleSlashCommands.length > 0) {
        handleSlashCommandSelect(visibleSlashCommands[0].value)
        return
      }

      contentRef.current?.blur()
    }
  }

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
            onClick={startEditing}
          >
            <Pencil />
          </Button>
        )}
      </div>

      <div className="relative min-w-0">
        {isEditing ? (
          <>
            <div
              ref={contentRef}
              className={`${getTextBlockClassName(draftStyle)} min-h-8 cursor-text rounded-md px-1 py-0.5 whitespace-pre-wrap outline-none`}
              contentEditable
              role="textbox"
              suppressContentEditableWarning
              tabIndex={0}
              onBlur={handleBlur}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
            />

            {visibleSlashCommands.length > 0 ? (
              <div className="absolute top-full left-0 z-20 mt-2 w-56 rounded-xl border bg-popover p-2 shadow-sm">
                <div className="px-2 pb-1 text-xs font-medium text-muted-foreground">
                  Turn into
                </div>
                <div className="flex flex-col gap-1">
                  {visibleSlashCommands.map((option) => (
                    <button
                      key={option.value}
                      className="rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted"
                      type="button"
                      onClick={() => handleSlashCommandSelect(option.value)}
                      onMouseDown={(event) => {
                        event.preventDefault()
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {updateBlockMutation.error ? (
              <p className="mt-2 text-sm text-destructive">
                {updateBlockMutation.error.message}
              </p>
            ) : null}
          </>
        ) : (
          <div
            className="cursor-text rounded-md px-1 py-0.5"
            role="button"
            tabIndex={0}
            onClick={startEditing}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                startEditing()
              }
            }}
          >
            <TextBlockView block={block} />
          </div>
        )}
      </div>
    </div>
  )
}

function EditableImageBlockRow({ block, pageId }: EditableImageBlockRowProps) {
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
          <ImageBlockView block={block} />
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

function TextBlockView({ block }: { block: TextBlock }) {
  return <div className={`${getTextBlockClassName(block.style)} whitespace-pre-wrap`}>{block.value}</div>
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

function getTextBlockClassName(style: TextBlockStyle): string {
  switch (style) {
    case "h1":
      return "text-4xl font-semibold tracking-tight"
    case "h2":
      return "text-3xl font-semibold tracking-tight"
    case "h3":
      return "text-2xl font-semibold tracking-tight"
    default:
      return "text-base leading-7 text-foreground/90"
  }
}

function getEditableText(element: HTMLDivElement | null, fallback: string): string {
  return element?.textContent?.replace(/\u00a0/g, " ") ?? fallback
}

function getSlashCommandState(value: string): { query: string; remainder: string } | null {
  const trimmedValue = value.trimStart()

  if (!trimmedValue.startsWith("/")) {
    return null
  }

  const commandText = trimmedValue.slice(1)
  const firstWhitespaceIndex = commandText.search(/\s/)

  if (firstWhitespaceIndex === -1) {
    return {
      query: commandText.toLowerCase(),
      remainder: "",
    }
  }

  return {
    query: commandText.slice(0, firstWhitespaceIndex).toLowerCase(),
    remainder: commandText.slice(firstWhitespaceIndex).trimStart(),
  }
}

function focusEditableAtEnd(element: HTMLDivElement) {
  element.focus()

  const selection = window.getSelection()

  if (!selection) {
    return
  }

  const range = document.createRange()
  range.selectNodeContents(element)
  range.collapse(false)
  selection.removeAllRanges()
  selection.addRange(range)
}
