import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader({ title, description }: { title: string, description?: string }) {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 min-h-12 flex-col justify-center border-b transition-[width,height] ease-linear">
      <div className={`flex w-full items-center gap-1 px-4 pt-0 lg:gap-2 lg:px-6${!description ? ' h-full' : ''}`}>
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <div className={!description ? 'flex items-center h-full' : ''}>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </header>
  )
}
