import { Fragment, type ReactNode } from "react"

type ContentEditableShellProps = {
  editContent: ReactNode
  identity: string
  isEditing: boolean
  previewContent: ReactNode
}

// we are using a fragment to escape out of reacts reactivity for contentEditable
// if you dont do this, react and contentEditable will disagree and you'll get bad content
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
