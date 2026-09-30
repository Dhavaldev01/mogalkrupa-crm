import { rightArrowIcon, storeIcon } from "@/assets/icon/Icon"
import Navbar from "@/components/common/Navbar"
import Sidebar from "@/components/common/Sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import Cookies from "js-cookie"
import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { SidebarProvider } from "./sidebar-context"
import Button from "@/components/common/Button"
import MobileHeader from "@/components/mobile/MobileHeader"
import MobileBottomNav from "@/components/mobile/MobileBottomNav"

export default function MainLayout() {
  const { pathname } = useLocation()
  
  const formatPathName = (pathName) => {
    return pathName
      .split("/")[1]
      ?.split("-")
      .join(" ");
  };

  return (
    <div className="min-h-svh bg-[#F4F1ED]">
      <SidebarProvider>
        <Sidebar />
        <main className="flex-1 md:ml-[240px] flex flex-col min-h-svh">
          <div className="hidden md:block">
            <Navbar />
          </div>
          <MobileHeader />
          <TooltipProvider>
            <div className="flex-1 pb-[76px] md:pb-0">
              <Outlet />
            </div>
          </TooltipProvider>
        </main>
        <MobileBottomNav />
      </SidebarProvider>
    </div>
  )
}