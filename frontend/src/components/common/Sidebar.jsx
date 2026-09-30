import { House, Users, FilePlus2, FileText, BadgeIndianRupee, Settings } from "lucide-react"
import { useSidebar } from "@/layout/sidebar-context"
import { cn, getInitials } from "@/lib/utils"
import { Link, useLocation } from "react-router-dom"
import { useAuthUser } from "@/lib/useAuthUser"
import { ChevronRight } from "lucide-react"

const sidebarItems = [
    {
        icon: <House strokeWidth={1.8} />,
        label: "Dashboard",
        path: "/dashboard",
        activePaths: ["/dashboard"],
    },
    {
        icon: <Users strokeWidth={1.8} />,
        label: "Customers",
        path: "/customers",
        activePaths: ["/customers", "/customers-detail"],
    },
    {
        icon: <FilePlus2 strokeWidth={1.8} />,
        label: "Create Billing",
        path: "/billing/create",
        activePaths: ["/billing/create"],
    },
    {
        icon: <FileText strokeWidth={1.8} />,
        label: "Invoices",
        path: "/invoices",
        activePaths: ["/invoices"],
    },
    {
        icon: <BadgeIndianRupee strokeWidth={1.8} />,
        label: "Rate Settings",
        path: "/rates",
        activePaths: ["/rates"],
    },
    {
        icon: <Settings strokeWidth={1.8} />,
        label: "Settings",
        path: "/settings",
        activePaths: ["/settings"],
    },
]

export default function Sidebar() {
    const { open, closeSidebar } = useSidebar();
    const { pathname } = useLocation();
    const { store, user, loginType } = useAuthUser();

    const getUsernameFromEmail = (email) => {
        if (!email) return "User";
        return String(email).split("@")[0];
    };

    const displayName = user?.name || getUsernameFromEmail(user?.email);
      
    const displayInitials = displayName ? getInitials(displayName) : "U";
    
    // Capitalize role for display (e.g., 'admin' -> 'Admin')
    const capitalize = (str) => {
        if (!str) return "User";
        const safeStr = String(str);
        return safeStr.charAt(0).toUpperCase() + safeStr.slice(1);
    };
    
    const role = capitalize(user?.role);

    return (
        <>
            <div className={cn(
                "hidden md:flex min-w-[240px] max-w-[240px] w-full bg-white border-r border-[#DED8D3] fixed top-0 left-0 md:z-50 z-[999999] transition-transform duration-300 md:translate-x-0 h-screen flex-col shadow-sm",
                open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="px-4 py-4 flex flex-col items-start justify-center border-b border-[#DED8D3] min-h-[60px]">
                    <Link to="/dashboard" className="flex flex-col text-secondary outline-none">
                        <span className="font-bold text-[18px] text-primary leading-tight">મોગલ કૃપા</span>
                        <span className="text-[#0F1B35] text-[11px] mt-0.5 tracking-wider font-bold">CNC & લેસર</span>
                    </Link>
                </div>
                <div className="p-3 overflow-y-auto overflow-x-hidden flex-1 no-scroll">
                    <ul className="space-y-1">
                        {sidebarItems.map((item, index) => {
                            const isActive = item.activePaths?.some(p => pathname === p || pathname.startsWith(p + '/'));
                            return (
                                <li key={index}>
                                    <Link
                                        to={item.path}
                                        onClick={() => {
                                            closeSidebar();
                                            document.body.style.overflow = "";
                                        }}
                                        className={cn(
                                            "flex items-center gap-3 py-2.5 px-3 rounded-[8px] text-sm font-medium transition-all outline-none",
                                            isActive 
                                                ? "bg-primary text-white shadow-sm" 
                                                : "text-[#24324A] hover:bg-[#FFF1F2] hover:text-primary"
                                        )}>
                                        <span className={cn("size-[22px] min-w-[22px] flex items-center justify-center [&>svg]:size-full", isActive ? "text-white" : "text-[#24324A]")}>
                                            {item.icon}
                                        </span>
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                
                <div className="p-4 border-t border-[#DED8D3] bg-white">
                    <div className="flex items-center gap-3">
                        <div className="size-9 min-w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {displayInitials}
                        </div>
                        <div className="flex flex-col truncate flex-1">
                            <span className="text-sm font-bold text-secondary truncate">{displayName || "Loading..."}</span>
                            <span className="text-xs text-secondary/60 truncate">{role}</span>
                        </div>
                        <ChevronRight className="size-4 min-w-4 text-secondary/60" />
                    </div>
                </div>
            </div>
            
            <div
                onClick={() => {
                    closeSidebar();
                    document.body.style.overflow = "";
                }}
                className={cn(
                    "bg-secondary/80 fixed left-0 top-0 size-full z-[99999] backdrop-blur-sm transition-transform duration-300 md:hidden",
                    open ? "translate-x-0" : "-translate-x-full"
                )} 
            />
        </>
    )
}
