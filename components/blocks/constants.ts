import type { TextBlockStyle } from "@/apis/blocks/types"

export type SlashCommandValue = TextBlockStyle | "image"

export type SlashCommandOption = {
  label: string
  value: SlashCommandValue
  keywords: string[]
}

export const DEFAULT_IMAGE_WIDTH = 100
export const DEFAULT_IMAGE_HEIGHT = 100
export const EMPTY_TEXT_BLOCK_PLACEHOLDER = "/ for commands"

export const textStyleOptions: Array<{ label: string; value: TextBlockStyle }> = [
  { label: "Heading 1", value: "h1" },
  { label: "Heading 2", value: "h2" },
  { label: "Heading 3", value: "h3" },
  { label: "Paragraph", value: "p" },
]

export const slashCommandOptions: SlashCommandOption[] = [
  { label: "Heading 1", value: "h1", keywords: ["h1", "heading1", "heading", "title", "large"] },
  { label: "Heading 2", value: "h2", keywords: ["h2", "heading2", "heading", "medium"] },
  { label: "Heading 3", value: "h3", keywords: ["h3", "heading3", "heading", "small"] },
  { label: "Paragraph", value: "p", keywords: ["p", "paragraph", "text", "body"] },
  { label: "Image", value: "image", keywords: ["image", "photo", "picture", "media"] },
]
