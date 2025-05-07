import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Check, X, Pencil, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { type PricingItem } from "@/lib/pricing-data"

export interface EditableCellProps {
  getValue: () => any
  row: any
  column: any
  table: any
}

export function EditableNumberCell({ getValue, row, column, table }: EditableCellProps) {
  const initialValue = getValue()
  const [value, setValue] = React.useState(initialValue)
  const [isEditing, setIsEditing] = React.useState(false)

  // Get selected date from table meta
  const selectedDate = table.options.meta?.selectedDate
  const isHistoricalView = table.options.meta?.isHistoricalView
  
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
      <div className={`font-regular ${isEdited ? "text-orange-500 text-medium" : ""}`}>{formatted}</div>
      <div className="flex ml-2">
        {isEdited && !isHistoricalView && (
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
        {!isHistoricalView && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  )
} 