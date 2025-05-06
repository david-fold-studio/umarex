"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, Check, Download, Pencil, Plus, RotateCcw, Search, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { type PricingItem, categories } from "@/app/dashboard/pricing-data"

// Extended PricingItem to track edited fields
interface ExtendedPricingItem extends PricingItem {
  editedFields?: Record<string, boolean>
}

// Interface for tracking which cell is being edited
interface EditableCellProps {
  getValue: () => any
  row: any
  column: any
  table: any
}

// Editable cell component for numeric values
const EditableNumberCell = ({ getValue, row, column, table }: EditableCellProps) => {
  const initialValue = getValue()
  const [value, setValue] = React.useState(initialValue)
  const [isEditing, setIsEditing] = React.useState(false)

  // Check if this field has been manually edited
  const isEdited = row.original.editedFields?.[column.id] === true

  // Update internal state when the value changes
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const onBlur = () => {
    // Only update if the value has changed
    if (value !== initialValue) {
      // Get the current data
      const newData = [...table.options.data]
      const index = newData.findIndex((item) => item.id === row.original.id)

      if (index !== -1) {
        // Update the specific field
        newData[index] = {
          ...newData[index],
          [column.id]: Number.parseFloat(value),
          // Track that this field has been edited
          editedFields: {
            ...(newData[index].editedFields || {}),
            [column.id]: true,
          },
        }

        // Recalculate cost price (sum of all costs)
        const costPrice =
          newData[index].importCost +
          newData[index].shippingCost +
          newData[index].customsDuty +
          newData[index].handlingFee

        newData[index].costPrice = Number.parseFloat(costPrice.toFixed(2))

        // Recalculate net profit and profit margin
        const netProfit = newData[index].salePrice - newData[index].costPrice
        newData[index].netProfit = Number.parseFloat(netProfit.toFixed(2))

        const profitMargin = (netProfit / newData[index].salePrice) * 100
        newData[index].profitMargin = Number.parseFloat(profitMargin.toFixed(2))

        // Update the table data
        table.options.meta?.updateData(newData)

        // Show success toast
        toast.success(`Updated ${row.original.name} ${column.id}`)
      }
    }
    setIsEditing(false)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur()
    } else if (e.key === "Escape") {
      setValue(initialValue)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          autoFocus
          className="h-8 w-24 text-right"
        />
        <div className="flex ml-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              onBlur()
            }}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              setValue(initialValue)
              setIsEditing(false)
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  // Format the value as currency
  const amount = Number.parseFloat(value)
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)

  return (
    <div className="flex items-center justify-end group">
      <div className={`font-medium ${isEdited ? "text-orange-500" : ""}`}>{formatted}</div>
      <div className="flex ml-2">
        {isEdited && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  // Get the current data
                  const newData = [...table.options.data]
                  const index = newData.findIndex((item) => item.id === row.original.id)

                  if (index !== -1) {
                    // Remove the edited flag for this field
                    const updatedEditedFields = { ...newData[index].editedFields }
                    delete updatedEditedFields[column.id]

                    // Reset to the original value from initialData
                    const originalItem = table.options.meta?.initialData?.find((item: PricingItem) => item.id === row.original.id)

                    if (originalItem) {
                      // Update the field with original value
                      newData[index] = {
                        ...newData[index],
                        [column.id]: originalItem[column.id],
                        editedFields: updatedEditedFields,
                      }

                      // Recalculate cost price (sum of all costs)
                      const costPrice =
                        newData[index].importCost +
                        newData[index].shippingCost +
                        newData[index].customsDuty +
                        newData[index].handlingFee

                      newData[index].costPrice = Number.parseFloat(costPrice.toFixed(2))

                      // Recalculate net profit and profit margin
                      const netProfit = newData[index].salePrice - newData[index].costPrice
                      newData[index].netProfit = Number.parseFloat(netProfit.toFixed(2))

                      const profitMargin = (netProfit / newData[index].salePrice) * 100
                      newData[index].profitMargin = Number.parseFloat(profitMargin.toFixed(2))

                      // Update the table data
                      table.options.meta?.updateData(newData)

                      // Show success toast
                      toast.success(`Reverted ${row.original.name} ${column.id} to original value`)
                    }
                  }
                }}
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              align="center"
              sideOffset={5}
            >
              Revert to inherited calculated value
            </TooltipContent>
          </Tooltip>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

