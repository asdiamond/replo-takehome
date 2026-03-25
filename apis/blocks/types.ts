export type TextBlockStyle = "h1" | "h2" | "h3" | "p"

type BaseBlock = {
  id: string
  pageId: string
  sortOrder: number
  createdAt: string
}

export type TextBlock = BaseBlock & {
  type: "text"
  style: TextBlockStyle
  value: string
}

export type ImageBlock = BaseBlock & {
  type: "image"
  src: string
  width: number
  height: number
}

export type Block = TextBlock | ImageBlock

export type CreateTextBlockInput = {
  type: "text"
  style: TextBlockStyle
  value: string
}

export type CreateImageBlockInput = {
  type: "image"
  src: string
  width: number
  height: number
}

export type CreateBlockInput = CreateTextBlockInput | CreateImageBlockInput
export type UpdateBlockInput = CreateBlockInput

export type CreateBlockResponse = {
  block: Block
}

export type UpdateBlockResponse = {
  block: Block
}

export type ListBlocksResponse = {
  blocks: Block[]
}
