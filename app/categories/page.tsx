import { AppSidebar } from "@/components/app-sidebar"
import { CategoryTable } from "@/components/category-table"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { categoryData } from "@/lib/categories-data"
import { getPageTitle } from "@/lib/nav"
import { usePathname } from "next/navigation"

export default function CategoriesPage() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/categories"
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
                <CategoryTable data={categoryData} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
} 