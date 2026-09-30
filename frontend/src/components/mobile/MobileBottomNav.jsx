import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { House, Users, PlusCircle, FileText, Menu, BadgeIndianRupee, Settings, LogOut, Package, Factory, ShoppingCart, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import BottomSheet from './BottomSheet';
import { useAuth } from '@/context/AuthContext';
import { useAuthUser } from '@/lib/useAuthUser';

export default function MobileBottomNav() {
    const { pathname } = useLocation();
    const [moreOpen, setMoreOpen] = useState(false);
    const { logout } = useAuth();
    const { user } = useAuthUser();

    // The user's role logic for permissions can be handled here or inside standard components
    const isAdmin = user?.role === 'admin';

    const navItems = [
        { icon: <House size={22} />, label: "Home", path: "/dashboard", activePaths: ["/dashboard"] },
        { icon: <Users size={22} />, label: "Customers", path: "/customers", activePaths: ["/customers"] },
        { icon: <PlusCircle size={28} className="text-[#E50914]" />, label: "Bill", path: "/billing/create", activePaths: ["/billing/create"] },
        { icon: <FileText size={22} />, label: "Invoices", path: "/invoices", activePaths: ["/invoices"] }
    ];

    return (
        <>
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] z-[50] pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_10px_rgba(0,0,0,0.03)] h-[64px]">
                <div className="flex items-center justify-between h-full px-2 relative">
                    {navItems.map((item, idx) => {
                        const isActive = item.activePaths?.some(p => pathname === p || pathname.startsWith(p + '/'));
                        const isCenter = item.label === "Bill";
                        
                        if (isCenter) {
                            return (
                                <Link
                                    key={idx}
                                    to={item.path}
                                    className="flex flex-col items-center justify-start w-full h-full relative"
                                >
                                    <div className="absolute -top-5 bg-white p-1 rounded-full shadow-[0_-2px_8px_rgba(0,0,0,0.1)] border border-[#E5E7EB]/50">
                                        <div className="bg-[#E50914] w-[48px] h-[48px] rounded-full flex items-center justify-center text-white shadow-md">
                                            <PlusCircle size={28} strokeWidth={2} />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-semibold text-[#64748B] mt-auto pb-1.5">Bill</span>
                                </Link>
                            );
                        }

                        return (
                            <Link
                                key={idx}
                                to={item.path}
                                className={cn(
                                    "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                                    isActive ? "text-[#E50914]" : "text-[#64748B]"
                                )}
                            >
                                {React.cloneElement(item.icon, { size: 20, strokeWidth: isActive ? 2.5 : 2 })}
                                <span className={cn("text-[9.5px] font-semibold", isActive ? "text-[#E50914]" : "text-[#64748B]")}>{item.label}</span>
                            </Link>
                        );
                    })}
                    <button
                        type="button"
                        onClick={() => setMoreOpen(true)}
                        className="flex flex-col items-center justify-center w-full h-full space-y-1 text-[#64748B] transition-colors"
                    >
                        <Menu size={20} strokeWidth={2} />
                        <span className="text-[9.5px] font-semibold">More</span>
                    </button>
                </div>
            </div>

            <BottomSheet open={moreOpen} onOpenChange={setMoreOpen} title="More Options">
                <div className="flex flex-col p-2 space-y-1 pb-6">
                    <Link to="/rates" onClick={() => setMoreOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 active:bg-gray-100">
                        <BadgeIndianRupee size={20} className="text-[#64748B]" />
                        <span className="text-[15px] font-medium text-[#0F172A]">Rate Settings</span>
                    </Link>
                    <Link to="/settings" onClick={() => setMoreOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 active:bg-gray-100">
                        <Settings size={20} className="text-[#64748B]" />
                        <span className="text-[15px] font-medium text-[#0F172A]">Settings</span>
                    </Link>
                    <div className="h-[1px] bg-[#E5E7EB] my-2 mx-3"></div>
                    <button 
                        onClick={() => {
                            setMoreOpen(false);
                            logout();
                        }}
                        className="flex items-center gap-3 p-3 rounded-lg text-[#E50914] hover:bg-red-50 active:bg-red-100 text-left"
                    >
                        <LogOut size={20} />
                        <span className="text-[15px] font-medium">Logout</span>
                    </button>
                </div>
            </BottomSheet>
        </>
    );
}
