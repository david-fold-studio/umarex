import { AppSidebar } from "@/components/app-sidebar"
import { PricingTable } from "@/components/pricing-table"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { pricingData } from "@/lib/pricing-data"
import { getPageTitle } from "@/lib/nav"
import { usePathname } from "next/navigation"

export default function Home() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/"
  const title = getPageTitle(pathname)
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title={title} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6">
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