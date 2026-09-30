import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invoiceService, dashboardService } from "@/services";
import Button from "@/components/common/Button";
import RecordPaymentDialog from "./RecordPaymentDialog";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { safeNumber, formatCurrency } from "@/lib/utils";
import { FileText, IndianRupee, Clock, CheckCircle2 } from "lucide-react";
import AllInvoiceTable from "./component/AllInvoiceTable";
import SearchComponent from "@/components/common/SearchComponent";
import DateRangeFilter from "@/components/common/DateRangeFilter";
import { Link, useNavigate } from "react-router-dom";
import { Filter, ChevronDown, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import BottomSheet from "@/components/mobile/BottomSheet";
import MobileDateFilter from "@/components/mobile/MobileDateFilter";
import { cn } from "@/lib/utils";

export default function Invoices() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState("All");
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [dateFilter, setDateFilter] = useState({
        year: new Date().getFullYear().toString(),
        startDate: null,
        endDate: null
    });

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

    useEffect(() => {
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, [dateFilter]);
    const [paymentDialog, setPaymentDialog] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });

    const { data: res, isLoading, isFetching } = useQuery({
        queryKey: ["invoices", {
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            search: debouncedSearch,
            fromDate: dateFilter.startDate,
            toDate: dateFilter.endDate,
            status: statusFilter === "All" ? undefined : statusFilter.toLowerCase()
        }],
        queryFn: () => invoiceService.getAll({
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            search: debouncedSearch,
            fromDate: dateFilter.startDate,
            toDate: dateFilter.endDate,
            status: statusFilter === "All" ? undefined : statusFilter.toLowerCase()
        }),
    });

    const { data: dashboardRes } = useQuery({
        queryKey: ["dashboardSummary"],
        queryFn: () => dashboardService.getSummary(),
    });

    const summaryData = dashboardRes?.data?.data || { totalInvoices: 0, paidAmount: 0, pendingAmount: 0 };
    const totalBilling = safeNumber(summaryData.paidAmount) + safeNumber(summaryData.pendingAmount);

    const invoicesArray = res?.data?.data || [];
    const formattedData = {
        data: invoicesArray,
        totalRecord: res?.data?.pagination?.total || 0
    };


    const deleteMutation = useMutation({
        mutationFn: (id) => invoiceService.delete(id),
        onSuccess: () => {
            toast.success("Invoice deleted successfully");
            queryClient.invalidateQueries(["invoices"]);
            queryClient.invalidateQueries(["dashboardSummary"]);
            setDeleteDialog(false);
        }
    });

    const handleOpenPayment = (invoice) => {
        setSelectedInvoice(invoice);
        setPaymentDialog(true);
    };

    const handleOpenDelete = (invoice) => {
        setSelectedInvoice(invoice);
        setDeleteDialog(true);
    };

    return (
        <>
            {/* MOBILE VIEW */}
            <div className="md:hidden flex flex-col w-full bg-transparent">
                <div className="px-3 py-3 flex flex-col gap-2.5">
                    {/* Search */}
                    <div className="w-full">
                        <SearchComponent
                            value={searchInput}
                            onChange={(val) => setSearchInput(val)}
                            onClear={() => setSearchInput("")}
                            containerStyle="w-full h-[40px] shadow-[0_1px_2px_rgba(0,0,0,0.03)] rounded-[10px]"
                            placeholder="Search invoices..."
                        />
                    </div>

                    {/* Invoice Summary - Very Compact */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white p-2 rounded-[11px] border border-[#E4E7EC] shadow-sm flex flex-col justify-center items-center h-[58px]">
                            <span className="text-[9px] font-semibold text-[#64748B] uppercase">Invoices</span>
                            <span className="text-[16px] font-bold text-[#0F172A] mt-0.5">{summaryData.totalInvoices}</span>
                        </div>
                        <div className="bg-white p-2 rounded-[11px] border border-[#E4E7EC] shadow-sm flex flex-col justify-center items-center h-[58px]">
                            <span className="text-[9px] font-semibold text-[#64748B] uppercase">Paid</span>
                            <span className="text-[16px] font-bold text-[#00A651] mt-0.5">{formatCurrency(safeNumber(summaryData.paidAmount))}</span>
                        </div>
                        <div className="bg-white p-2 rounded-[11px] border border-[#E4E7EC] shadow-sm flex flex-col justify-center items-center h-[58px]">
                            <span className="text-[9px] font-semibold text-[#64748B] uppercase">Pending</span>
                            <span className="text-[16px] font-bold text-[#FF9800] mt-0.5">{formatCurrency(safeNumber(summaryData.pendingAmount))}</span>
                        </div>
                    </div>

                    {/* Status Filter Row */}
                    <div className="flex items-center justify-between h-[30px]">
                        <div className="flex items-center gap-1.5">
                            {["All", "Paid", "Pending"].map((stat) => (
                                <button
                                    key={stat}
                                    onClick={() => {
                                        setStatusFilter(stat);
                                        setPagination(prev => ({ ...prev, pageIndex: 0 }));
                                    }}
                                    className={cn(
                                        "text-[11px] font-semibold transition-colors px-3 h-[28px] rounded-full",
                                        statusFilter === stat
                                            ? "bg-[#E50914] text-white shadow-sm"
                                            : "text-[#64748B] bg-transparent hover:text-[#0F172A]"
                                    )}
                                >
                                    {stat}
                                </button>
                            ))}
                        </div>
                        <MobileDateFilter dateFilter={dateFilter} setDateFilter={setDateFilter} />
                    </div>

                    {/* Invoice List */}
                    <div className="space-y-2 mt-1">
                        {isLoading || isFetching ? (
                            Array.from({ length: 4 }).map((_, idx) => (
                                <div key={idx} className="bg-white rounded-[10px] p-2.5 border border-[#E4E7EC] flex items-center gap-3 animate-pulse h-[60px]">
                                    <div className="w-[28px] h-[28px] rounded-md bg-slate-200 shrink-0"></div>
                                    <div className="flex-1 space-y-1.5">
                                        <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                                        <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                                    </div>
                                    <div className="w-16 h-4 bg-slate-200 rounded"></div>
                                </div>
                            ))
                        ) : invoicesArray.length > 0 ? (
                            invoicesArray.map((inv) => {
                                const isPaid = safeNumber(inv.pendingAmount) <= 0;
                                const isPartial = safeNumber(inv.paidAmount) > 0 && safeNumber(inv.pendingAmount) > 0;
                                let statusText = "Pending";
                                let statusClass = "bg-[#FFF1DB] text-[#FF9800]";

                                if (isPaid) {
                                    statusText = "Paid";
                                    statusClass = "bg-[#E4F7EC] text-[#00A651]";
                                } else if (isPartial) {
                                    statusText = "Partial";
                                    statusClass = "bg-[#E0F2FE] text-[#0284C7]";
                                }

                                const customerName = inv.customerSnapshot?.shopName || inv.customerSnapshot?.name || "Unknown";

                                return (
                                    <div
                                        key={inv._id}
                                        onClick={() => navigate(`/invoices/${inv._id}`)}
                                        className="bg-white rounded-[10px] p-2.5 border border-[#E4E7EC] shadow-[0_1px_2px_rgba(0,0,0,0.02)] min-h-[60px] active:scale-[0.98] transition-transform flex items-center justify-between cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-[30px] h-[30px] rounded-md bg-[#FDE8EA] text-[#E50914] flex items-center justify-center shrink-0">
                                                <FileText size={15} strokeWidth={2.5} />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[12px] font-bold text-[#0F172A] truncate">{inv.invoiceNumber}</span>
                                                <span className="text-[9px] text-[#64748B] truncate mt-0.5">
                                                    {new Date(inv.date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })} · {customerName}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end shrink-0 pl-2">
                                            <span className="text-[13px] font-bold text-[#0F172A]">₹{formatCurrency(safeNumber(inv.grandTotal))}</span>
                                            <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] mt-1", statusClass)}>
                                                {statusText}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center bg-white rounded-[12px] border border-[#E4E7EC] min-h-[160px] shadow-sm">
                                <FileText size={34} strokeWidth={1.5} className="text-[#94A3B8] mb-2" />
                                <h3 className="text-[13px] font-bold text-[#0F172A]">No invoices found</h3>
                                <p className="text-[11px] text-[#64748B] mt-1">Try changing the current filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* DESKTOP VIEW */}
            <div className="hidden md:block space-y-5 py-5 px-5 max-w-full mx-auto w-full bg-[#FAFAF9] min-h-[calc(100vh-65px)]">
                {/* Top Summaries */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-[8px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] border border-[#E5E7EB] flex items-center gap-4">
                        <div className="size-14 rounded-xl bg-[#FDE8EA] text-primary flex items-center justify-center shrink-0">
                            <FileText size={28} strokeWidth={1.8} />
                        </div>
                        <div className="flex flex-col items-start truncate overflow-hidden max-w-full w-full">
                            <p className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wide truncate w-full">Total Invoices</p>
                            <h3 className="text-2xl font-bold text-[#0F172A] mt-1 truncate w-full">{summaryData.totalInvoices}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-[8px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] border border-[#E5E7EB] flex items-center gap-4">
                        <div className="size-14 rounded-xl bg-[#E4F7EC] text-[#00A651] flex items-center justify-center shrink-0">
                            <CheckCircle2 size={28} strokeWidth={1.8} />
                        </div>
                        <div className="flex flex-col items-start truncate overflow-hidden max-w-full w-full">
                            <p className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wide truncate w-full">Total Paid Amount</p>
                            <h3 className="text-2xl font-bold text-[#00A651] mt-1 truncate w-full">{formatCurrency(safeNumber(summaryData.paidAmount))}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-[8px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] border border-[#E5E7EB] flex items-center gap-4">
                        <div className="size-14 rounded-xl bg-[#FFF1DB] text-[#FF9800] flex items-center justify-center shrink-0">
                            <Clock size={28} strokeWidth={1.8} />
                        </div>
                        <div className="flex flex-col items-start truncate overflow-hidden max-w-full w-full">
                            <p className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wide truncate w-full">Total Pending Amount</p>
                            <h3 className="text-2xl font-bold text-[#FF9800] mt-1 truncate w-full">{formatCurrency(safeNumber(summaryData.pendingAmount))}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-[8px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] border border-[#E5E7EB] flex items-center gap-4">
                        <div className="size-14 rounded-xl bg-[#F1F3F5] text-[#475467] flex items-center justify-center shrink-0">
                            <IndianRupee size={28} strokeWidth={1.8} />
                        </div>
                        <div className="flex flex-col items-start truncate overflow-hidden max-w-full w-full">
                            <p className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wide truncate w-full">Total Billing</p>
                            <h3 className="text-2xl font-bold text-[#0F172A] mt-1 truncate w-full">{formatCurrency(totalBilling)}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[8px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] border border-[#E5E7EB] flex flex-col">
                    <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-4 p-4 border-b border-[#E5E7EB]">
                        <h2 className="text-[18px] font-bold text-[#0F172A]">Invoice List</h2>
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <DateRangeFilter onApply={setDateFilter} />
                            <SearchComponent
                                value={searchInput}
                                onChange={(val) => setSearchInput(val)}
                                onClear={() => setSearchInput("")}
                                // containerStyle="w-full sm:w-[320px]"
                                placeholder="Search by invoice no., customer name or mobile..."
                            />
                            {/* <button className="flex items-center justify-center size-[42px] border border-[#E5E7EB] rounded-lg text-[#64748B] hover:bg-[#F9FAFB] transition-colors shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                </button> */}
                        </div>
                    </div>
                    <div className="overflow-hidden">
                        <AllInvoiceTable
                            data={formattedData}
                            isLoading={isLoading}
                            isFetching={isFetching}
                            pagination={pagination}
                            setPagination={setPagination}
                            onRecordPayment={handleOpenPayment}
                            onDeleteInvoice={handleOpenDelete}
                        />
                    </div>
                </div>

                {selectedInvoice && (
                    <RecordPaymentDialog
                        open={paymentDialog}
                        onClose={() => {
                            setPaymentDialog(false);
                            setSelectedInvoice(null);
                        }}
                        invoice={selectedInvoice}
                    />
                )}

                {selectedInvoice && (
                    <Dialog open={deleteDialog} onOpenChange={(val) => {
                        if (!val) {
                            setDeleteDialog(false);
                            setSelectedInvoice(null);
                        }
                    }}>
                        <DialogContent showCloseButton={false} className="sm:max-w-[400px] rounded-[8px] border border-[#E5E7EB] p-0">
                            <DialogHeader className="p-4 border-b border-[#E5E7EB]">
                                <DialogTitle className="text-base font-bold text-[#0F172A]">Delete Invoice</DialogTitle>
                            </DialogHeader>
                            <div className="p-4">
                                <p className="text-sm text-[#64748B]">Are you sure you want to delete invoice <span className="font-bold text-[#0F172A]">{selectedInvoice.invoiceNumber}</span>? This action cannot be undone.</p>
                            </div>
                            <div className="p-4 border-t border-[#E5E7EB] flex justify-end gap-3 bg-[#F9FAFB] rounded-b-[12px]">
                                <Button onClick={() => {
                                    setDeleteDialog(false);
                                    setSelectedInvoice(null);
                                }} className="text-sm bg-white border border-[#E5E7EB] text-[#0F172A] py-2 px-4 rounded-lg hover:bg-gray-50 shadow-sm font-medium">Cancel</Button>
                                <Button
                                    onClick={() => deleteMutation.mutate(selectedInvoice._id)}
                                    loading={deleteMutation.isPending}
                                    className="text-sm bg-[#FF1F2D] text-white py-2 px-4 rounded-lg hover:bg-[#E50914] shadow-sm font-medium"
                                >
                                    Delete
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </>
    );
}
