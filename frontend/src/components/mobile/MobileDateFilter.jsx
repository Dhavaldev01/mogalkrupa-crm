import React, { useState } from "react";
import BottomSheet from "./BottomSheet";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileDateFilter({ dateFilter, setDateFilter }) {
    const [dateSheetOpen, setDateSheetOpen] = useState(false);
    const [tempDate, setTempDate] = useState({ start: "", end: "" });

    const formatDateText = () => {
        if (!dateFilter.startDate && !dateFilter.endDate) return "Date";
        const formatShort = (dateStr) => {
            if (!dateStr) return "";
            const d = new Date(dateStr);
            return d.toLocaleDateString("en-GB", { day: 'numeric', month: 'short' });
        };
        if (dateFilter.startDate && dateFilter.endDate) {
            const text = `${formatShort(dateFilter.startDate)} - ${formatShort(dateFilter.endDate)}`;
            return text.length > 15 ? "Date •" : text;
        }
        return formatShort(dateFilter.startDate || dateFilter.endDate);
    };

    const handleApplyDate = () => {
        setDateFilter(prev => ({
            ...prev,
            startDate: tempDate.start || null,
            endDate: tempDate.end || null
        }));
        setDateSheetOpen(false);
    };

    const handleClearDate = () => {
        setTempDate({ start: "", end: "" });
        setDateFilter(prev => ({
            ...prev,
            startDate: null,
            endDate: null
        }));
        setDateSheetOpen(false);
    };

    const handleOpenDateSheet = () => {
        setTempDate({
            start: dateFilter.startDate || "",
            end: dateFilter.endDate || ""
        });
        setDateSheetOpen(true);
    };

    return (
        <>
            <button
                onClick={handleOpenDateSheet}
                className={cn(
                    "flex items-center justify-center gap-1.5 h-[30px] px-2.5 rounded-[9px] text-[11px] font-medium border shadow-sm transition-colors shrink-0",
                    (dateFilter.startDate || dateFilter.endDate)
                        ? "bg-[#FDE8EA] border-[#E50914]/20 text-[#E50914]"
                        : "bg-white border-[#E5E7EB] text-[#0F172A]"
                )}
            >
                <CalendarIcon size={13} className={(dateFilter.startDate || dateFilter.endDate) ? "text-[#E50914]" : "text-[#64748B]"} />
                <span className="truncate max-w-[80px]">{formatDateText()}</span>
            </button>

            <BottomSheet open={dateSheetOpen} onClose={() => setDateSheetOpen(false)} title="Select Date Range">
                <div className="p-4 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 space-y-1">
                            <label className="text-[12px] font-semibold text-[#64748B]">Start Date</label>
                            <input 
                                type="date" 
                                value={tempDate.start}
                                onChange={(e) => setTempDate(prev => ({ ...prev, start: e.target.value }))}
                                className="w-full h-[42px] border border-[#E5E7EB] rounded-[8px] px-3 text-[14px] outline-none focus:border-[#E50914] bg-white"
                            />
                        </div>
                        <div className="flex-1 space-y-1">
                            <label className="text-[12px] font-semibold text-[#64748B]">End Date</label>
                            <input 
                                type="date" 
                                value={tempDate.end}
                                onChange={(e) => setTempDate(prev => ({ ...prev, end: e.target.value }))}
                                className="w-full h-[42px] border border-[#E5E7EB] rounded-[8px] px-3 text-[14px] outline-none focus:border-[#E50914] bg-white"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button 
                            onClick={handleClearDate}
                            className="h-[42px] border border-[#E5E7EB] bg-white rounded-[8px] text-[14px] font-semibold text-[#0F172A]"
                        >
                            Clear
                        </button>
                        <button 
                            onClick={handleApplyDate}
                            className="h-[42px] bg-[#E50914] rounded-[8px] text-[14px] font-semibold text-white shadow-sm"
                        >
                            Apply Filter
                        </button>
                    </div>
                </div>
            </BottomSheet>
        </>
    );
}
