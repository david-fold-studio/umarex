import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { StyledTableWrapper } from "@/components/StyledTableWrapper"

interface PageLayoutProps {
  title: string
  children: React.ReactNode
  toolbar?: React.ReactNode
}

export function PageLayout({ title, children, toolbar }: PageLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title={title} />
        {toolbar}
        <div className="flex flex-col gap-4 md:gap-6 overflow-x-hidden">
          {children}
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
} 