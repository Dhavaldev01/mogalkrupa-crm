import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";

import TablePagination from "@/components/common/TablePagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { cn, safeNumber } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, MoreHorizontal, Trash2, BadgeIndianRupee, Printer } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AllInvoiceTable({ data, isLoading, isFetching, pagination, setPagination, onRecordPayment, onDeleteInvoice }) {
    const columns = [
        {
            id: "index",
            header: "#",
            cell: (info) => (pagination.pageIndex * pagination.pageSize) + info.row.index + 1,
        },
        {
            accessorKey: "invoiceNumber",
            header: "Invoice No.",
            cell: (info) => (
                <span className="font-bold text-[#0F1B35]">{info.getValue()}</span>
            )
        },
        {
            accessorKey: "date",
            header: "Date",
            cell: (info) => (
                <span className="text-[#667085]">{new Date(info.getValue()).toLocaleDateString("en-IN")}</span>
            )
        },
        {
            accessorKey: "customerSnapshot",
            header: "Customer Name",
            cell: (info) => {
                const snap = info.getValue();
                return (
                    <div className="flex flex-col">
                        <span className="font-bold text-[#0F1B35]">{snap?.shopName || snap?.name || 'N/A'}</span>
                        {snap?.shopName && <span className="text-xs text-[#667085]">{snap?.name}</span>}
                    </div>
                );
            }
        },
        {
            id: "mobile",
            header: "Mobile No.",
            accessorFn: (row) => row.customerSnapshot?.phone,
            cell: (info) => (
                <span className="text-[#0F1B35] font-medium">{info.getValue() || 'N/A'}</span>
            )
        },
        {
            accessorKey: "grandTotal",
            header: "Bill Amount",
            cell: (info) => (
                <span className="font-bold text-[#0F1B35]">₹{safeNumber(info.getValue()).toFixed(2)}</span>
            )
        },
        {
            accessorKey: "paidAmount",
            header: "Paid Amount",
            cell: (info) => (
                <span className="font-medium text-[#00A651]">₹{safeNumber(info.getValue()).toFixed(2)}</span>
            )
        },
        {
            accessorKey: "pendingAmount",
            header: "Pending Amount",
            cell: (info) => {
                const pending = safeNumber(info.getValue());
                return (
                    <span className={cn("font-medium", pending > 0 ? "text-[#FF1F2D]" : "text-[#0F1B35]")}>
                        ₹{pending.toFixed(2)}
                    </span>
                );
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: (info) => {
                const status = info.getValue();
                if (status === "Paid") {
                    return (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E4F7EC] text-[#00A651] text-xs font-bold">
                            <div className="size-1.5 rounded-full bg-[#00A651]" /> Paid
                        </div>
                    );
                } else if (status === "Partial") {
                    return (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF1DB] text-[#FF9800] text-xs font-bold">
                            <div className="size-1.5 rounded-full bg-[#FF9800]" /> Partial
                        </div>
                    );
                } else {
                    return (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FDE8EA] text-[#FF1F2D] text-xs font-bold">
                            <div className="size-1.5 rounded-full bg-[#FF1F2D]" /> Pending
                        </div>
                    );
                }
            }
        },
        {
            id: "action",
            header: "Action",
            cell: (info) => {
                const inv = info.row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Link to={`/invoices/${inv._id}`} className="p-1.5 text-[#667085] hover:text-[#0F1B35] transition-colors rounded hover:bg-gray-100" title="View Invoice">
                            <Eye size={16} strokeWidth={2} />
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="p-1.5 text-[#667085] hover:text-[#0F1B35] transition-colors rounded hover:bg-gray-100 outline-none">
                                <MoreHorizontal size={16} strokeWidth={2} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 bg-white border border-[#E5E7EB] shadow-sm rounded-lg">
                                <DropdownMenuItem asChild className="text-sm text-[#0F1B35] hover:bg-[#F9FAFB] cursor-pointer focus:bg-[#F9FAFB]">
                                    <Link to={`/invoices/${inv._id}`} className="flex items-center w-full">
                                        <Printer size={15} className="mr-2 text-[#64748B]" /> Print / View
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onRecordPayment(inv)} className="text-sm text-[#0F1B35] hover:bg-[#F9FAFB] cursor-pointer focus:bg-[#F9FAFB]">
                                    <BadgeIndianRupee size={15} className="mr-2 text-[#00A651]" /> Record Payment
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onDeleteInvoice(inv)} className="text-sm text-[#FF1F2D] hover:bg-[#FDE8EA] cursor-pointer focus:bg-[#FDE8EA]">
                                    <Trash2 size={15} className="mr-2" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            }
        },
    ];

    const table = useReactTable({
        data: data?.data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        ...(pagination && setPagination ? {
            manualPagination: true,
            rowCount: data?.totalRecord || 0,
            onPaginationChange: setPagination,
            state: {
                pagination,
            },
        } : {
            initialState: {
                pagination: {
                    pageIndex: 0,
                    pageSize: 20,
                },
            },
        }),
    });

    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-[#F8F9FA] hover:bg-[#F8F9FA] border-b border-[#E5E7EB]">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="py-3 px-4 text-[13px] font-semibold text-[#0F1B35] whitespace-nowrap">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="bg-white hover:bg-[#F9FAFB] border-b border-[#E5E7EB]">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-3 px-4 text-[13px] whitespace-nowrap">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <>
                                {isFetching || isLoading ? (
                                    [...Array(5)].map((_, index) => (
                                        <TableRow key={index} className="bg-white hover:bg-white border-b border-[#E5E7EB]">
                                            <TableCell colSpan={columns.length} className="py-4 px-4">
                                                <Skeleton className="h-5 w-full rounded bg-[#F1F3F5]" />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow className="bg-white hover:bg-white border-b border-[#E5E7EB]">
                                        <TableCell colSpan={columns.length} className="h-24 text-center text-[#667085] text-sm">
                                            No matching invoices found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </>
                        )}
                    </TableBody>
                </Table>
            </div>
            {data?.totalRecord > 0 && (
                <TablePagination
                    table={table}
                    paginationContainer="p-4 bg-white border-t border-[#E5E7EB]"
                />
            )}
        </div>
    );
}
