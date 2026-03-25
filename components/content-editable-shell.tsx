import { Fragment, type ReactNode } from "react"

type ContentEditableShellProps = {
  editContent: ReactNode
  identity: string
  isEditing: boolean
  previewContent: ReactNode
}

export function ContentEditableShell({
  editContent,
  identity,
  isEditing,
  previewContent,
}: ContentEditableShellProps) {
  if (isEditing) {
    return <Fragment key={`edit-${identity}`}>{editContent}</Fragment>
  }

  return <Fragment key={`preview-${identity}`}>{previewContent}</Fragment>
}
