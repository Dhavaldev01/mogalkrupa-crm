import React from 'react';
import { useLocation } from 'react-router-dom';

import { Menu } from 'lucide-react';
import { useSidebar } from '@/layout/sidebar-context';
import { useAuthUser } from '@/lib/useAuthUser';

export default function MobileHeader() {
    const { pathname } = useLocation();
    const { setOpenMobile } = useSidebar();
    const { user } = useAuthUser();

    // Get initials for avatar
    const initials = (user?.name || "User").split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    return (
        <header className="md:hidden bg-white w-full border-b border-[#E5E7EB] px-3 flex items-center justify-between sticky top-0 z-40 shadow-sm h-[56px]">
            {/* Left Menu Button */}
            {/* <button 
                onClick={() => setOpenMobile(true)}
                className="w-[36px] h-[36px] flex items-center justify-center rounded-full bg-[#F8FAFC] text-[#0F172A] border border-[#E5E7EB] outline-none"
            >
                <Menu size={18} strokeWidth={2.5} />
            </button> */}

            {/* Center Branding */}
            <div className="flex flex-col items-center justify-center text-center">
                <h1 style={{ fontFamily: '"Noto Sans Gujarati", sans-serif', fontWeight: 900 }} className="text-[18px] text-[#E31E24] leading-tight tracking-tight">
                    મોગલ કૃપા
                </h1>
                {/* Optional subtitle if needed, but the reference says MOGAL KRUPA text or logo */}
            </div>

            {/* Right Avatar */}
            <div className="w-[34px] h-[34px] flex items-center justify-center rounded-full bg-[#E50914] text-white text-[12px] font-bold shadow-sm">
                {initials}
            </div>
        </header>
    );
}
