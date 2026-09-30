import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { useState } from "react"
import { Link } from "react-router-dom"

import Checkbox from "@/components/common/Checkbox"
import TablePagination from "@/components/common/TablePagination"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { cn, formatCount, formatIndianMobile, safeNumber } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Pencil, Trash2, Eye, X, Printer, ArrowLeft, ChevronRight, Phone, MapPin } from "lucide-react"

export default function AllCustomersTable({ data, isLoading, isFetching, pagination, setPagination, onEditCustomer, onDeleteCustomer }) {
    const [rowSelection, setRowSelection] = useState({})

    const columns = [
        {
            id: "select",
            header: ({ table }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        type={
                            table.getIsSomePageRowsSelected()
                                ? "indeterminate"
                                : "default"
                        }
                        onChange={(e) => {
                            table.toggleAllPageRowsSelected(
                                e.target.checked
                            );
                        }}
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onChange={(e) => {
                            row.toggleSelected(
                                e.target.checked
                            );
                        }}
                    />
                </div>
            ),
        },
        // {
        //     accessorKey: "customerId",
        //     header: "Customer ID",
        //     cell: (info) => (
        //         <p className={cn(
        //             "text-xs font-bold text-secondary [word-break:break-word]",
        //             !info?.row?.original?.customerNo && "font-bold text-secondary/60"
        //         )}>
        //             {info?.row?.original?.customerNo || 'N/A'}
        //         </p>
        //     )
        // },
        {
            accessorKey: "shopName",
            header: "Shop Name",
            cell: (info) => (
                <p className={cn(
                    "text-xs font-bold text-secondary [word-break:break-word]",
                    !info?.row?.original?.shopName && "font-bold text-secondary/60"
                )}>
                    {info?.row?.original?.shopName || 'N/A'}
                </p>
            )
        },
        {
            accessorKey: "customerDetails",
            header: "Customer Name",
            cell: (info) => (
                <div className="space-y-0.5">
                    <p className="text-xs font-bold text-secondary text-left capitalize">{info?.row?.original?.firstName} {info?.row?.original?.lastName}</p>
                </div>
            ),
        },
        // {
        //     accessorKey: "email",
        //     header: "Email",
        //     cell: (info) => (
        //         <p className={cn(
        //             "text-sm font-medium text-secondary [word-break:break-word]",
        //             !info?.row?.original?.email && "font-bold text-secondary/60"
        //         )}>
        //             {info?.row?.original?.email || 'N/A'}
        //         </p>
        //     )
        // },
        {
            accessorKey: "phone",
            header: "Mobile No.",
            cell: (info) => (
                <span className="text-xs font-medium text-secondary block text-left">{formatIndianMobile(info?.row?.original?.mobileNumber)}</span>
            )
        },
        {
            accessorKey: "address",
            header: "Address",
            cell: (info) => (
                <p className="text-xs font-medium text-secondary/80 text-left line-clamp-2">
                    {info?.row?.original?.address || 'N/A'}
                </p>
            )
        },
        {
            accessorKey: "totalBills",
            header: "Total Bills",
            cell: (info) => (
                <p className="text-xs font-bold text-secondary text-left">
                    {info?.row?.original?.totalBills || 0}
                </p>
            )
        },
        {
            accessorKey: "pendingAmount",
            header: "Pending Amount",
            cell: (info) => {
                const amount = safeNumber(info?.row?.original?.pendingAmount);
                return (
                    <p className={cn(
                        "text-xs font-bold text-left",
                        amount > 0 ? "text-[#E50914]" : "text-[#08A64A]"
                    )}>
                        ₹{amount.toFixed(2)}
                    </p>
                )
            }
        },
        {
            accessorKey: "action",
            header: "Action",
            cell: (info) => (
                <div className="flex items-center justify-center gap-3">
                    <button 
                        type="button"
                        title="Edit Customer"
                        onClick={() => onEditCustomer(info?.row?.original)}
                        className="text-[#F59E0B] hover:text-[#D97706] cursor-pointer transition-colors flex items-center justify-center">
                        <Pencil size={17} strokeWidth={1.8} />
                    </button>
                    <button 
                        type="button"
                        title="Delete Customer"
                        onClick={() => onDeleteCustomer(info?.row?.original)}
                        className="text-[#E50914] hover:text-[#C90C15] cursor-pointer transition-colors flex items-center justify-center">
                        <Trash2 size={17} strokeWidth={1.8} />
                    </button>
                    <Link
                        to={`/customers/${info?.row?.original?._id}`}
                        title="View Details"
                        className="size-7 min-w-7 rounded-sm shadow-xs bg-white border border-secondary/10 cursor-pointer flex items-center justify-center text-secondary hover:text-primary transition-colors">
                        <Eye size={17} strokeWidth={1.8} />
                    </Link>
                </div>
            ),
        },
    ]

    const table = useReactTable({
        data: data?.data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onRowSelectionChange: setRowSelection,
        ...(pagination && setPagination ? {
            manualPagination: true,
            rowCount: data?.totalRecord || 0,
            onPaginationChange: setPagination,
            state: {
                pagination,
                rowSelection,
            },
        } : {
            initialState: {
                pagination: {
                    pageIndex: 0,
                    pageSize: 20,
                },
            },
            state: {
                rowSelection,
            },
        }),
    });

    return (
        <>
            <div className="space-y-2">
                <div className="hidden md:block overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="bg-[#F5F1EE] hover:bg-[#F5F1EE]">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="h-auto py-2 px-2.5 text-sm font-bold text-secondary
                                            nth-2:max-w-[180px] nth-2:min-w-[180px] nth-2:w-[180px]
                                            nth-3:max-w-[180px] nth-3:min-w-[180px] nth-3:w-[180px]
                                            nth-4:max-w-[120px] nth-4:min-w-[120px] nth-4:w-[120px]
                                            nth-5:min-w-[250px] nth-5:w-auto
                                            nth-6:max-w-[110px] nth-6:min-w-[110px] nth-6:w-[110px]
                                            nth-7:max-w-[140px] nth-7:min-w-[140px] nth-7:w-[140px]
                                            first:max-w-10 first:min-w-10 first:w-10
                                            last:max-w-[140px] last:min-w-[140px] last:w-[140px] last:text-center">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column?.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>

                        <TableBody className="[&_div:last-child_tr]:border-0 [&_tr:last-child]:border-b">
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} className={`bg-white hover:bg-white ${rowSelection[row.id] ? 'bg-primary/5 hover:bg-primary/5' : ''}`}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="py-2 px-2.5 whitespace-normal
                                                    nth-2:max-w-[180px] nth-2:min-w-[180px] nth-2:w-[180px]
                                                    nth-3:max-w-[180px] nth-3:min-w-[180px] nth-3:w-[180px]
                                                    nth-4:max-w-[120px] nth-4:min-w-[120px] nth-4:w-[120px]
                                                    nth-5:min-w-[250px] nth-5:w-auto
                                                    nth-6:max-w-[110px] nth-6:min-w-[110px] nth-6:w-[110px]
                                                    nth-7:max-w-[140px] nth-7:min-w-[140px] nth-7:w-[140px]
                                                    first:max-w-10 first:min-w-10 first:w-10
                                                    last:max-w-[140px] last:min-w-[140px] last:w-[140px] last:text-center">
                                                {flexRender(
                                                    cell.column?.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <>
                                    {isFetching ?
                                        <>
                                            {[...Array(4)].map((_, index) => (
                                                <TableRow key={index} className="hover:bg-white! bg-white!">
                                                    <TableCell colSpan={columns.length} className="py-2 px-2.5 h-auto space-y-1">
                                                        <Skeleton className="h-6 w-[100px] rounded bg-secondary/10" />
                                                        <Skeleton className="h-5 w-3/4 rounded bg-secondary/10" />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </>
                                        : <TableRow className="hover:bg-white! bg-white!">
                                            <TableCell
                                                colSpan={columns.length}
                                                className="h-24 text-center"
                                            >
                                                No results.
                                            </TableCell>
                                        </TableRow>}
                                </>
                            )}
                        </TableBody>
                    </Table>
                </div>
                
                {/* Mobile Cards */}
                <div className="md:hidden flex flex-col gap-3 p-3 bg-[#FAFAF9]">
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => {
                            const data = row.original;
                            const amount = safeNumber(data.pendingAmount);
                            return (
                                <Link 
                                    key={row.id} 
                                    to={`/customers/${data._id}`}
                                    className="bg-white rounded-[12px] p-3 shadow-sm border border-[#E5E7EB] flex flex-col gap-2 relative transition-all active:scale-[0.98]"
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex flex-col">
                                            <h3 className="text-[14px] font-bold text-[#0F172A] leading-tight pr-6">
                                                {data.shopName || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'N/A'}
                                            </h3>
                                            <div className="flex items-center gap-1.5 mt-1 text-[#64748B]">
                                                <Phone size={12} />
                                                <span className="text-[12px]">{formatIndianMobile(data.mobileNumber)}</span>
                                            </div>
                                            {data.address && (
                                                <div className="flex items-center gap-1.5 mt-1 text-[#64748B]">
                                                    <MapPin size={12} className="shrink-0" />
                                                    <span className="text-[11px] truncate w-[200px]">{data.address}</span>
                                                </div>
                                            )}
                                        </div>
                                        <ChevronRight size={18} className="text-[#94A3B8] shrink-0 absolute right-3 top-3" />
                                    </div>
                                    <div className="flex justify-between items-center mt-1 pt-2 border-t border-[#F1F5F9]">
                                        <div className="text-[11px] font-medium text-[#64748B]">
                                            Bills: <span className="text-[#0F172A] font-bold">{data.totalBills || 0}</span>
                                        </div>
                                        <div className="text-[12px] font-bold flex items-center gap-1.5">
                                            <span className="text-[#64748B] font-medium text-[11px]">Pending:</span>
                                            <span className={amount > 0 ? "text-[#E50914]" : "text-[#08A64A]"}>
                                                ₹{amount.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <>
                            {isFetching ? (
                                [...Array(4)].map((_, index) => (
                                    <div key={index} className="bg-white rounded-[12px] p-4 shadow-sm border border-[#E5E7EB] space-y-3">
                                        <Skeleton className="h-4 w-[150px] bg-secondary/10" />
                                        <Skeleton className="h-3 w-[100px] bg-secondary/10" />
                                        <Skeleton className="h-8 w-full bg-secondary/10 mt-2" />
                                    </div>
                                ))
                            ) : (
                                <div className="py-10 text-center flex flex-col items-center">
                                    <p className="text-[14px] text-[#64748B] font-medium">No customers found</p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {table.getRowModel().rows.length > 0 &&
                    <TablePagination
                        table={table}
                        paginationContainer="px-4"
                    />}
            </div>
            {table.getSelectedRowModel().rows.length > 0 &&
                <div className="fixed bottom-0 right-0 w-[calc(100svw-100px)] flex items-center justify-center gap-1.5 py-4 px-5 z-50">
                    <button
                        type="button"
                        onClick={() => table.resetRowSelection()}
                        className="p-[5px] bg-secondary rounded-sm flex items-center justify-center size-[30px] text-white cursor-pointer hover:bg-secondary/90">
                        <X size={20} strokeWidth={2} />
                    </button>
                    <div className="py-2.5 px-4 rounded-sm bg-secondary flex items-center gap-3 shadow-sm">
                        <div className="text-sm font-medium text-white/80">
                            Selected: <span className="text-white font-bold">{formatCount(table.getSelectedRowModel().rows.length)}</span>
                        </div>
                        <div className="h-4 w-px rounded bg-white/50" />
                        <button type="button" className="flex items-center gap-1.5 text-white text-sm font-medium cursor-pointer hover:text-white/80 transition-colors">
                            <span className="flex items-center justify-center"><ArrowLeft size={16} strokeWidth={1.8} /></span>
                            Export
                        </button>
                        <div className="h-4 w-px rounded bg-white/50" />
                        <button type="button" className="flex items-center gap-1.5 text-white text-sm font-medium cursor-pointer hover:text-white/80 transition-colors">
                            <span className="flex items-center justify-center"><Printer size={16} strokeWidth={1.8} /></span>
                            Print
                        </button>
                    </div>
                </div>}
        </>
    )
}