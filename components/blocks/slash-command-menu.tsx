import type { SlashCommandOption, SlashCommandValue } from "./constants"

type SlashCommandMenuProps = {
  options: SlashCommandOption[]
  onSelect: (value: SlashCommandValue) => void
}

export function SlashCommandMenu({ options, onSelect }: SlashCommandMenuProps) {
  if (options.length === 0) {
    return null
  }

  return (
    <div className="absolute top-full left-0 z-20 mt-2 w-56 rounded-xl border bg-popover p-2 shadow-sm">
      <div className="px-2 pb-1 text-xs font-medium text-muted-foreground">Turn into</div>
      <div className="flex flex-col gap-1">
        {options.map((option) => (
          <button
            key={option.value}
            className="rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted"
            type="button"
            onClick={() => onSelect(option.value)}
            onMouseDown={(event) => event.preventDefault()}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
