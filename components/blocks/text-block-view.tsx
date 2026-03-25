import type { TextBlock } from "@/apis/blocks/types"

import { EMPTY_TEXT_BLOCK_PLACEHOLDER } from "./constants"
import { getTextBlockClassName, hasTextBlockContent } from "./utils"

export function TextBlockView({ block }: { block: TextBlock }) {
  if (!hasTextBlockContent(block.value)) {
    return (
      <div className={`${getTextBlockClassName(block.style)} whitespace-pre-wrap text-muted-foreground`}>
        {EMPTY_TEXT_BLOCK_PLACEHOLDER}
      </div>
    )
  }

  return <div className={`${getTextBlockClassName(block.style)} whitespace-pre-wrap`}>{block.value}</div>
}
