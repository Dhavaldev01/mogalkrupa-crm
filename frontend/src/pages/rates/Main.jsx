import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import rateService from "@/services/rateService";
import { useState, useEffect, useMemo } from "react";
import Button from "@/components/common/Button";
import TextInput from "@/components/common/TextInput";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { safeNumber, cn, formatCount } from "@/lib/utils";
import { Pencil, Trash2, Plus, Settings, Search } from "lucide-react";
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import TablePagination from "@/components/common/TablePagination";

export default function Rates() {
    const queryClient = useQueryClient();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [rateToEdit, setRateToEdit] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [rateToDelete, setRateToDelete] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            const trimmed = searchInput.trim();
            if (debouncedSearch !== trimmed) {
                setDebouncedSearch(trimmed);
                setPagination(prev => ({ ...prev, pageIndex: 0 }));
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput, debouncedSearch]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    const { data: ratesResponse, isLoading, isError, isFetching } = useQuery({
        queryKey: ["rates"],
        queryFn: () => rateService.getRates()
    });

    const rates = ratesResponse?.data?.data || [];

    const filteredRates = useMemo(() => {
        if (!debouncedSearch) return rates;
        const lowerSearch = debouncedSearch.toLowerCase();
        return rates.filter(r => 
            (r.name && String(r.name).toLowerCase().includes(lowerSearch)) ||
            String(r.site).toLowerCase().includes(lowerSearch) || 
            String(r.rate).toLowerCase().includes(lowerSearch)
        );
    }, [rates, debouncedSearch]);

    const openAddDialog = () => {
        setRateToEdit(null);
        setDialogOpen(true);
    };

    const openEditDialog = (rate) => {
        setRateToEdit(rate);
        setDialogOpen(true);
    };

    const openDeleteDialog = (rate) => {
        setRateToDelete(rate);
        setDeleteDialogOpen(true);
    };

    const columns = [
        {
            id: "index",
            header: "#",
            cell: (info) => (pagination.pageIndex * pagination.pageSize) + info.row.index + 1
        },
        {
            accessorKey: "name",
            header: "Name / Type",
            cell: (info) => <span className="font-bold text-secondary">{info.getValue() || "-"}</span>
        },
        {
            accessorKey: "site",
            header: "Site Size",
            cell: (info) => <span className="font-bold text-secondary">{info.getValue()}</span>
        },
        {
            accessorKey: "rate",
            header: "Rate (₹)",
            cell: (info) => <span className="text-secondary font-medium">{safeNumber(info.getValue()).toFixed(2)}</span>
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: (info) => {
                const isActive = info.getValue() !== false;
                const pillClass = isActive ? "bg-success/10 text-success" : "bg-secondary/10 text-secondary";
                const dotClass = isActive ? "bg-success" : "bg-secondary";
                return (
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${pillClass}`}>
                        <div className={`size-1.5 rounded-full ${dotClass}`} />
                        {isActive ? "Active" : "Inactive"}
                    </div>
                );
            }
        },
        {
            accessorKey: "updatedAt",
            header: "Last Updated",
            cell: (info) => <span className="text-secondary/80 font-medium">{format(new Date(info.getValue()), "dd MMM yyyy")}</span>
        },
        {
            id: "actions",
            header: "Action",
            cell: (info) => {
                const r = info.row.original;
                return (
                    <div className="flex items-center gap-3">
                        <button onClick={() => openEditDialog(r)} className="size-7 min-w-7 rounded-sm shadow-xs bg-white border border-secondary/10 cursor-pointer flex items-center justify-center text-secondary hover:text-primary transition-colors" title="Edit Rate">
                            <Pencil size={15} strokeWidth={1.8} />
                        </button>
                        <button onClick={() => openDeleteDialog(r)} className="size-7 min-w-7 rounded-sm shadow-xs bg-white border border-secondary/10 cursor-pointer flex items-center justify-center text-primary hover:brightness-110 transition-colors" title="Delete Rate">
                            <Trash2 size={15} strokeWidth={1.8} />
                        </button>
                    </div>
                );
            }
        }
    ];

    const table = useReactTable({
        data: filteredRates,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: { pagination },
    });

    return (
        <div className="p-3 md:p-4 space-y-3 md:space-y-5 w-full pb-[90px] md:pb-4 bg-[#F8FAFC] md:bg-transparent min-h-[calc(100vh-56px)] md:min-h-0">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="size-6 md:size-8 rounded flex items-center justify-center bg-primary/10 text-primary shrink-0">
                        <Settings size={18} strokeWidth={2} className="w-[14px] h-[14px] md:w-[18px] md:h-[18px]" />
                    </div>
                    <div>
                        <h1 className="text-[16px] md:text-[18px] font-bold text-secondary leading-tight">Rate Setting</h1>
                        <p className="text-[10px] md:text-xs text-secondary/60">Manage site and rate settings for billing.</p>
                    </div>
                </div>
            </div>

            {/* Mobile Actions & Cards */}
            <div className="md:hidden flex flex-col gap-3">
                <div className="flex flex-col">
                    <h2 className="text-[14px] font-bold text-secondary">Site & Rate List</h2>
                    <p className="text-[10px] font-medium text-secondary/60">Set the rate for each site size. These rates will be used in create billing.</p>
                </div>
                <div className="flex items-center gap-2 w-full">
                    <div className="relative flex-1 min-w-0">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary/40" size={14} />
                        <input
                            type="text"
                            placeholder="Search site..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pl-8 pr-2 h-[40px] bg-white border border-secondary/10 rounded-[8px] text-[13px] outline-none focus:border-primary w-full shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                        />
                    </div>
                    <Button primaryBtn onClick={openAddDialog} className="h-[40px] px-3 text-[12px] font-bold bg-primary text-white hover:brightness-110 shadow-sm rounded-[8px] flex items-center justify-center gap-1.5 whitespace-nowrap border-0 shrink-0">
                        <Plus size={14} strokeWidth={2.5} /> <span className="hidden xs:inline">Add Rate</span><span className="xs:hidden">Add</span>
                    </Button>
                </div>
            </div>

            <div className="md:hidden space-y-2">
                {isFetching && !filteredRates.length ? (
                    <div className="text-center text-[12px] text-secondary/60 py-4">Loading rates...</div>
                ) : isError ? (
                    <div className="text-center text-[12px] text-primary font-medium py-4">Unable to load rate settings.</div>
                ) : table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map(row => {
                        const r = row.original;
                        const isActive = r.isActive !== false;
                        const pillClass = isActive ? "bg-success/10 text-success" : "bg-secondary/10 text-secondary";
                        const dotClass = isActive ? "bg-success" : "bg-secondary";
                        return (
                            <div key={r._id} className="bg-white p-3 rounded-[11px] border border-secondary/10 shadow-[0_1px_2px_rgba(0,0,0,0.03)] grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-2 relative">
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] text-secondary/60 mb-0.5">Name / Type</span>
                                    <span className="text-[14px] font-bold text-secondary truncate">{r.name || "-"}</span>
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] text-secondary/60 mb-0.5">Site Size</span>
                                    <span className="text-[14px] font-bold text-secondary truncate">{r.site}</span>
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] text-secondary/60 mb-0.5">Rate</span>
                                    <span className="text-[14px] font-bold text-secondary truncate">₹{safeNumber(r.rate).toFixed(2)}</span>
                                </div>
                                <div className="flex flex-col items-end gap-1.5">
                                    <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold whitespace-nowrap h-[20px] ${pillClass}`}>
                                        <div className={`size-1 rounded-full ${dotClass}`} />
                                        {isActive ? "Active" : "Inactive"}
                                    </div>
                                    <div className="flex gap-1.5 mt-0.5">
                                        <button onClick={() => openEditDialog(r)} className="size-6 bg-gray-50 border border-gray-200 rounded flex items-center justify-center text-secondary hover:text-primary active:scale-95 transition-transform shadow-sm">
                                            <Pencil size={11} strokeWidth={2} />
                                        </button>
                                        <button onClick={() => openDeleteDialog(r)} className="size-6 bg-gray-50 border border-gray-200 rounded flex items-center justify-center text-primary hover:brightness-110 active:scale-95 transition-transform shadow-sm">
                                            <Trash2 size={11} strokeWidth={2} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="bg-white rounded-[11px] border border-secondary/10 p-6 flex flex-col items-center justify-center text-center">
                        <span className="text-[12px] font-medium text-secondary/60 mb-3">No rates found.</span>
                    </div>
                )}
                {table.getRowModel().rows.length > 0 && (
                    <div className="text-center py-2 mt-2">
                        {table.getPageCount() > 1 ? (
                            <div className="flex items-center justify-center gap-4 text-[12px] font-medium text-secondary/70 bg-white border border-secondary/10 py-2 rounded-[8px] shadow-sm">
                                <button 
                                    onClick={() => table.previousPage()} 
                                    disabled={!table.getCanPreviousPage()}
                                    className="p-1 disabled:opacity-30 flex items-center gap-1"
                                >
                                    ‹ Prev
                                </button>
                                <span className="font-bold">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
                                <button 
                                    onClick={() => table.nextPage()} 
                                    disabled={!table.getCanNextPage()}
                                    className="p-1 disabled:opacity-30 flex items-center gap-1"
                                >
                                    Next ›
                                </button>
                            </div>
                        ) : (
                            <span className="text-[11px] text-secondary/60 font-bold">{filteredRates.length} rates</span>
                        )}
                    </div>
                )}
            </div>

            {/* Desktop Main Rate Card */}
            <div className="hidden md:flex bg-white rounded-[8px] border border-secondary/10 shadow-sm overflow-hidden flex-col">
                <div className="p-4 border-b border-secondary/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-base font-bold text-secondary">Site & Rate List</h2>
                        <p className="text-xs font-medium text-secondary/60">Set the rate for each site size. These rates will be used in create billing.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" size={16} />
                            <input
                                type="text"
                                placeholder="Search site size or rate..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="pl-9 pr-3 py-2 bg-white border border-secondary/10 rounded-[8px] text-sm outline-none focus:border-primary w-full sm:w-[220px]"
                            />
                        </div>
                        <Button primaryBtn onClick={openAddDialog} className="py-2 px-4 text-sm font-bold bg-primary text-white hover:brightness-110 shadow-sm rounded-[8px] flex items-center gap-1.5 whitespace-nowrap border-0">
                            <Plus size={16} strokeWidth={2.5} /> Add Rate
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-primary text-white border-b border-secondary/10">
                            <tr>
                                {table.getHeaderGroups().map(hg => (
                                    hg.headers.map(header => (
                                        <th key={header.id} className="py-2.5 px-4 font-bold">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary/10">
                            {isFetching && !filteredRates.length ? (
                                <tr>
                                    <td colSpan={columns.length} className="py-5 text-center text-secondary/60">Loading rates...</td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan={columns.length} className="py-5 text-center text-primary font-medium">Unable to load rate settings.</td>
                                </tr>
                            ) : table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map(row => (
                                    <tr key={row.id} className="hover:bg-[#FAF8F6]">
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="py-3 px-4">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="py-8 text-center flex flex-col items-center justify-center gap-2">
                                        <div className="text-secondary/60 font-medium">No rates added yet.</div>
                                        <Button primaryBtn onClick={openAddDialog} className="py-1.5 px-3 text-xs bg-primary text-white rounded flex items-center gap-1 border-0">
                                            <Plus size={14} /> Add Rate
                                        </Button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {table.getRowModel().rows.length > 0 && (
                    <div className="p-4 border-t border-secondary/10">
                        <TablePagination table={table} />
                    </div>
                )}
            </div>

            <RateDialog 
                open={dialogOpen} 
                onClose={() => setDialogOpen(false)} 
                rateToEdit={rateToEdit} 
                queryClient={queryClient} 
            />

            <RateDeleteDialog 
                open={deleteDialogOpen} 
                onClose={() => setDeleteDialogOpen(false)} 
                rateToDelete={rateToDelete} 
                queryClient={queryClient} 
            />
        </div>
    );
}

function RateDialog({ open, onClose, rateToEdit, queryClient }) {
    const [name, setName] = useState("");
    const [site, setSite] = useState("");
    const [rate, setRate] = useState("");
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (open) {
            setName(rateToEdit ? rateToEdit.name || "" : "");
            setSite(rateToEdit ? rateToEdit.site : "");
            setRate(rateToEdit ? rateToEdit.rate : "");
            setIsActive(rateToEdit ? (rateToEdit.isActive !== false) : true);
        }
    }, [open, rateToEdit]);

    const mutationFn = rateToEdit 
        ? (data) => rateService.updateRate(rateToEdit._id, data)
        : (data) => rateService.createRate(data);

    const mutation = useMutation({
        mutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries(["rates"]);
            toast.success(rateToEdit ? "Rate updated successfully" : "Rate added successfully");
            onClose();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const siteVal = Number(site);
        const rateVal = Number(rate);
        if (!name?.trim()) return toast.error("Name is required");
        if (!site || siteVal <= 0) return toast.error("Site must be greater than 0");
        if (rate === "" || rateVal < 0) return toast.error("Rate cannot be negative");
        mutation.mutate({ name: name.trim(), site: siteVal, rate: rateVal, isActive });
    }

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent showCloseButton={false} className="sm:max-w-[450px] rounded-[8px] border border-secondary/10 gap-0 p-0 shadow-lg">
                <DialogHeader className="p-4 border-b border-secondary/10 bg-white rounded-t-[12px]">
                    <DialogTitle className="text-[18px] font-bold text-secondary text-left">
                        {rateToEdit ? "Edit Rate" : "Add Rate"}
                    </DialogTitle>
                    <p className="text-sm font-medium text-secondary/60 text-left">
                        {rateToEdit ? "Modify existing site size and billing rate." : "Add a new site size and billing rate."}
                    </p>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="bg-[#FAF9F7] rounded-b-[12px]">
                    <div className="space-y-4 p-4">
                        <TextInput
                            isRequired
                            label="Rate Name / Type"
                            type="text"
                            placeholder="e.g. Jarkan, CNC, Laser"
                            className="py-2.5 px-3.5 rounded-[8px] text-sm bg-white"
                            labelClassName="text-xs font-bold text-secondary uppercase"
                            containerClassName="space-y-1"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextInput
                            isRequired
                            label="Site Size"
                            type="number"
                            placeholder="e.g. 250"
                            className="py-2.5 px-3.5 rounded-[8px] text-sm bg-white"
                            labelClassName="text-xs font-bold text-secondary uppercase"
                            containerClassName="space-y-1"
                            value={site}
                            onChange={(e) => setSite(e.target.value)}
                        />
                        <TextInput
                            isRequired
                            label="Rate"
                            type="number"
                            step="0.01"
                            placeholder="e.g. 0.10"
                            className="py-2.5 px-3.5 rounded-[8px] text-sm bg-white"
                            labelClassName="text-xs font-bold text-secondary uppercase"
                            containerClassName="space-y-1"
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                        />
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-secondary uppercase block">Status *</label>
                            <select 
                                value={isActive ? "active" : "inactive"}
                                onChange={(e) => setIsActive(e.target.value === "active")}
                                className="w-full text-sm py-2.5 px-3.5 border border-secondary/10 rounded-[8px] focus:border-primary outline-none bg-white"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center xs:justify-end py-4 px-4 gap-3 border-t border-secondary/10 bg-white rounded-b-[12px]">
                        <Button
                            type="button"
                            onClick={onClose}
                            className="text-sm font-bold py-2.5 px-5 xs:ml-auto bg-white hover:bg-secondary/5 border border-secondary/10 text-secondary rounded-[8px]">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            primaryBtn
                            loading={mutation.isPending}
                            disabled={mutation.isPending}
                            className="text-sm font-bold py-2.5 px-5 xs:flex-none flex-1 border-0 rounded-[8px]">
                            {rateToEdit ? "Save Changes" : "Save Rate"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function RateDeleteDialog({ open, onClose, rateToDelete, queryClient }) {
    const mutation = useMutation({
        mutationFn: () => rateService.deleteRate(rateToDelete._id),
        onSuccess: () => {
            queryClient.invalidateQueries(["rates"]);
            toast.success("Rate deleted successfully");
            onClose();
        },
        onError: () => {
            toast.error("Failed to delete rate");
        }
    });

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent showCloseButton={false} className="sm:max-w-[400px] rounded-[8px] border border-secondary/10 gap-0 p-0 shadow-lg">
                <DialogHeader className="p-4 border-b border-secondary/10 bg-white rounded-t-[12px]">
                    <DialogTitle className="text-[18px] font-bold text-secondary text-left">Delete Rate?</DialogTitle>
                </DialogHeader>
                <div className="p-4 bg-[#FAF9F7]">
                    <p className="text-sm font-medium text-secondary/80 leading-relaxed">
                        Are you sure you want to delete the rate for Site <span className="font-bold text-secondary">{rateToDelete?.site}</span>? 
                        Historical invoices using this rate will remain unchanged.
                    </p>
                </div>
                <div className="flex items-center xs:justify-end py-4 px-4 gap-3 border-t border-secondary/10 bg-white rounded-b-[12px]">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="text-sm font-bold py-2.5 px-5 xs:ml-auto bg-white hover:bg-secondary/5 border border-secondary/10 text-secondary rounded-[8px]">
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={() => mutation.mutate()}
                        loading={mutation.isPending}
                        disabled={mutation.isPending}
                        className="text-sm font-bold py-2.5 px-5 xs:flex-none flex-1 bg-primary hover:brightness-110 text-white rounded-[8px] border-0">
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
