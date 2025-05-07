"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, ArrowUpDown } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { pricingData } from "@/app/dashboard/pricing-data"

// Simulate pricing history data with dates
const generateHistoricalData = (itemId: string) => {
  const item = pricingData.find(item => item.id === itemId)
  if (!item) return []

  // Create artificial history (in a real app, this would come from a database)
  const today = new Date()
  const oneDayMs = 24 * 60 * 60 * 1000
  
  return [
    {
      date: today,
      importCost: item.importCost,
      shippingCost: item.shippingCost,
      customsDuty: item.customsDuty,
      handlingFee: item.handlingFee,
      costPrice: item.costPrice,
      salePrice: item.salePrice,
      netProfit: item.netProfit,
      profitMargin: item.profitMargin,
      changes: [] // No changes for current data
    },
    {
      date: new Date(today.getTime() - (7 * oneDayMs)), // 1 week ago
      importCost: item.importCost - 2.50,
      shippingCost: item.shippingCost,
      customsDuty: item.customsDuty,
      handlingFee: item.handlingFee - 0.50,
      costPrice: item.costPrice - 3.00,
      salePrice: item.salePrice - 5.00,
      netProfit: item.netProfit - 2.00,
      profitMargin: item.profitMargin - 1.20,
      changes: ["importCost", "handlingFee", "salePrice"]
    },
    {
      date: new Date(today.getTime() - (14 * oneDayMs)), // 2 weeks ago
      importCost: item.importCost - 2.50,
      shippingCost: item.shippingCost - 1.25,
      customsDuty: item.customsDuty,
      handlingFee: item.handlingFee - 0.50,
      costPrice: item.costPrice - 4.25,
      salePrice: item.salePrice - 10.00,
      netProfit: item.netProfit - 5.75,
      profitMargin: item.profitMargin - 2.40,
      changes: ["shippingCost", "salePrice"]
    },
    {
      date: new Date(today.getTime() - (30 * oneDayMs)), // 1 month ago
      importCost: item.importCost - 5.00,
      shippingCost: item.shippingCost - 1.25,
      customsDuty: item.customsDuty - 0.75,
      handlingFee: item.handlingFee - 0.50,
      costPrice: item.costPrice - 7.50,
      salePrice: item.salePrice - 15.00,
      netProfit: item.netProfit - 7.50,
      profitMargin: item.profitMargin,
      changes: ["importCost", "customsDuty"]
    }
  ]
}

export default function ItemPage() {
  const params = useParams()
  const router = useRouter()
  const itemId = params.id as string
  
  // Find the item in our data
  const item = pricingData.find(item => item.id === itemId)
  
  // Generate historical pricing data
  const pricingHistory = generateHistoricalData(itemId)
  
  // Handle if item not found
  if (!item) {
    return (
      <div className="container mx-auto py-10">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center justify-center h-[50vh]">
          <p className="text-xl">Item not found</p>
        </div>
      </div>
    )
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        <Button variant="outline" onClick={() => router.back()} className="h-9">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Pricing
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{item.name}</h1>
          <p className="text-muted-foreground">UPC: {item.upc} | Category: {item.category}</p>
        </div>
      </div>

      <div className="bg-card rounded-md border shadow-sm">
        <div className="border-b px-4 py-3">
          <h2 className="text-lg font-semibold">Pricing History</h2>
          <p className="text-sm text-muted-foreground">Green values indicate changes from previous period</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Import Cost</TableHead>
                <TableHead className="text-right">Shipping</TableHead>
                <TableHead className="text-right">Customs</TableHead>
                <TableHead className="text-right">Handling</TableHead>
                <TableHead className="text-right">Cost Price</TableHead>
                <TableHead className="text-right">Sale Price</TableHead>
                <TableHead className="text-right">Net Profit</TableHead>
                <TableHead className="text-right">Margin %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricingHistory.map((historyItem, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {format(historyItem.date, "MMM d, yyyy")}
                    {index === 0 && <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">Current</span>}
                  </TableCell>
                  <TableCell className={`text-right ${historyItem.changes.includes("importCost") ? "text-green-600 font-medium" : ""}`}>
                    {formatCurrency(historyItem.importCost)}
                  </TableCell>
                  <TableCell className={`text-right ${historyItem.changes.includes("shippingCost") ? "text-green-600 font-medium" : ""}`}>
                    {formatCurrency(historyItem.shippingCost)}
                  </TableCell>
                  <TableCell className={`text-right ${historyItem.changes.includes("customsDuty") ? "text-green-600 font-medium" : ""}`}>
                    {formatCurrency(historyItem.customsDuty)}
                  </TableCell>
                  <TableCell className={`text-right ${historyItem.changes.includes("handlingFee") ? "text-green-600 font-medium" : ""}`}>
                    {formatCurrency(historyItem.handlingFee)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(historyItem.costPrice)}
                  </TableCell>
                  <TableCell className={`text-right ${historyItem.changes.includes("salePrice") ? "text-green-600 font-medium" : ""}`}>
                    {formatCurrency(historyItem.salePrice)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(historyItem.netProfit)}
                  </TableCell>
                  <TableCell className="text-right">
                    {historyItem.profitMargin.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
} 