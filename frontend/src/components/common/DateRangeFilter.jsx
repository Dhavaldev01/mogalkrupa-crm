import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { format, isValid } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export default function DateRangeFilter({ 
    startYear = new Date().getFullYear(),
    availableYears = [new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2],
    onApply
}) {
    const [year, setYear] = useState(startYear.toString());
    const [dateRange, setDateRange] = useState({ from: null, to: null });
    const [open, setOpen] = useState(false);

    // Temp state for calendar before clicking Apply
    const [tempDateRange, setTempDateRange] = useState({ from: null, to: null });

    const handleOpen = (isOpen) => {
        setOpen(isOpen);
        if (isOpen) {
            setTempDateRange(dateRange);
        }
    };

    const handleApply = () => {
        setDateRange(tempDateRange);
        setOpen(false);
        if (onApply) {
            onApply({
                year: year,
                startDate: tempDateRange.from ? format(tempDateRange.from, 'yyyy-MM-dd') : null,
                endDate: tempDateRange.to ? format(tempDateRange.to, 'yyyy-MM-dd') : null
            });
        }
    };

    const handleClear = () => {
        const cleared = { from: null, to: null };
        setTempDateRange(cleared);
        setDateRange(cleared);
        setOpen(false);
        if (onApply) {
            onApply({
                year: year,
                startDate: null,
                endDate: null
            });
        }
    };

    const handleYearChange = (newYear) => {
        setYear(newYear);
        if (onApply) {
            onApply({
                year: newYear,
                startDate: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : null,
                endDate: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : null
            });
        }
    };

    const formatDisplay = () => {
        if (dateRange.from && dateRange.to) {
            return `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd")}`;
        }
        if (dateRange.from) {
            return format(dateRange.from, "MMM dd");
        }
        return "Select start & end date";
    };

    // Make sure we limit calendar to the selected year
    const yearNum = parseInt(year, 10);
    const minDate = new Date(yearNum, 0, 1);
    const maxDate = new Date(yearNum, 11, 31);

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Select value={year} onValueChange={handleYearChange}>
                <SelectTrigger className="w-[85px] h-[40px] bg-white border border-[#E5E7EB] rounded-[8px] text-[14px] font-semibold text-[#0F172A] hover:border-[#CBD5E1] shadow-none focus:ring-[3px] focus:ring-[#E50914]/10 focus:border-[#E50914] px-3">
                    <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-[8px] border border-[#E5E7EB] shadow-lg min-w-[85px]">
                    {availableYears.map(y => (
                        <SelectItem key={y} value={y.toString()} className="text-[14px] hover:bg-[#F8FAFC]">{y}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Popover open={open} onOpenChange={handleOpen}>
                <PopoverTrigger asChild>
                    <button className="flex items-center justify-between w-[220px] h-[40px] bg-white border border-[#E5E7EB] rounded-[8px] px-3 text-[13px] font-medium text-[#0F172A] hover:border-[#CBD5E1] transition-colors focus:outline-none focus:ring-[3px] focus:ring-[#E50914]/10 focus:border-[#E50914]">
                        <span className="truncate">{formatDisplay()}</span>
                        <CalendarIcon size={16} className="text-[#64748B] shrink-0" />
                    </button>
                </PopoverTrigger>
                <PopoverContent 
                    className="w-auto p-0 bg-white border border-[#E5E7EB] rounded-[10px] shadow-[0px_10px_24px_rgba(0,0,0,0.08)] z-50 overflow-hidden" 
                    align="end"
                >
                    <div className="p-3">
                        <Calendar
                            mode="range"
                            selected={tempDateRange}
                            onSelect={setTempDateRange}
                            defaultMonth={tempDateRange.from || new Date(yearNum, new Date().getMonth())}
                            fromDate={minDate}
                            toDate={maxDate}
                            className="p-0"
                            classNames={{
                                day_range_middle: "aria-selected:bg-[#FDE8EA] aria-selected:text-[#0F172A]",
                                day_range_start: "aria-selected:bg-[#E50914] aria-selected:text-white",
                                day_range_end: "aria-selected:bg-[#E50914] aria-selected:text-white",
                                day_today: "border border-[#E50914] text-[#E50914]",
                                button_previous: "hover:bg-[#F8FAFC]",
                                button_next: "hover:bg-[#F8FAFC]",
                                day: "h-9 w-9 p-0 font-normal hover:bg-[#FFF5F5] hover:text-[#E50914] focus:bg-[#FFF5F5] focus:text-[#E50914]",
                            }}
                        />
                    </div>
                    <div className="flex items-center justify-between p-3 border-t border-[#E5E7EB] bg-[#FAFAFA]">
                        <button 
                            onClick={handleClear}
                            className="px-4 py-1.5 bg-white border border-[#E5E7EB] text-[#0F172A] text-[13px] font-semibold rounded-[7px] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-colors"
                        >
                            Clear
                        </button>
                        <button 
                            onClick={handleApply}
                            className="px-4 py-1.5 bg-[#E50914] text-white text-[13px] font-semibold rounded-[7px] hover:bg-[#C90C15] active:bg-[#B00A12] transition-colors shadow-sm"
                        >
                            Apply
                        </button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
