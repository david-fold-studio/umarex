import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

export function ItemHeader() {
  const router = useRouter()
  
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="-ml-1 h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">Umarex Pricing Management</h1>
      </div>
    </header>
  )
} 