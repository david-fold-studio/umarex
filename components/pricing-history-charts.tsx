"use client"

import React from "react"
import { format } from "date-fns"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Chart, ChartContainer } from "@/components/ui/chart"

// Define the data format based on the pricing history
interface PricingHistoryItem {
  date: Date
  importCost: number
  shippingCost: number
  customsDuty: number
  handlingFee: number
  costPrice: number
  salePrice: number
  netProfit: number
  profitMargin: number
  changes: string[]
}

interface PricingHistoryChartsProps {
  historyData: PricingHistoryItem[]
  productName: string
}

export function PricingHistoryCharts({ historyData, productName }: PricingHistoryChartsProps) {
  // Sort the data chronologically (oldest to newest)
  const sortedData = [...historyData].sort((a, b) => a.date.getTime() - b.date.getTime())
  
  // Format the data for charts
  const chartData = sortedData.map(item => ({
    date: format(item.date, "MMM d"),
    costPrice: item.costPrice,
    salePrice: item.salePrice,
    netProfit: item.netProfit,
    profitMargin: item.profitMargin,
    importCost: item.importCost,
    shippingCost: item.shippingCost,
    customsDuty: item.customsDuty,
    handlingFee: item.handlingFee,
  }))

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-1 pt-2">
          <CardTitle className="text-sm font-semibold">Price & Cost Trends</CardTitle>
          <CardDescription className="text-xs">
            Historical view of sale price, cost price, and net profit
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <ChartContainer
            config={{
              costPrice: {
                label: "Cost Price",
                theme: {
                  light: "var(--chart-1)",
                  dark: "var(--chart-1)",
                },
              },
              salePrice: {
                label: "Sale Price",
                theme: {
                  light: "var(--chart-2)",
                  dark: "var(--chart-2)",
                },
              },
              netProfit: {
                label: "Net Profit",
                theme: {
                  light: "var(--chart-3)",
                  dark: "var(--chart-3)",
                },
              },
            }}
            className="aspect-[4/1.5]"
          >
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload) return null
                  return (
                    <div className="rounded-lg border bg-background p-1 shadow-sm text-xs">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="font-medium">Date:</div>
                        <div>{payload[0]?.payload.date}</div>
                        {payload.map((entry) => (
                          <React.Fragment key={entry.name}>
                            <div className="font-medium">{entry.name}:</div>
                            <div>${entry.value?.toFixed(2)}</div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )
                }}
              />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Area
                type="monotone"
                dataKey="costPrice"
                name="Cost Price"
                stackId="1"
                stroke="var(--color-costPrice)"
                fill="var(--color-costPrice)"
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="salePrice"
                name="Sale Price"
                stackId="2"
                stroke="var(--color-salePrice)"
                fill="var(--color-salePrice)"
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="netProfit"
                name="Net Profit"
                stackId="3"
                stroke="var(--color-netProfit)"
                fill="var(--color-netProfit)"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-1 pt-2">
          <CardTitle className="text-sm font-semibold">Cost Breakdown & Profit Margin</CardTitle>
          <CardDescription className="text-xs">
            Detailed cost components and profit margin percentage
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <ChartContainer
            config={{
              importCost: {
                label: "Import Cost",
                theme: {
                  light: "var(--chart-4)",
                  dark: "var(--chart-4)",
                },
              },
              shippingCost: {
                label: "Shipping",
                theme: {
                  light: "var(--chart-5)",
                  dark: "var(--chart-5)",
                },
              },
              customsDuty: {
                label: "Customs",
                theme: {
                  light: "var(--chart-1)",
                  dark: "var(--chart-1)",
                },
              },
              handlingFee: {
                label: "Handling",
                theme: {
                  light: "var(--chart-2)",
                  dark: "var(--chart-2)",
                },
              },
              profitMargin: {
                label: "Profit Margin %",
                theme: {
                  light: "var(--chart-3)",
                  dark: "var(--chart-3)",
                },
              },
            }}
            className="aspect-[4/1.5]"
          >
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tick={{ fontSize: 10 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload) return null
                  return (
                    <div className="rounded-lg border bg-background p-1 shadow-sm text-xs">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="font-medium">Date:</div>
                        <div>{payload[0]?.payload.date}</div>
                        {payload.map((entry) => (
                          <React.Fragment key={entry.name}>
                            <div className="font-medium">{entry.name}:</div>
                            <div>
                              {entry.name === "Profit Margin %" 
                                ? `${entry.value?.toFixed(2)}%` 
                                : `$${entry.value?.toFixed(2)}`}
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )
                }}
              />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Bar
                yAxisId="left"
                dataKey="importCost"
                name="Import Cost"
                stackId="a"
                fill="var(--color-importCost)"
              />
              <Bar
                yAxisId="left"
                dataKey="shippingCost"
                name="Shipping"
                stackId="a"
                fill="var(--color-shippingCost)"
              />
              <Bar
                yAxisId="left"
                dataKey="customsDuty"
                name="Customs"
                stackId="a"
                fill="var(--color-customsDuty)"
              />
              <Bar
                yAxisId="left"
                dataKey="handlingFee"
                name="Handling"
                stackId="a"
                fill="var(--color-handlingFee)"
              />
              <Bar
                yAxisId="right"
                dataKey="profitMargin"
                name="Profit Margin %"
                fill="var(--color-profitMargin)"
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
} 