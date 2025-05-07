import * as React from "react"
import { Input } from "@/components/ui/input"

interface PageToolbarProps {
  searchValue?: string
  onSearchChange?: (value: string) => void
  addButton?: React.ReactNode
  searchPlaceholder?: string
  children?: React.ReactNode
}

export function PageToolbar({ searchValue, onSearchChange, addButton, searchPlaceholder, children }: PageToolbarProps) {
  return (
    <div className="flex items-center gap-2 md:px-4 py-2 w-full">
      <div className="flex-1 flex items-center">
        <Input
          placeholder={searchPlaceholder || "Search..."}
          value={searchValue}
          onChange={e => onSearchChange && onSearchChange(e.target.value)}
          className="h-9 max-w-xs"
        />
      </div>
      <div className="flex items-center gap-2">
        {children}
        {addButton}
      </div>
    </div>
  )
} 