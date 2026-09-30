import { Menu, ChevronDown, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/layout/sidebar-context";
import { useAuthUser } from "@/lib/useAuthUser";
import { cn, getInitials, notificationDateTime } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "./Button";

import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { toggleSidebar } = useSidebar();
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { store, user, loginType } = useAuthUser();
  const { logout: authLogout } = useAuth();

  const formatPathName = (pathName) => {
    return pathName
      .split("/")[1]
      ?.split("-")
      .join(" ");
  };

  const getUsernameFromEmail = (email) => {
    if (!email) return "User";
    return String(email).split("@")[0];
  };

  const displayName = user?.name || getUsernameFromEmail(user?.email);

  const displayAvatar = null;

  const displayInitials = displayName ? getInitials(displayName) : "U";

  const isLoading = !user;

  const logout = async () => {
    await authLogout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <header className="bg-white w-full border-b border-[#DED8D3] py-2 md:px-[16px] px-4 flex items-center gap-4 sticky top-0 z-50 shadow-sm h-[60px]">
        <button
          type="button"
          onClick={() => {
            toggleSidebar();
            document.body.style.overflow = "hidden";
          }}
          className="size-8 min-w-8 rounded-md bg-white hover:bg-secondary/5 border border-[#DED8D3] text-secondary md:hidden flex items-center justify-center cursor-pointer relative outline-none shadow-sm">
          <span className="size-5 min-w-5 flex items-center justify-center">
            <Menu strokeWidth={2} />
          </span>
        </button>
        <Link to="/dashboard" className="md:hidden flex flex-col text-secondary outline-none w-auto">
          <span className="font-bold text-[14px] text-primary leading-tight">મોગલ કૃપા</span>
        </Link>
        <div className="md:flex hidden flex-col ml-1 justify-center">
          <p className="capitalize text-[18px] font-bold text-[#0F1B35] leading-tight">
            {pathname === '/customers' ? 'Customers' : pathname === '/invoices' ? 'Invoices' : formatPathName(pathname)}
          </p>
          <span className="text-[13px] text-[#667085] font-medium">
            {pathname === '/customers'
              ? 'Manage your customers'
              : pathname === '/invoices'
                ? 'Manage all invoices and view billing details'
                : `Welcome back${displayName ? `, ${displayName}` : ""}`}
          </span>
        </div>
        <div className="flex items-center ml-auto sm:space-x-4 space-x-2">
          <div className="flex items-center space-x-3">
            {/* {pathname === '/dashboard' && (
               <button type="button" className="hidden sm:flex h-[38px] px-3 bg-white border border-[#E5E7EB] rounded-[8px] items-center gap-1.5 text-[13px] font-medium text-[#0F172A] hover:bg-[#FAFAFA] transition-colors outline-none focus:border-[#E50914]">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary/60"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                 This Month
                 <ChevronDown size={14} strokeWidth={2} className="text-secondary/60 ml-0.5" />
               </button>
             )} */}
            {pathname !== '/customers' && pathname !== '/invoices' && (
              <>
                <Button
                  link
                  url="/billing/create"
                  primaryBtn
                  className="h-[38px] px-4 text-[13px] font-bold bg-primary text-white hover:bg-primary/90 rounded-[7px] shadow-sm flex items-center gap-1.5"
                >
                  <Plus size={16} strokeWidth={2.5} /> Create Bill
                </Button>
                <div className="w-px h-6 rounded-full bg-[#DED8D3]" />
              </>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-x-2 cursor-pointer">
                {isLoading ? (
                  <>
                    <Skeleton className="size-8 rounded-sm bg-secondary/10" />
                    <div className="space-y-1 max-w-[100px] sm:block hidden">
                      <Skeleton className="h-4 w-20 bg-secondary/10" />
                    </div>
                  </>
                ) : (
                  <>
                    <Avatar className="size-8 min-w-8 rounded-sm">
                      <AvatarImage
                        src={displayAvatar}
                        alt={displayName}
                        className="object-cover"
                        draggable={false}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm uppercase rounded-sm">
                        {displayInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5 max-w-[100px] sm:block hidden">
                      <p className="text-sm font-bold text-secondary leading-[1.2] capitalize truncate">
                        {displayName}
                      </p>
                    </div>
                  </>
                )}
                <span className="size-4 min-w-4 sm:flex hidden items-center justify-center text-secondary"><ChevronDown size={16} strokeWidth={2} /></span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-40 border-[#DED8D3] bg-white shadow-sm" align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-bold text-secondary">My Account</DropdownMenuLabel>
                <DropdownMenuItem
                  asChild
                  className={cn(
                    "cursor-pointer hover:bg-[#F4F1ED]! text-sm font-medium text-secondary! flex items-center gap-2",
                    pathname == "/settings" && "bg-primary/10 hover:bg-primary/10! text-primary!"
                  )}>
                  <Link to={'/settings'}>
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-[#DED8D3]" />
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer hover:bg-danger/10! text-sm font-medium text-danger! flex items-center gap-2" onClick={logout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  )
}
