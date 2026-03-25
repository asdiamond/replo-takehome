'use client'

import { type KeyboardEvent, useEffect, useRef, useState } from "react"

import { useUpdatePageMutation } from "@/apis/pages/hooks"

type PageTitleProps = {
  pageId: string
  initialTitle: string
}

// have to do some hacking with react here because we are using contentEditable
// we dont want react to re-render the title as we are editing it or the cursor will reset by the browser
export function PageTitle({ pageId, initialTitle }: PageTitleProps) {
  const updatePageMutation = useUpdatePageMutation(pageId)
  const [title, setTitle] = useState(initialTitle)
  const [isEditing, setIsEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(initialTitle)
  const contentRef = useRef<HTMLHeadingElement>(null)
  const skipBlurSaveRef = useRef(false)

  useEffect(() => {
    if (!isEditing || !contentRef.current || contentRef.current.textContent === draftTitle) {
      return
    }

    contentRef.current.textContent = draftTitle
    focusTitleAtEnd(contentRef.current)
  }, [draftTitle, isEditing])

  function startEditing() {
    if (isEditing) {
      return
    }

    updatePageMutation.reset()
    setDraftTitle(title)
    setIsEditing(true)
  }

  function handleInput() {
    setDraftTitle(getEditableTitle(contentRef.current, draftTitle))
  }

  function handleCancelEditing() {
    skipBlurSaveRef.current = true
    updatePageMutation.reset()
    setDraftTitle(title)
    setIsEditing(false)
    contentRef.current?.blur()
  }

  function saveTitle() {
    const nextTitle = getEditableTitle(contentRef.current, draftTitle)

    setDraftTitle(nextTitle)

    if (nextTitle === title) {
      setIsEditing(false)
      return
    }

    updatePageMutation.mutate(
      { title: nextTitle },
      {
        onSuccess: ({ page }) => {
          setTitle(page.title)
          setDraftTitle(page.title)
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

    saveTitle()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLHeadingElement>) {
    if (event.key === "Escape") {
      event.preventDefault()
      handleCancelEditing()
      return
    }

    if (event.key === "Enter") {
      event.preventDefault()
      contentRef.current?.blur()
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <h1
        ref={contentRef}
        className="text-5xl font-semibold tracking-tight outline-none md:text-6xl"
        contentEditable={isEditing}
        role="textbox"
        suppressContentEditableWarning
        tabIndex={0}
        onBlur={handleBlur}
        onClick={startEditing}
        onFocus={startEditing}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
      >
        {isEditing ? null : title}
      </h1>
      {updatePageMutation.error ? (
        <p className="text-sm text-destructive">{updatePageMutation.error.message}</p>
      ) : null}
    </div>
  )
}

function getEditableTitle(element: HTMLHeadingElement | null, fallback: string): string {
  return element?.textContent?.replace(/\u00a0/g, " ") ?? fallback
}

function focusTitleAtEnd(element: HTMLHeadingElement) {
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
