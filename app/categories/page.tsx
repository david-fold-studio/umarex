'use client'
import { useState, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { CategoryTable } from "@/components/category-table"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { categoryData } from "@/lib/categories-data"
import { getPageTitle } from "@/lib/nav"
import { usePathname } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { PageToolbar } from "@/components/page-toolbar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function CategoriesPage() {
  const pathname = usePathname()
  const title = getPageTitle(pathname)
  const [search, setSearch] = useState("")

  // Filter category data by search
  const filteredData = useMemo(() => {
    if (!search) return categoryData
    return categoryData.filter(item =>
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
            <Button size="sm" className="h-9">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          }
        />
      }
    >
      <CategoryTable data={filteredData} />
    </PageLayout>
  )
} 