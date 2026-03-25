'use client'

import { Plus } from "lucide-react"
import { useState } from "react"

import { useBlocksQuery, useCreateBlockMutation } from "@/apis/blocks/hooks"
import type { Block, CreateBlockInput } from "@/apis/blocks/types"
import { Button } from "@/components/ui/button"

import { BlockForm } from "./blocks/block-form"
import { EditableImageBlock } from "./blocks/editable-image-block"
import { EditableTextBlock } from "./blocks/editable-text-block"

type PageBlocksProps = {
  pageId: string
}

export function PageBlocks({ pageId }: PageBlocksProps) {
  const blocksQuery = useBlocksQuery(pageId)
  const createBlockMutation = useCreateBlockMutation(pageId)
  const [autoOpenImageBlockId, setAutoOpenImageBlockId] = useState<string | null>(null)
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
              onSuccess: () => setIsAddingBlock(false),
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
          <EditableBlockRow
            key={block.id}
            autoOpenImageBlockId={autoOpenImageBlockId}
            block={block}
            pageId={pageId}
            onAutoOpenImageHandled={() => setAutoOpenImageBlockId(null)}
            onConvertToImage={(blockId) => setAutoOpenImageBlockId(blockId)}
          />
        ))}
      </div>
    </section>
  )
}

function EditableBlockRow({
  block,
  pageId,
  autoOpenImageBlockId,
  onAutoOpenImageHandled,
  onConvertToImage,
}: {
  block: Block
  pageId: string
  autoOpenImageBlockId: string | null
  onAutoOpenImageHandled: () => void
  onConvertToImage: (blockId: string) => void
}) {
  if (block.type === "text") {
    return <EditableTextBlock block={block} pageId={pageId} onConvertToImage={onConvertToImage} />
  }

  return (
    <EditableImageBlock
      block={block}
      pageId={pageId}
      shouldAutoOpenModal={autoOpenImageBlockId === block.id}
      onAutoOpenHandled={onAutoOpenImageHandled}
    />
  )
}
