import { AppSidebar } from "@/components/app-sidebar"
import { PricingTable } from "@/components/pricing-table"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { pricingData } from "@/app/dashboard/pricing-data"

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold tracking-tight">Pricing Management</h1>
                <p className="text-muted-foreground">Manage your product pricing, costs, and profit margins.</p>
              </div>
              <div className="px-4 lg:px-6">
                <PricingTable data={pricingData} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
} 