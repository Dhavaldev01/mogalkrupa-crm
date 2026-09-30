import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import Button from "./Button"
import { useState } from "react";

function getPageNumbers(current, total) {
    const delta = 1 // pages around current
    const range = []
    const rangeWithDots = []

    for (
        let i = Math.max(1, current - delta);
        i <= Math.min(total, current + delta);
        i++
    ) {
        range.push(i)
    }

    if (range[0] > 1) {
        rangeWithDots.push(1)
        if (range[0] > 2) rangeWithDots.push("...")
    }

    rangeWithDots.push(...range)

    if (range[range.length - 1] < total) {
        if (range[range.length - 1] < total - 1)
            rangeWithDots.push("...")
        rangeWithDots.push(total)
    }

    return rangeWithDots
}


export default function TablePagination({ table, paginationContainer }) {
    const { pageIndex, pageSize } = table.getState().pagination
    const pageCount = table.getPageCount()
    const currentPage = pageIndex + 1


    return (
        <div className={cn(
            "flex gap-3 sm:pt-4 pt-2 lg:flex-row lg:items-center sm:flex-col xs:flex-row sm:items-start xs:items-center flex-col",
            paginationContainer
        )}>
            <div className="flex items-center lg:justify-start justify-center sm:gap-3 gap-2 lg:mx-0 sm:mx-auto">
                {/* Info */}
                <div className="text-secondary/70 sm:text-sm text-xs font-medium">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} •{" "}
                    {table.getRowModel().rows.length} rows
                </div>
                {/* Page Size */}
                <Select
                    value={String(pageSize)}
                    onValueChange={(value) => table.setPageSize(Number(value))}
                >
                    <SelectTrigger className="bg-white border border-secondary/10 text-xs sm:py-1.5 py-1 sm:px-2.5 px-1.5 h-auto! cursor-pointer rounded-md shadow-xs data-placeholder:text-secondary/50 focus-visible:ring-3 focus-visible:ring-primary/20 focus-visible:border-primary">
                        <SelectValue placeholder="Rows" />
                    </SelectTrigger>
                    <SelectContent className="border-secondary/10 bg-white">
                        {[20, 50].map((size) => (
                            <SelectItem
                                key={size}
                                value={String(size)}
                                className="cursor-pointer hover:bg-secondary/10! text-sm font-medium text-secondary! flex items-center gap-2">
                                {size} / page
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 lg:ml-auto lg:mr-0 sm:mx-auto xs:ml-auto xs:mr-0">
                {/* Previous */}
                <Button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="text-xs py-1.5 px-4 shadow-xs"
                >
                    Previous
                </Button>

                {/* Page Numbers */}
                {getPageNumbers(currentPage, pageCount).map((page, i) =>
                    page === "..." ? (
                        <Button
                            key={`dots-${i}`}
                            className="text-xs py-1.5 px-2.5 min-w-[30px] shadow-xs hover:bg-white sm:flex hidden"
                        >
                            …
                        </Button>
                    ) : (
                        <Button
                            key={page}
                            primaryBtn={currentPage === page}
                            onClick={() => table.setPageIndex(page - 1)}
                            className={cn(
                                "text-xs py-1.5 px-2.5 min-w-[30px] sm:flex hidden",
                                currentPage != page && "shadow-xs"
                            )}
                        >
                            {String(page).padStart(2, "0")}
                        </Button>
                    )
                )}

                {/* Next */}
                <Button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="text-xs py-1.5 px-4 shadow-xs xs:ml-0 ml-auto"
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
