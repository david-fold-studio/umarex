import React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { ItemHeader } from "@/components/item-header"
import { Toaster } from "@/components/ui/sonner"

export default function ItemLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-background">
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <div className="flex flex-col min-h-screen">
          <ItemHeader />
          <main className="flex-1">
            {children}
          </main>
        </div>
        <Toaster />
      </ThemeProvider>
    </div>
  )
} 