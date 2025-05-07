"use client"

import type * as React from "react"
import Link from "next/link"
import {
  ArrowUpCircleIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UsersIcon,
  GlobeIcon,
  UserCircleIcon,
} from "lucide-react"

import { NavDocuments } from "./nav-documents"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { navMain } from "@/lib/nav"

const data = {
  user: {
    name: "admin",
    email: "admin@umarex.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain,
  navSecondary: [
    {
      title: "Account",
      url: "#",
      icon: UserCircleIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
  ],
  documents: [
    {
      name: "Price Lists",
      url: "#",
      icon: FileTextIcon,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardListIcon,
    },
    {
      name: "Import/Export",
      url: "#",
      icon: DatabaseIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <div className="flex justify-start items-center pb-0 pl-0">
          <Link href="/">
            <div className="w-48 aspect-[5/1] flex items-center justify-center -ml-2">
              <img src="/umarex-logo Compact.webp" alt="Umarex Compact Logo" className="h-full w-full object-contain" />
            </div>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
