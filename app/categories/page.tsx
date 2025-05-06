import { AppSidebar } from "../../components/app-sidebar"
import { CategoryTable } from "../../components/category-table"
import { SiteHeader } from "../../components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { categoryData } from "../dashboard/categories-data"

export default function CategoriesPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold tracking-tight">Category Management</h1>
                <p className="text-muted-foreground">Manage product categories and view category statistics.</p>
              </div>
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