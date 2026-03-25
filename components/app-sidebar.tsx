'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FileText,
  Home,
  MoreHorizontal,
  Plus,
  Settings,
  Trash2,
} from "lucide-react"

import {
  useCreatePageMutation,
  useDeletePageMutation,
  usePagesQuery,
} from "@/apis/pages/hooks"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const workspaceItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const pagesQuery = usePagesQuery()
  const createPageMutation = useCreatePageMutation()
  const deletePageMutation = useDeletePageMutation()
  const pages = pagesQuery.data?.pages ?? []
  const deletingPageId = deletePageMutation.isPending ? deletePageMutation.variables : null

  function handleCreatePage() {
    createPageMutation.mutate({})
  }

  function handleDeletePage(pageId: string) {
    deletePageMutation.mutate(pageId)
  }

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" isActive>
              <div className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <FileText />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-medium">replo takehome asdiamond</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupAction
            aria-label="Create page"
            disabled={createPageMutation.isPending}
            onClick={handleCreatePage}
          >
            <Plus />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {workspaceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {pages.map((page) => (
                <SidebarMenuItem key={page.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === `/${page.id}`}
                    tooltip={page.title}
                  >
                    <Link href={`/${page.id}`}>
                      <FileText />
                      <span>{page.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction
                        aria-label={`Open actions for ${page.title}`}
                        showOnHover
                        onClick={(event) => {
                          event.stopPropagation()
                        }}
                      >
                        <MoreHorizontal />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          disabled={deletingPageId === page.id}
                          onSelect={() => {
                            handleDeletePage(page.id)
                          }}
                          variant="destructive"
                        >
                          <Trash2 />
                          <span>Delete page</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
