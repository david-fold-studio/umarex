"use client"

import { Button } from "@/components/ui/button"
import { Table } from "@tanstack/react-table"

interface TablePaginationProps<TData> {
  table: Table<TData>
  selectedCount?: number
  totalCount?: number
  itemName?: string
}

export function TablePagination<TData>({
  table,
  selectedCount,
  totalCount,
  itemName = "item"
}: TablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between space-x-2 py-3 px-4">
      <div className="flex-1 text-sm text-muted-foreground">
        {selectedCount ?? table.getFilteredSelectedRowModel().rows.length} of {totalCount ?? table.getFilteredRowModel().rows.length} {itemName}(s) selected.
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => table.nextPage()} 
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
} 