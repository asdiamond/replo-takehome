import type { TextBlockStyle } from "@/apis/blocks/types"

export function getTextBlockClassName(style: TextBlockStyle): string {
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

export function hasTextBlockContent(value: string): boolean {
  return value.trim().length > 0
}

export function getEditableText(element: HTMLDivElement | null, fallback: string): string {
  return element?.textContent?.replace(/\u00a0/g, " ") ?? fallback
}

export function getSlashCommandState(value: string): { query: string; remainder: string } | null {
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

export function focusEditableAtEnd(element: HTMLDivElement) {
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
