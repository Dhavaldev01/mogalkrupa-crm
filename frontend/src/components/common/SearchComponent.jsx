import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Search, X, History } from "lucide-react";

export default function SearchComponent({
    isSearchClose = false,
    value,
    onChange,
    onClear,
    isHistoryBtn = false,
    placeholder = "Search...",
    searchContainerStyle,
    containerStyle,
    className
}) {
    return (
        <div className={cn(
            "flex",
            isHistoryBtn && "shadow-xs",
            containerStyle
        )}>
            <div className={cn(
                "relative sm:min-w-[250px] sm:flex-0 flex-1",
                searchContainerStyle
            )}>
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-secondary/60"><Search size={16} strokeWidth={2} /></span>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={cn(
                        "text-sm font-medium w-full py-1.5 pl-8 pr-2.5 bg-white border border-secondary/10 rounded-md placeholder:text-secondary/50 outline-none transition-all focus-within:ring-3 focus-within:ring-primary/20 focus-within:border-primary",
                        (isSearchClose || value) && "pr-8",
                        isHistoryBtn && "rounded-r-none",
                        className
                    )}
                />
                {(isSearchClose || value) && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 min-w-4 text-secondary/60 hover:text-primary *:size-full block bg-secondary/10 hover:bg-primary/10 rounded-full cursor-pointer">
                        <X size={14} strokeWidth={2.5} />
                    </button>
                )}
            </div>
            {isHistoryBtn &&
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button type="button" className="bg-input text-secondary py-1.5 px-2.5 border border-l-0 border-secondary/10 rounded-r-md cursor-pointer *:size-4">
                            <History size={16} strokeWidth={2} />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Product History
                    </TooltipContent>
                </Tooltip>}
        </div>
    );
}