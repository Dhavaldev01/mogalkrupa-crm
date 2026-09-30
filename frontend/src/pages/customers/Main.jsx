import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import customerService from "@/services/customerService";
import AddCustomerDialog from "@/components/common/AddCustomerDialog";
import Button from "@/components/common/Button";
import SearchComponent from "@/components/common/SearchComponent";
import { useState, useEffect } from "react";

import AllCustomersTable from "./component/AllCustomersTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn, safeNumber, formatCurrency, formatIndianMobile } from "@/lib/utils";
import { Users, FileText, IndianRupee, Clock, Plus, Trash2, Loader2, X, TriangleAlert, Phone, ChevronRight, Filter } from "lucide-react";
import { Link } from "react-router-dom";

export default function Customers() {
    const queryClient = useQueryClient();
    const [addCustomerDialog, setAddCustomerDialog] = useState(false);
    const [deleteCustomerDialog, setDeleteCustomerDialog] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });
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


    const { data: customersResponse, isFetching, isLoading, refetch } = useQuery({
        queryKey: ["customers", {
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            search: debouncedSearch
        }],
        queryFn: () => customerService.getCustomers({
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            search: debouncedSearch
        })
    });



    const { data: summaryResponse } = useQuery({
        queryKey: ["customerSummary"],
        queryFn: () => customerService.getCustomerSummary()
    });

    const summaryData = summaryResponse?.data?.data || { totalCustomers: 0, totalBills: 0, totalBilling: 0, pendingAmount: 0 };

    const customersArray = customersResponse?.data?.data || [];
    const formattedData = {
        data: customersArray,
        totalRecord: customersResponse?.data?.pagination?.total || 0
    };

    return (
        <div className="space-y-4 md:space-y-5 py-4 px-3 md:py-5 md:px-5 max-w-full mx-auto w-full pb-[calc(80px+env(safe-area-inset-bottom))] md:pb-[20px] bg-[#F8FAFC] md:bg-transparent min-h-screen md:min-h-0">
            {/* Desktop Summary Cards */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4">
                <div className="bg-white p-4 rounded-[8px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] border border-[#E4E7EC] flex items-center gap-4">
                    <div className="size-14 rounded-xl bg-[#FDEBEC] text-primary flex items-center justify-center shrink-0">
                        <Users size={28} strokeWidth={1.8} />
                    </div>
                    <div className="flex flex-col items-start">
                        <p className="text-[13px] font-semibold text-[#667085] uppercase tracking-wide">Total Customers</p>
                        <h3 className="text-xl md:text-2xl font-bold text-[#0F1B35] mt-1">{summaryData.totalCustomers}</h3>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-[8px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] border border-[#E4E7EC] flex items-center gap-4">
                    <div className="size-14 rounded-xl bg-[#FDEBEC] text-primary flex items-center justify-center shrink-0">
                        <FileText size={28} strokeWidth={1.8} />
                    </div>
                    <div className="flex flex-col items-start">
                        <p className="text-[13px] font-semibold text-[#667085] uppercase tracking-wide">Total Bills</p>
                        <h3 className="text-xl md:text-2xl font-bold text-[#0F1B35] mt-1">{summaryData.totalBills}</h3>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-[8px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] border border-[#E4E7EC] flex items-center gap-4">
                    <div className="size-14 rounded-xl bg-[#F1F3F5] text-[#475467] flex items-center justify-center shrink-0">
                        <IndianRupee size={28} strokeWidth={1.8} />
                    </div>
                    <div className="flex flex-col items-start truncate overflow-hidden max-w-full w-full">
                        <p className="text-[13px] font-semibold text-[#667085] uppercase tracking-wide truncate w-full">Total Billing</p>
                        <h3 className="text-xl md:text-2xl font-bold text-[#0F1B35] mt-1 truncate w-full">{formatCurrency(safeNumber(summaryData.totalBilling))}</h3>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-[8px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] border border-[#E4E7EC] flex items-center gap-4">
                    <div className="size-14 rounded-xl bg-[#FEF3F2] text-primary flex items-center justify-center shrink-0">
                        <Clock size={28} strokeWidth={1.8} />
                    </div>
                    <div className="flex flex-col items-start truncate overflow-hidden max-w-full w-full">
                        <p className="text-[13px] font-semibold text-[#667085] uppercase tracking-wide truncate w-full">Pending Amount</p>
                        <h3 className="text-xl md:text-2xl font-bold text-primary mt-1 truncate w-full">
                            {formatCurrency(safeNumber(summaryData.pendingAmount))}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Mobile Actions: Search, Filter, Add Customer */}
            <div className="md:hidden flex flex-col gap-3">
                <div className="w-full">
                    <SearchComponent
                        value={searchInput}
                        onChange={(val) => setSearchInput(val)}
                        onClear={() => setSearchInput("")}
                        containerStyle="w-full shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                        placeholder="Search customers..."
                    />
                </div>
                <button
                    onClick={() => { setSelectedCustomer(null); setAddCustomerDialog(true); }}
                    className="w-full h-[42px] bg-[#E50914] text-white rounded-[10px] flex items-center justify-center gap-2 text-[13px] font-semibold shadow-sm outline-none"
                >
                    <Plus size={16} strokeWidth={2.5} /> Add Customer
                </button>
            </div>

            {/* Mobile Customer List */}
            <div className="md:hidden space-y-2">
                {isLoading || isFetching ? (
                    // Loading Skeletons
                    Array.from({ length: 4 }).map((_, idx) => (
                        <div key={idx} className="bg-white rounded-[12px] p-3 border border-[#E4E7EC] flex items-center gap-3 animate-pulse min-h-[74px]">
                            <div className="w-[38px] h-[38px] rounded-full bg-slate-200 shrink-0"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-3.5 bg-slate-200 rounded w-1/2"></div>
                                <div className="h-2.5 bg-slate-200 rounded w-2/3"></div>
                                <div className="h-4 bg-slate-200 rounded-full w-20 mt-1"></div>
                            </div>
                        </div>
                    ))
                ) : customersArray.length > 0 ? (
                    customersArray.map((customer) => {
                        const name = customer.shopName || `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Unknown";
                        const initial = name.charAt(0).toUpperCase();
                        const pending = safeNumber(customer.pendingAmount);
                        // A simple deterministic color based on the first letter char code
                        const hue = (initial.charCodeAt(0) * 137) % 360;
                        const avatarBg = `hsl(${hue}, 70%, 90%)`;
                        const avatarColor = `hsl(${hue}, 70%, 30%)`;

                        return (
                            <Link
                                to={`/customers/${customer._id}`}
                                key={customer._id}
                                className="block bg-white rounded-[12px] p-3 border border-[#E4E7EC] shadow-[0_1px_2px_rgba(0,0,0,0.02)] active:scale-[0.98] transition-transform"
                            >
                                <div className="flex items-center gap-3 w-full">
                                    {/* Avatar */}
                                    <div
                                        className="w-[38px] h-[38px] shrink-0 rounded-full flex items-center justify-center text-[15px] font-bold"
                                        style={{ backgroundColor: avatarBg, color: avatarColor }}
                                    >
                                        {initial}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 flex items-center gap-3">
                                        <div className="flex-1">
                                            <h3 className="text-[13px] font-bold text-[#0F172A] truncate">
                                                {name}
                                            </h3>

                                            <div className="flex items-center gap-1 text-[11px] text-[#64748B] mt-0.5 truncate">
                                                {customer.mobileNumber ? (
                                                    <div className="flex items-center gap-1 truncate">
                                                        {formatIndianMobile(customer.mobileNumber)}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>

                                        {pending > 0 && <span className="inline-flex items-center h-[18px] px-2 rounded-full text-[9px] font-bold bg-[#FEF3C7] text-[#D97706]">
                                            Pending {formatCurrency(pending)}
                                        </span>}
                                    </div>

                                    {/* Chevron */}
                                    <div className="shrink-0 flex items-center justify-center w-[24px]">
                                        <ChevronRight size={18} className="text-[#94A3B8]" strokeWidth={2} />
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    // Empty State
                    <div className="flex flex-col items-center justify-center py-12 bg-white rounded-[12px] border border-[#E4E7EC]">
                        <Users size={32} className="text-[#94A3B8] mb-3" />
                        <p className="text-[14px] font-bold text-[#0F172A]">No customers found</p>
                        <button
                            onClick={() => { setSelectedCustomer(null); setAddCustomerDialog(true); }}
                            className="mt-4 h-[36px] px-4 bg-[#E50914] text-white rounded-lg text-[12px] font-semibold"
                        >
                            + Add Customer
                        </button>
                    </div>
                )}
            </div>

            {/* Desktop Customer List Container */}
            <div className="hidden md:flex bg-white rounded-[8px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] border border-[#E4E7EC] flex-col">
                <div className="flex items-center justify-between gap-4 p-4 border-b border-[#E4E7EC]">
                    <h2 className="text-[18px] font-bold text-[#0F1B35]">Customers</h2>
                    <div className="flex items-center gap-3">
                        <SearchComponent
                            value={searchInput}
                            onChange={(val) => setSearchInput(val)}
                            onClear={() => setSearchInput("")}
                            // containerStyle="w-[400px]"
                            placeholder="Search by name, company or mobile..."
                        />
                        <button
                            onClick={() => { setSelectedCustomer(null); setAddCustomerDialog(true); }}
                            className="bg-primary hover:bg-[#C90C15] text-white font-medium py-2.5 px-4 rounded-lg flex items-center gap-2 text-sm transition-colors whitespace-nowrap shrink-0">
                            <Plus size={16} strokeWidth={2.5} /> Add Customer
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-b overflow-hidden">
                    <AllCustomersTable
                        data={formattedData}
                        isLoading={isLoading}
                        isFetching={isFetching}
                        pagination={pagination}
                        setPagination={setPagination}
                        onEditCustomer={(customer) => { setSelectedCustomer(customer); setAddCustomerDialog(true); }}
                        onDeleteCustomer={(customer) => { setSelectedCustomer(customer); setDeleteCustomerDialog(true); }}
                    />
                </div>
            </div>

            <AddCustomerDialog
                open={addCustomerDialog}
                onClose={() => { setAddCustomerDialog(false); setSelectedCustomer(null); }}
                refetchCustomer={() => { refetch(); queryClient.invalidateQueries(["customerSummary"]); }}
                initialData={selectedCustomer}
            />

            <CustomerDeleteDialog
                open={deleteCustomerDialog}
                onClose={() => { setDeleteCustomerDialog(false); setSelectedCustomer(null); }}
                customerToDelete={selectedCustomer}
                refetchCustomer={() => { refetch(); queryClient.invalidateQueries(["customerSummary"]); }}
            />
        </div>
    )
}

function CustomerDeleteDialog({ open, onClose, customerToDelete, refetchCustomer }) {
    const mutation = useMutation({
        mutationFn: () => customerService.deleteCustomer(customerToDelete._id),
        onSuccess: () => {
            refetchCustomer();
            toast.success("Customer deleted successfully");
            onClose();
        },
        onError: () => {
            toast.error("Failed to delete customer");
        }
    });

    const isDeleting = mutation.isPending;
    const customerName = customerToDelete?.shopName || `${customerToDelete?.firstName || ""} ${customerToDelete?.lastName || ""}`.trim();

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!val && !isDeleting) onClose();
        }}>
            <DialogContent
                showCloseButton={false}
                className="sm:max-w-[450px] bg-white rounded-[14px] border border-[#E5E7EB] shadow-[0px_8px_24px_rgba(0,0,0,0.08)] p-0 gap-0 overflow-hidden"
            >
                <div className="p-5">
                    {/* Optional Close Button */}
                    <button
                        onClick={() => !isDeleting && onClose()}
                        disabled={isDeleting}
                        className="absolute right-4 top-4 size-8 flex items-center justify-center rounded-full bg-transparent hover:bg-secondary/5 text-[#64748B] transition-colors outline-none disabled:opacity-50"
                    >
                        <X size={18} strokeWidth={2} />
                    </button>

                    <div className="flex gap-4">
                        <div className="size-12 min-w-[48px] rounded-full bg-[#FDE8EA] flex items-center justify-center text-[#E50914] shrink-0">
                            <TriangleAlert size={24} strokeWidth={2} />
                        </div>
                        <div className="flex flex-col pt-1">
                            <DialogTitle className="text-[18px] font-bold text-[#0F172A] leading-tight mb-2">
                                Delete Customer?
                            </DialogTitle>
                            <p className="text-[14px] text-[#475569] leading-relaxed">
                                Are you sure you want to delete <span className="font-semibold text-[#0F172A]">"{customerName}"</span>?
                            </p>
                            <p className="text-[13px] text-[#64748B] mt-1.5">
                                This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end py-4 px-5 gap-3 bg-[#FAFAFA] border-t border-[#E5E7EB]">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="h-[40px] px-[18px] bg-white border border-[#E5E7EB] rounded-[8px] text-[14px] font-medium text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-colors outline-none focus:ring-2 focus:ring-secondary/10 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => mutation.mutate()}
                        disabled={isDeleting}
                        className="h-[40px] px-[18px] bg-[#E50914] text-white rounded-[8px] text-[14px] font-semibold hover:bg-[#C90C15] active:bg-[#B00A12] transition-colors outline-none focus:ring-2 focus:ring-[#E50914]/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? (
                            <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
                        ) : (
                            <Trash2 size={16} strokeWidth={2.5} />
                        )}
                        {isDeleting ? "Deleting..." : "Delete Customer"}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}