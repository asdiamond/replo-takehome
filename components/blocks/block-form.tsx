'use client'

import { type FormEvent, useState } from "react"

import type { CreateBlockInput, TextBlockStyle, UpdateBlockInput } from "@/apis/blocks/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { DEFAULT_IMAGE_HEIGHT, DEFAULT_IMAGE_WIDTH, textStyleOptions } from "./constants"

type BlockFormProps = {
  allowTypeSelection: boolean
  errorMessage?: string
  initialValues?: CreateBlockInput
  isPending: boolean
  submitLabel: string
  onCancel: () => void
  onSubmit: (input: CreateBlockInput | UpdateBlockInput) => void
}

export function BlockForm({
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
      : { type: "image" as const, src: "", width: DEFAULT_IMAGE_WIDTH, height: DEFAULT_IMAGE_HEIGHT }

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
        ? { type: "text", style: textStyle, value: textValue }
        : { type: "image", src: imageSrc, width: Number(imageWidth), height: Number(imageHeight) }

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
