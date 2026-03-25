'use client'

import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react"

import { useUpdateBlockMutation } from "@/apis/blocks/hooks"
import type { TextBlock, TextBlockStyle } from "@/apis/blocks/types"
import { ContentEditableShell } from "@/components/content-editable-shell"

import {
  DEFAULT_IMAGE_HEIGHT,
  DEFAULT_IMAGE_WIDTH,
  EMPTY_TEXT_BLOCK_PLACEHOLDER,
  slashCommandOptions,
  type SlashCommandValue,
} from "./constants"
import { SlashCommandMenu } from "./slash-command-menu"
import { TextBlockView } from "./text-block-view"
import {
  focusEditableAtEnd,
  getEditableText,
  getSlashCommandState,
  getTextBlockClassName,
  hasTextBlockContent,
} from "./utils"

type EditableTextBlockProps = {
  block: TextBlock
  onConvertToImage: (blockId: string) => void
  pageId: string
}

/**
 * a text block that uses contentEditable for editing. 
 * provides a slash command menu for formatting. 
 * has 2 modes: editing and preview. 
 * 
 * we have to have a skipBlurSaveRef because otherwise blurs
 * from cancel/Escape or convert-to-image would trigger saveDraft() and
 * race against the reset or the conversion mutation. a ref is used instead of
 * state so the flag is readable synchronously in the blur handler without
 * causing a re-render.
 */
export function EditableTextBlock({ block, pageId, onConvertToImage }: EditableTextBlockProps) {
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
    if (!slashCommandState) return []

    const query = slashCommandState.query.trim().toLowerCase()
    return slashCommandOptions.filter(
      (option) =>
        !query ||
        option.label.toLowerCase().includes(query) ||
        option.keywords.some((keyword) => keyword.includes(query))
    )
  }, [slashCommandState])

  function startEditing() {
    updateBlockMutation.reset()
    setDraftValue(block.value)
    setDraftStyle(block.style)
    setIsEditing(true)
  }

  function handleInput() {
    setDraftValue(getEditableText(contentRef.current, draftValue))
  }

  function handleCancelEditing() {
    skipBlurSaveRef.current = true
    updateBlockMutation.reset()
    setDraftValue(block.value)
    setDraftStyle(block.style)
    setIsEditing(false)
    contentRef.current?.blur()
  }

  function handleSlashCommandSelect(command: SlashCommandValue) {
    if (command === "image") {
      skipBlurSaveRef.current = true
      updateBlockMutation.reset()
      updateBlockMutation.mutate(
        {
          blockId: block.id,
          input: {
            type: "image",
            src: "",
            width: DEFAULT_IMAGE_WIDTH,
            height: DEFAULT_IMAGE_HEIGHT,
          },
        },
        {
          onSuccess: ({ block: nextBlock }) => {
            setIsEditing(false)
            onConvertToImage(nextBlock.id)
          },
        }
      )
      return
    }

    const nextValue = slashCommandState?.remainder ?? draftValue
    setDraftStyle(command)
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
        input: { type: "text", style: draftStyle, value: nextValue },
      },
      { onSuccess: () => setIsEditing(false) }
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
    <div className="relative min-w-0 rounded-xl px-1 py-1">
      <ContentEditableShell
        identity={block.id}
        isEditing={isEditing}
        editContent={
          <>
            <div className="relative">
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
              {!hasTextBlockContent(draftValue) ? (
                <div
                  aria-hidden="true"
                  className={`${getTextBlockClassName(draftStyle)} pointer-events-none absolute inset-0 px-1 py-0.5 text-muted-foreground`}
                >
                  {EMPTY_TEXT_BLOCK_PLACEHOLDER}
                </div>
              ) : null}
            </div>

            <SlashCommandMenu options={visibleSlashCommands} onSelect={handleSlashCommandSelect} />

            {updateBlockMutation.error ? (
              <p className="mt-2 text-sm text-destructive">{updateBlockMutation.error.message}</p>
            ) : null}
          </>
        }
        previewContent={
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
        }
      />
    </div>
  )
}
