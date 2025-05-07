import {
  LayoutDashboardIcon,
  FolderIcon,
  GlobeIcon,
  UsersIcon,
  SettingsIcon,
} from "lucide-react"

export const navMain = [
  {
    title: "Pricing",
    url: "/",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Categories",
    url: "/categories",
    icon: FolderIcon,
  },
  {
    title: "Countries",
    url: "/countries",
    icon: GlobeIcon,
  },
  {
    title: "Vendors",
    url: "/vendors",
    icon: UsersIcon,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: SettingsIcon,
  },
]

export function getPageTitle(pathname: string) {
  const match = navMain.find((item) =>
    item.url === "/" ? pathname === "/" : pathname.startsWith(item.url)
  )
  return match ? match.title : ""
} 