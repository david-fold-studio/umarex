import React from "react"

export function StyledTableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md overflow-x-auto border-t border-b border-gray-200">
      {children}
    </div>
  )
} 