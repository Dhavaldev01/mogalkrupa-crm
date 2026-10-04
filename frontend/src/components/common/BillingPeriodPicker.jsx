import React, { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import invoiceService from "@/services/invoiceService";

export default function BillingPeriodPicker({ value, onApply, isMobile = false }) {
    const [isOpen, setIsOpen] = useState(false);
    
    const [view, setView] = useState("calendar");
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    
    const [draftType, setDraftType] = useState(value?.type || "month");
    const [draftMonth, setDraftMonth] = useState(value?.date || new Date());
    const [draftRange, setDraftRange] = useState(
        value?.type === "range" ? { from: value.from, to: value.to } : { from: undefined, to: undefined }
    );
    const [calendarMonth, setCalendarMonth] = useState(value?.date || value?.from || new Date());
    const [startYear, setStartYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const fetchEarliestYear = async () => {
            try {
                const response = await invoiceService.getEarliestInvoiceYear();
                if (response.data?.success && response.data?.data?.earliestYear) {
                    setStartYear(response.data.data.earliestYear);
                }
            } catch (error) {
                console.error("Failed to fetch earliest invoice year:", error);
            }
        };
        fetchEarliestYear();
    }, []);

    useEffect(() => {
        if (isOpen) {
            setDraftType(value?.type || "month");
            if (value?.type === "range") {
                setDraftRange({ from: value.from, to: value.to });
                const refDate = value.from || new Date();
                setDraftMonth(refDate);
                setCalendarMonth(refDate);
                setCurrentYear(refDate.getFullYear());
            } else {
                const refDate = value?.date || new Date();
                setDraftMonth(refDate);
                setDraftRange({ from: undefined, to: undefined });
                setCalendarMonth(refDate);
                setCurrentYear(refDate.getFullYear());
            }
            setView("calendar");
        }
    }, [isOpen, value]);

    const handleApply = () => {
        if (draftType === "month") {
            onApply({ type: "month", date: draftMonth });
        } else {
            onApply({ type: "range", from: draftRange.from, to: draftRange.to });
        }
        setIsOpen(false);
    };

    const handleClear = () => {
        setDraftType("month");
        setDraftMonth(new Date());
        setDraftRange({ from: undefined, to: undefined });
        onApply({ type: "month", date: undefined });
        setIsOpen(false);
    };

    const handleSelectMonth = (monthIndex) => {
        const newDate = new Date(currentYear, monthIndex, 1);
        setDraftType("month");
        setDraftMonth(newDate);
        setDraftRange({ from: undefined, to: undefined });
        setCalendarMonth(newDate);
        setView("calendar");
    };

    const handleRangeSelect = (range) => {
        setDraftType("range");
        setDraftRange(range);
    };
    
    const handleYearChange = (yr) => {
        const y = parseInt(yr);
        setCurrentYear(y);
        const newCalMonth = new Date(y, calendarMonth.getMonth(), 1);
        setCalendarMonth(newCalMonth);
        if (draftType === "range" && draftRange.from && draftRange.from.getFullYear() !== y) {
            setDraftRange({ from: undefined, to: undefined });
        }
    };

    const getDisplayText = () => {
        if (!value || (!value.date && !value.from)) {
            return "Select month or date range";
        }
        if (value.type === "month" && value.date) {
            return format(value.date, "MMMM yyyy");
        }
        if (value.type === "range" && value.from) {
            if (value.to) {
                return `${format(value.from, "dd MMM yyyy")} - ${format(value.to, "dd MMM yyyy")}`;
            }
            return format(value.from, "dd MMM yyyy");
        }
        return "Select month or date range";
    };

    return (
        <div className="flex items-center gap-2">
            <Select value={currentYear.toString()} onValueChange={handleYearChange}>
                <SelectTrigger className={cn("h-[36px] bg-white border-[#E5E7EB] rounded-[8px] text-[13px] font-medium focus:ring-0", isMobile ? "w-[80px]" : "w-[90px]")}>
                    <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="bg-white max-h-[200px] z-[9999]">
                    {Array.from(
                        { length: new Date().getFullYear() - startYear + 1 },
                        (_, i) => startYear + i
                    ).map((yr) => (
                        <SelectItem key={yr} value={yr.toString()} className="text-[13px]">{yr}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <button 
                        type="button"
                        className={cn(
                            "h-[36px] bg-white border border-[#E5E7EB] rounded-[8px] text-[13px] font-medium outline-none flex items-center justify-between px-3 hover:bg-gray-50 transition-colors focus:ring-0",
                            isMobile ? "flex-1 min-w-[150px]" : "w-[220px]",
                            (!value || (!value.date && !value.from)) && "text-gray-500 font-normal"
                        )}
                    >
                        <span className="truncate">{getDisplayText()}</span>
                        <CalendarIcon size={14} className="ml-2 shrink-0 opacity-50" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4 bg-white border border-gray-200 rounded-xl shadow-lg z-[9999] pointer-events-auto" align={isMobile ? "center" : "start"}>
                    {view === "calendar" ? (
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between mb-2 px-1">
                                <button type="button" onClick={() => setCalendarMonth(new Date(currentYear, calendarMonth.getMonth() - 1, 1))} className="p-1 hover:bg-gray-100 rounded-md">
                                    <ChevronLeft size={16} />
                                </button>
                                <button type="button" onClick={() => setView("months")} className="text-[14px] font-bold hover:underline cursor-pointer px-2 py-1 rounded-md hover:bg-gray-50">
                                    {format(calendarMonth, "MMMM")} {currentYear}
                                </button>
                                <button type="button" onClick={() => setCalendarMonth(new Date(currentYear, calendarMonth.getMonth() + 1, 1))} className="p-1 hover:bg-gray-100 rounded-md">
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                            <Calendar
                                mode="range"
                                month={calendarMonth}
                                onMonthChange={setCalendarMonth}
                                selected={draftType === "range" ? draftRange : undefined}
                                onSelect={handleRangeSelect}
                                numberOfMonths={1}
                                className="p-0 border-0"
                                classNames={{ nav: "hidden", month_caption: "hidden" }}
                            />
                        </div>
                    ) : (
                        <div className="w-[250px] p-2">
                            <div className="text-center font-bold mb-4 text-[14px]">{currentYear}</div>
                            <div className="grid grid-cols-3 gap-2">
                                {Array.from({ length: 12 }).map((_, i) => {
                                    const m = new Date(currentYear, i, 1);
                                    const isSelected = draftType === "month" && draftMonth.getMonth() === i && draftMonth.getFullYear() === currentYear;
                                    return (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => handleSelectMonth(i)}
                                            className={cn(
                                                "py-2 text-[13px] font-medium rounded-md hover:bg-gray-100 transition-colors",
                                                isSelected && "bg-[#E50914] text-white hover:bg-[#C90C15]"
                                            )}
                                        >
                                            {format(m, "MMM")}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <button 
                            type="button"
                            onClick={handleClear}
                            className="px-4 py-1.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-[8px] hover:bg-gray-50 transition-colors"
                        >
                            Clear
                        </button>
                        <button 
                            type="button"
                            onClick={handleApply}
                            className="px-4 py-1.5 text-sm font-bold text-white bg-[#E50914] rounded-[8px] hover:bg-[#C90C15] shadow-sm transition-colors"
                        >
                            Apply
                        </button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
