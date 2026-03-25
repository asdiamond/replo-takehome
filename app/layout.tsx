import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { AppSidebar } from "@/components/app-sidebar"
import { QueryProvider } from "@/components/providers/query-provider"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Replo Takehome asdiamond",
  description: "A fullstack takehome project built with Next.js, React, React Query, and shadcn/ui",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground">
        <QueryProvider>
          <TooltipProvider>
            <SidebarProvider defaultOpen>
              <AppSidebar />
              <SidebarInset>
                <header className="supports-backdrop-filter:bg-background/80 sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
                  <SidebarTrigger />
                  <div className="h-4 w-px bg-border" />
                  <div className="flex flex-1 items-center justify-between gap-3">
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium">Replo Takehome asdiamond</span>
                      <span className="truncate text-xs text-muted-foreground">
                        fullstack takehome project
                      </span>
                    </div>
                  </div>
                </header>
                {children}
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