// Editable cell component for sale price
const EditableSalePriceCell = ({ getValue, row, column, table }: EditableCellProps) => {
  const initialValue = getValue()
  const [value, setValue] = React.useState(initialValue)
  const [isEditing, setIsEditing] = React.useState(false)

  // Check if this field has been manually edited
  const isEdited = row.original.editedFields?.[column.id] === true

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const onBlur = () => {
    if (value !== initialValue) {
      const newData = [...table.options.data]
      const index = newData.findIndex((item) => item.id === row.original.id)

      if (index !== -1) {
        // Update sale price
        newData[index] = {
          ...newData[index],
          [column.id]: Number.parseFloat(value),
          // Track that this field has been edited
          editedFields: {
            ...(newData[index].editedFields || {}),
            [column.id]: true,
          },
        }

        // Recalculate net profit and profit margin
        const netProfit = newData[index].salePrice - newData[index].costPrice
        newData[index].netProfit = Number.parseFloat(netProfit.toFixed(2))

        const profitMargin = (netProfit / newData[index].salePrice) * 100
        newData[index].profitMargin = Number.parseFloat(profitMargin.toFixed(2))

        table.options.meta?.updateData(newData)
        toast.success(`Updated ${row.original.name} sale price`)
      }
    }
    setIsEditing(false)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur()
    } else if (e.key === "Escape") {
      setValue(initialValue)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          autoFocus
          className="h-8 w-24 text-right"
        />
        <div className="flex ml-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              onBlur()
            }}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              setValue(initialValue)
              setIsEditing(false)
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  const amount = Number.parseFloat(value)
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)

  return (
    <div className="flex items-center justify-end group">
      <div className={`font-medium ${isEdited ? "text-orange-500" : ""}`}>{formatted}</div>
      <div className="flex ml-2">
        {isEdited && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  // Get the current data
                  const newData = [...table.options.data]
                  const index = newData.findIndex((item) => item.id === row.original.id)

                  if (index !== -1) {
                    // Remove the edited flag for this field
                    const updatedEditedFields = { ...newData[index].editedFields }
                    delete updatedEditedFields[column.id]

                    // Reset to the original value from initialData
                    const originalItem = table.options.meta?.initialData?.find((item: PricingItem) => item.id === row.original.id)

                    if (originalItem) {
                      // Update the field with original value
                      newData[index] = {
                        ...newData[index],
                        [column.id]: originalItem[column.id],
                        editedFields: updatedEditedFields,
                      }

                      // Recalculate cost price (sum of all costs)
                      const costPrice =
                        newData[index].importCost +
                        newData[index].shippingCost +
                        newData[index].customsDuty +
                        newData[index].handlingFee

                      newData[index].costPrice = Number.parseFloat(costPrice.toFixed(2))

                      // Recalculate net profit and profit margin
                      const netProfit = newData[index].salePrice - newData[index].costPrice
                      newData[index].netProfit = Number.parseFloat(netProfit.toFixed(2))

                      const profitMargin = (netProfit / newData[index].salePrice) * 100
                      newData[index].profitMargin = Number.parseFloat(profitMargin.toFixed(2))

                      // Update the table data
                      table.options.meta?.updateData(newData)

                      // Show success toast
                      toast.success(`Reverted ${row.original.name} sale price to original value`)
                    }
                  }
                }}
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              align="center"
              sideOffset={5}
            >
              Revert to inherited calculated value
            </TooltipContent>
          </Tooltip>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

export function PricingTable({ data: initialData }: { data: PricingItem[] }) {
  // Initialize data with editedFields property
  const [data, setData] = React.useState<ExtendedPricingItem[]>(() =>
    initialData.map((item) => ({
      ...item,
      editedFields: {},
    })),
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all")

  // Define columns with editable cells
  const columns: ColumnDef<ExtendedPricingItem>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "upc",
      header: "UPC",
      cell: ({ row }) => <div className="font-medium">{row.getValue("upc")}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Product Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <div>{row.getValue("category")}</div>,
    },
    {
      accessorKey: "importCost",
      header: "Import Cost",
      cell: EditableNumberCell,
    },
    {
      accessorKey: "shippingCost",
      header: "Shipping",
      cell: EditableNumberCell,
    },
    {
      accessorKey: "customsDuty",
      header: "Customs",
      cell: EditableNumberCell,
    },
    {
      accessorKey: "handlingFee",
      header: "Handling",
      cell: EditableNumberCell,
    },
    {
      accessorKey: "costPrice",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full justify-end"
          >
            Cost Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("costPrice"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)

        // Cost price should not be colored orange, even if its components have been edited
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "salePrice",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full justify-end"
          >
            Sale Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: EditableSalePriceCell,
    },
    {
      accessorKey: "netProfit",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full justify-end"
          >
            Net Profit
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("netProfit"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)

        // Check if any of the cost components or sale price have been edited
        const hasEditedValues =
          row.original.editedFields?.importCost ||
          row.original.editedFields?.shippingCost ||
          row.original.editedFields?.customsDuty ||
          row.original.editedFields?.handlingFee ||
          row.original.editedFields?.salePrice

        return <div className={`text-right font-medium ${hasEditedValues ? "text-orange-500" : ""}`}>{formatted}</div>
      },
    },
    {
      accessorKey: "profitMargin",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full justify-end"
          >
            Margin %
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("profitMargin"))

        // Check if any of the cost components or sale price have been edited
        const hasEditedValues =
          row.original.editedFields?.importCost ||
          row.original.editedFields?.shippingCost ||
          row.original.editedFields?.customsDuty ||
          row.original.editedFields?.handlingFee ||
          row.original.editedFields?.salePrice

        return (
          <div className={`text-right font-medium ${hasEditedValues ? "text-orange-500" : ""}`}>
            {amount.toFixed(2)}%
          </div>
        )
      },
    },
  ]

  const filteredData = React.useMemo(() => {
    if (categoryFilter === "all") return data
    return data.filter((item) => item.category === categoryFilter)
  }, [data, categoryFilter])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      updateData: (newData: ExtendedPricingItem[]) => {
        setData(newData)
      },
      initialData: initialData, // Add this line to store the original data
    },
  })

  return (
    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      <div className="w-full">
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                className="h-9"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="h-9">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button size="sm" className="h-9">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <div className="border-b px-4 py-3">
              <Tabs defaultValue="all" onValueChange={setCategoryFilter}>
                <TabsList className="grid grid-cols-4 sm:grid-cols-8">
                  <TabsTrigger value="all">All</TabsTrigger>
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category}>
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
              selected.
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
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
