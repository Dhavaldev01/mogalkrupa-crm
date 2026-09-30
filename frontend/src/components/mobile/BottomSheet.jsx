import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BottomSheet({ open, onOpenChange, title, children, className }) {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    // Handle escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && open) {
                onOpenChange(false);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [open, onOpenChange]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] md:hidden flex flex-col justify-end">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity" 
                onClick={() => onOpenChange(false)}
                aria-hidden="true"
            />
            
            {/* Sheet */}
            <div 
                className={cn(
                    "relative bg-white w-full rounded-t-2xl shadow-xl flex flex-col overflow-hidden max-h-[92dvh] transform transition-transform animate-in slide-in-from-bottom-full duration-200",
                    className
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby="bottom-sheet-title"
            >
                {/* Drag Handle (Visual only) */}
                <div className="w-full flex justify-center pt-3 pb-1 shrink-0 bg-white" onClick={() => onOpenChange(false)}>
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-4 pb-3 border-b border-[#E5E7EB] shrink-0 bg-white">
                    <h2 id="bottom-sheet-title" className="text-[18px] font-bold text-[#0F172A]">{title}</h2>
                    <button 
                        onClick={() => onOpenChange(false)}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                        aria-label="Close sheet"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto overscroll-contain bg-white">
                    {children}
                </div>
            </div>
        </div>
    );
}
