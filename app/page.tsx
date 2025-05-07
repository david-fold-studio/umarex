'use client'
import { useState, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { PricingTable } from "@/components/pricing-table"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { pricingData } from "@/lib/pricing-data"
import { getPageTitle } from "@/lib/nav"
import { usePathname } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { PageToolbar } from "@/components/page-toolbar"
import { PricingDateSelector } from "@/components/pricing-date-selector"
import { Button } from "@/components/ui/button"
import { Download, Plus, Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"

export default function Home() {
  const pathname = usePathname()
  const title = getPageTitle(pathname)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [search, setSearch] = useState("")
  const isHistoricalView = useMemo(() => {
    if (!selectedDate) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return selectedDate < today
  }, [selectedDate])

  // Filter pricing data by search
  const filteredData = useMemo(() => {
    if (!search) return pricingData
    return pricingData.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  return (
    <PageLayout
      title={title}
      toolbar={
        <PageToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={`Search ${title}...`}
          addButton={
            <Button size="sm" className="h-9" disabled={isHistoricalView}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          }
        >
          <PricingDateSelector date={selectedDate} setDate={setSelectedDate} />
          <Button variant="outline" size="sm" className="h-9" disabled={isHistoricalView}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </PageToolbar>
      }
    >
      {isHistoricalView && (
        <div className="bg-amber-50 border border-amber-200 rounded-md px-4 py-3 text-amber-800 mb-4">
          <p className="flex items-center text-sm">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Viewing historical pricing data as of {format(selectedDate as Date, "MMMM d, yyyy")}. Editing is disabled.
            <Button 
              variant="link" 
              className="ml-2 h-auto p-0 text-amber-800 underline"
              onClick={() => setSelectedDate(undefined)}
            >
              Return to current pricing
            </Button>
          </p>
        </div>
      )}
      <PricingTable data={filteredData} selectedDate={selectedDate} isHistoricalView={isHistoricalView} />
    </PageLayout>
  )
} 