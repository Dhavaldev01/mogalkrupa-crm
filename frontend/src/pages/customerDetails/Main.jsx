import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    ArrowLeft, Phone, MapPin, Pencil, EllipsisVertical,
    FileText, CreditCard, BarChart3, Clock,
    Eye, Printer, Trash2, Search
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import BillingPeriodPicker from "@/components/common/BillingPeriodPicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddCustomerDialog from "@/components/common/AddCustomerDialog";
import BulkPaymentDialog from "@/pages/invoices/BulkPaymentDialog";
import Checkbox from "@/components/common/Checkbox";
import RecordPaymentDialog from "@/pages/invoices/RecordPaymentDialog";
import customerService from "@/services/customerService";
import invoiceService from "@/services/invoiceService";
import { getInitials, safeNumber, formatIndianMobile, formatCurrency, cn, formatCount } from "@/lib/utils";
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";

export default function CustomerDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [page, setPage] = useState({ pageIndex: 0, pageSize: 10 });
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const [exportPeriod, setExportPeriod] = useState(undefined);
    const [exportStatus, setExportStatus] = useState("All");
    const [isExporting, setIsExporting] = useState(false);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [paymentInvoice, setPaymentInvoice] = useState(null);
    const [rowSelection, setRowSelection] = useState({});
    const [isBulkPaymentOpen, setIsBulkPaymentOpen] = useState(false);
    const [selectedBillIds, setSelectedBillIds] = useState([]);

    const toggleBillSelection = (invoiceId) => {
        setSelectedBillIds((current) =>
            current.includes(invoiceId)
                ? current.filter((id) => id !== invoiceId)
                : [...current, invoiceId]
        );
    };

    const handleExport = async () => {
        try {
            setIsExporting(true);
            const params = { status: exportStatus };
            if (exportPeriod?.type === "month" && exportPeriod.date) {
                const mDate = exportPeriod.date;
                const firstDay = new Date(mDate.getFullYear(), mDate.getMonth(), 1);
                const lastDay = new Date(mDate.getFullYear(), mDate.getMonth() + 1, 0);
                params.startDate = format(firstDay, 'yyyy-MM-dd');
                params.endDate = format(lastDay, 'yyyy-MM-dd');
            } else if (exportPeriod?.type === "range") {
                if (exportPeriod.from && exportPeriod.to) {
                    params.startDate = format(exportPeriod.from, 'yyyy-MM-dd');
                    params.endDate = format(exportPeriod.to, 'yyyy-MM-dd');
                } else if (exportPeriod.from) {
                    params.startDate = format(exportPeriod.from, 'yyyy-MM-dd');
                    params.endDate = format(exportPeriod.from, 'yyyy-MM-dd');
                }
            }

            const response = await invoiceService.exportCustomerInvoices(id, params);
            
            const contentDisposition = response.headers['content-disposition'];
            let filename = "export.xlsx";
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?([^"]+)"?/);
                if (match) filename = match[1];
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Excel exported successfully.");
        } catch (error) {
            console.error(error);
            let msg = "Failed to export invoices. Please try again.";
            if (error.response?.data?.type === 'application/json') {
                 const text = await error.response.data.text();
                 try {
                     const json = JSON.parse(text);
                     if (json.message) msg = json.message;
                 } catch(e){}
            } else if (error.response?.status === 404) {
                 msg = "No invoices found for the selected month and status.";
            }
            toast.error(msg);
        } finally {
            setIsExporting(false);
        }
    };

    // 1. Fetch Customer Profile
    const { data: customerRes, isLoading: isCustomerLoading } = useQuery({
        queryKey: ["customer", id],
        queryFn: () => customerService.getCustomerById(id),
        enabled: !!id
    });

    const rawCustomer = customerRes?.data?.data;

    const customer = rawCustomer ? {
        _id: rawCustomer._id,
        shopName: rawCustomer.shopName || rawCustomer.companyName || "",
        firstName: rawCustomer.firstName || rawCustomer.name || "",
        lastName: rawCustomer.lastName || "",
        mobileNumber: rawCustomer.mobileNumber || rawCustomer.phone || "",
        address: rawCustomer.address || "",
        gstin: rawCustomer.gstin || "",
        createdAt: rawCustomer.createdAt,
    } : null;

    const fullName = customer ? [customer.firstName, customer.lastName].filter(Boolean).join(" ") : "";
    const displayInitials = getInitials(fullName || customer?.shopName || "");

    // 2. Fetch Customer Summary
    const { data: summaryRes, isLoading: isSummaryLoading } = useQuery({
        queryKey: ["customerSummary", id],
        queryFn: () => customerService.getCustomerSummaryById(id),
        enabled: !!id
    });
    const summary = summaryRes?.data?.data || {};

    // 3. Fetch Bills (Invoices)
    const { data: billsRes, isLoading: isBillsLoading, isFetching: isBillsFetching } = useQuery({
        queryKey: ["customerInvoices", id, search, status, page.pageIndex, page.pageSize],
        queryFn: () => invoiceService.getInvoices({
            customerId: id,
            search,
            status,
            page: page.pageIndex + 1,
            limit: page.pageSize
        }),
        enabled: !!id
    });
    const bills = billsRes?.data?.data || [];
    const billsTotal = billsRes?.data?.pagination?.total || 0;

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: () => customerService.deleteCustomer(id),
        onSuccess: () => {
            toast.success("Customer deactivated successfully");
            navigate("/customers");
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Unable to delete customer");
        }
    });

    const deleteInvoiceMutation = useMutation({
        mutationFn: (invoiceId) => invoiceService.deleteInvoice(invoiceId),
        onSuccess: () => {
            toast.success("Invoice deleted successfully");
            queryClient.invalidateQueries(["customerInvoices", id]);
            queryClient.invalidateQueries(["customerSummary", id]);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Failed to delete invoice");
        }
    });

    // Mobile selected invoices
    const mobileSelectedInvoices = bills.filter((invoice) =>
        selectedBillIds.includes(invoice._id)
    );

    const mobileSelectedPending = mobileSelectedInvoices.reduce(
        (total, invoice) => total + safeNumber(invoice.pendingAmount),
        0
    );

    // Table Columns
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
                            table.toggleAllPageRowsSelected(e.target.checked);
                        }}
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    {row.original.status !== "Paid" && row.original.pendingAmount > 0 ? (
                        <Checkbox
                            checked={row.getIsSelected()}
                            onChange={(e) => {
                                row.toggleSelected(e.target.checked);
                            }}
                        />
                    ) : null}
                </div>
            ),
        },
        {
            id: "index",
            header: "#",
            cell: (info) => (page.pageIndex * page.pageSize) + info.row.index + 1
        },
        {
            accessorKey: "invoiceNumber",
            header: "Invoice No.",
            cell: (info) => <span className="font-bold">{info.getValue()}</span>
        },
        {
            accessorKey: "date",
            header: "Date",
            cell: (info) => format(new Date(info.getValue()), "dd MMM yyyy")
        },
        {
            accessorKey: "grandTotal",
            header: "Bill Amount",
            cell: (info) => `₹ ${safeNumber(info.getValue()).toFixed(2)}`
        },
        {
            accessorKey: "paidAmount",
            header: "Paid Amount",
            cell: (info) => <span className="text-[#08A64A]">₹ {safeNumber(info.getValue()).toFixed(2)}</span>
        },
        {
            accessorKey: "discountAmount",
            header: "Discount",
            cell: (info) => {
                const discount = safeNumber(info.getValue());
                return discount > 0 ? (
                    <span className="text-[#D97706] font-medium">₹ {discount.toFixed(2)}</span>
                ) : (
                    <span className="text-secondary/30">-</span>
                );
            }
        },
        {
            accessorKey: "pendingAmount",
            header: "Pending Amount",
            cell: (info) => {
                const pending = safeNumber(info.getValue());
                return <span className={pending > 0 ? "text-[#E50914]" : "text-black/80"}>₹ {pending.toFixed(2)}</span>;
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: (info) => {
                const st = info.getValue();
                let pillClass = "bg-[#E50914]/10 text-[#E50914]";
                let dotClass = "bg-[#E50914]";
                if (st === "Paid") {
                    pillClass = "bg-[#08A64A]/10 text-[#08A64A]";
                    dotClass = "bg-[#08A64A]";
                } else if (st === "Partial") {
                    pillClass = "bg-[#F59E0B]/10 text-[#D97706]";
                    dotClass = "bg-[#F59E0B]";
                }
                return (
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${pillClass}`}>
                        <div className={`size-1.5 rounded-full ${dotClass}`} />
                        {st}
                    </div>
                );
            }
        },
        {
            id: "actions",
            header: "Action",
            cell: (info) => {
                const inv = info.row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Link to={`/invoices/${inv._id}`} className="p-1 text-secondary hover:text-primary transition-colors border rounded bg-white shadow-sm">
                            <Eye size={15} />
                        </Link>
                        <Link to={`/invoices/${inv._id}`} className="p-1 text-secondary hover:text-primary transition-colors border rounded bg-white shadow-sm">
                            <Printer size={15} />
                        </Link>
                        {(inv.status === "Pending" || inv.status === "Partial") && (
                            <button onClick={() => setPaymentInvoice(inv)} className="p-1 text-[#F59E0B] hover:text-[#D97706] transition-colors border rounded bg-white shadow-sm">
                                <Pencil size={15} />
                            </button>
                        )}
                        <button onClick={() => {
                            if (window.confirm("Are you sure you want to delete this invoice?")) {
                                deleteInvoiceMutation.mutate(inv._id);
                            }
                        }} className="p-1 text-[#E50914] hover:text-[#C90C15] transition-colors border rounded bg-white shadow-sm">
                            <Trash2 size={15} />
                        </button>
                    </div>
                );
            }
        }
    ];

    const table = useReactTable({
        data: bills,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: Math.ceil(billsTotal / page.pageSize),
        state: { pagination: page, rowSelection },
        onRowSelectionChange: setRowSelection,
        enableRowSelection: row => row.original.status !== "Paid" && row.original.pendingAmount > 0,
        onPaginationChange: setPage,
    });

    if (isCustomerLoading) {
        return (
            <div className="p-3 md:p-4 space-y-4 md:space-y-5 w-full max-w-full overflow-x-hidden min-h-[calc(100vh-56px)] bg-[#F8FAFC] md:bg-transparent pb-[100px] md:pb-4">
                <Skeleton className="h-[200px] w-full rounded-[8px] bg-secondary/10" />
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="p-10 flex flex-col items-center justify-center gap-4">
                <h2 className="text-xl font-bold text-secondary">Customer not found.</h2>
                <Link to="/customers" className="px-4 py-2 bg-[#E50914] text-white rounded font-bold text-sm">
                    Back to Customers
                </Link>
            </div>
        );
    }

    return (
        <>
            {/* MOBILE VIEW */}
            <div className="md:hidden flex flex-col min-h-screen bg-[#F8FAFC] pb-[100px] box-border w-full max-w-full overflow-x-hidden">
                <div className="px-4 py-3 flex flex-col gap-3">
                    <div>
                        <h1 className="text-[26px] font-[800] text-[#0F1B35] leading-tight">Customers</h1>
                        <p className="text-[13px] text-[#71809B]">Customer details and billing information</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <BillingPeriodPicker value={exportPeriod} onApply={setExportPeriod} isMobile={true} />
                        <Select value={exportStatus} onValueChange={setExportStatus}>
                            <SelectTrigger className="h-[36px] bg-white border-[#E5E7EB] rounded-[8px] text-[13px] flex-1 min-w-[120px]">
                                <SelectValue placeholder="All Records" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem value="All">All Records</SelectItem>
                                <SelectItem value="Paid">Paid</SelectItem>
                                <SelectItem value="Unpaid">Unpaid</SelectItem>
                            </SelectContent>
                        </Select>
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="h-[36px] px-3 w-full bg-[#E50914] text-white text-[13px] font-bold rounded-[8px] hover:bg-[#C90C15] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isExporting ? "Exporting..." : "Export Excel"}
                        </button>
                    </div>
                </div>

                <div className="px-4 mb-4">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71809B]" size={16} />
                        <input
                            type="text"
                            placeholder="Search customer..."
                            className="w-full h-[44px] pl-9 pr-4 bg-white border border-[#E5E7EB] rounded-[12px] text-[13px] outline-none shadow-sm"
                        />
                    </div>
                </div>

                <div className="px-4 mb-4">
                    <div className="bg-white rounded-[14px] p-4 border border-[#E5E7EB] shadow-[0_2px_10px_rgba(0,0,0,0.02)] w-full">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-3">
                                <div className="w-[56px] h-[56px] rounded-full bg-[#FDE8EA] flex items-center justify-center shrink-0">
                                    <span className="text-[#E50914] font-bold text-xl">{displayInitials}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-[18px] font-[700] text-[#0F1B35]">{customer.shopName}</h2>
                                        <span className="bg-[#E6F6ED] text-[#00A651] text-[10px] font-bold px-2 py-0.5 rounded-full">● Active</span>
                                    </div>
                                    {fullName && <p className="text-[13px] text-[#71809B] mt-0.5">{fullName}</p>}
                                    <div className="flex flex-col gap-1 mt-2">
                                        <div className="flex items-center gap-1.5 text-[11px] text-[#71809B]">
                                            <Phone size={12} /> {formatIndianMobile(customer.mobileNumber) || customer.mobileNumber}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[11px] text-[#71809B]">
                                            <MapPin size={12} /> <span className="line-clamp-1">{customer.address || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-[1px] bg-[#E5E7EB] my-4"></div>

                        <div className="flex items-center justify-between gap-2">
                            <button onClick={() => setIsEditOpen(true)} className="flex items-center justify-center gap-1.5 text-[13px] font-semibold text-[#0F1B35] bg-white border border-[#E5E7EB] px-3 py-1.5 rounded-[8px] flex-1">
                                <Pencil size={12} /> Edit Customer
                            </button>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="w-[32px] h-[32px] flex items-center justify-center border border-[#E5E7EB] rounded-[8px] outline-none">
                                    <EllipsisVertical size={14} className="text-[#0F1B35]" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-white border border-[#E5E7EB] shadow-lg rounded-[8px] z-50">
                                    <DropdownMenuItem onClick={() => navigate(`/billing/create?customerId=${customer._id}`)} className="text-sm font-medium text-[#243044]">
                                        Create Bill
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                <div className="px-4 mb-4">
                    <div className="grid grid-cols-2 gap-[10px]">
                        <div className="space-y-2 min-w-0 bg-white p-3 rounded-[13px] border border-[#E5E7EB] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                            <div className="flex items-center gap-2">
                                <FileText size={14} className="text-[#71809B]" />
                                <span className="text-[10px] font-[700] text-[#71809B] uppercase whitespace-nowrap">TOTAL BILLS</span>
                            </div>
                            <div className="flex items-center justify-between mt-auto">
                                <span className="font-[800] text-[#0F1B35] whitespace-nowrap min-w-0 truncate" style={{ fontSize: 'clamp(15px, 4.3vw, 21px)' }}>
                                    {isSummaryLoading ? "..." : summary.totalBills}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2 min-w-0 bg-white p-3 rounded-[13px] border border-[#E5E7EB] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                            <div className="flex items-center gap-2">
                                <CreditCard size={14} className="text-[#71809B]" />
                                <span className="text-[10px] font-[700] text-[#71809B] uppercase whitespace-nowrap">PAID AMOUNT</span>
                            </div>
                            <div className="flex items-center justify-between mt-auto">
                                <span className="font-[800] text-[#0F1B35] whitespace-nowrap min-w-0 truncate" style={{ fontSize: 'clamp(15px, 4.3vw, 21px)' }}>
                                    {isSummaryLoading ? "..." : `₹${safeNumber(summary.paidAmount).toFixed(2)}`}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2 min-w-0 bg-white p-3 rounded-[13px] border border-[#E5E7EB] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                            <div className="flex items-center gap-2">
                                <Clock size={14} className="text-[#71809B]" />
                                <span className="text-[10px] font-[700] text-[#71809B] uppercase whitespace-nowrap">PENDING AMOUNT</span>
                            </div>
                            <div className="flex items-center justify-between mt-auto">
                                <span className="font-[800] text-[#0F1B35] whitespace-nowrap min-w-0 truncate" style={{ fontSize: 'clamp(15px, 4.3vw, 21px)' }}>
                                    {isSummaryLoading ? "..." : `₹${safeNumber(summary.pendingAmount).toFixed(2)}`}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2 min-w-0 bg-white p-3 rounded-[13px] border border-[#E5E7EB] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                            <div className="flex items-center gap-2">
                                <BarChart3 size={14} className="text-[#71809B]" />
                                <span className="text-[10px] font-[700] text-[#71809B] uppercase whitespace-nowrap">TOTAL BILLING</span>
                            </div>
                            <div className="flex items-center justify-between mt-auto">
                                <span className="font-[800] text-[#0F1B35] whitespace-nowrap min-w-0 truncate" style={{ fontSize: 'clamp(15px, 4.3vw, 21px)' }}>
                                    {isSummaryLoading ? "..." : `₹${safeNumber(summary.totalBilling).toFixed(2)}`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-4 mb-4">
                    <div className="bg-white rounded-[14px] border border-[#E5E7EB] shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
                        <div className="p-3 border-b border-[#E5E7EB] flex items-center gap-2">
                            <FileText size={18} className="text-[#0F1B35]" />
                            <h3 className="text-[14px] font-[700] text-[#0F1B35]">Bill History</h3>
                        </div>

                        {selectedBillIds.length > 0 && (
                            <div className="space-y-2 p-3 border-b border-[#DED8D3] bg-secondary/5">
                                <div className="flex gap-2 text-xs">
                                    <div className="font-bold text-secondary">
                                        <span className="font-bold text-[#E50914]">{formatCount(selectedBillIds.length)}</span> - Invoices
                                    </div>

                                    <div className="font-semibold text-xs text-secondary/70 ml-auto">
                                        <span className="block text-right">Pending:</span>
                                        <span className="font-bold text-[#E50914] block text-right">
                                            ₹{mobileSelectedPending.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setSelectedBillIds([])}
                                        className="text-xs font-bold text-secondary hover:text-secondary/80 bg-white border border-[#DED8D3] px-3 py-1.5 rounded transition-colors"
                                    >
                                        Clear
                                    </button>

                                    <button
                                        onClick={() => setIsBulkPaymentOpen(true)}
                                        className="text-xs font-bold text-white bg-[#E50914] hover:bg-[#C90C15] px-4 py-1.5 rounded shadow-sm transition-colors flex-1"
                                    >
                                        Collect Payment
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="p-3 bg-[#FAFAFA] flex items-center gap-2 border-b border-[#E5E7EB]">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#71809B]" size={14} />
                                <input
                                    type="text"
                                    placeholder="Search bills..."
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setPage(prev => ({ ...prev, pageIndex: 0 })); }}
                                    className="w-full h-[36px] pl-8 pr-3 bg-white border border-[#E5E7EB] rounded-[8px] text-[12px] outline-none"
                                />
                            </div>
                            <Select value={status || "All"} onValueChange={(val) => { setStatus(val === "All" ? "" : val); setPage(prev => ({ ...prev, pageIndex: 0 })); }}>
                                <SelectTrigger className="h-[36px] w-[100px] bg-white border-[#E5E7EB] rounded-[8px] text-[12px] font-medium outline-none">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent className="bg-white z-50">
                                    <SelectItem value="All" className="text-[12px]">All Status</SelectItem>
                                    <SelectItem value="Paid" className="text-[12px]">Paid</SelectItem>
                                    <SelectItem value="Partial" className="text-[12px]">Partial</SelectItem>
                                    <SelectItem value="Pending" className="text-[12px]">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col">
                            {isBillsFetching ? (
                                <div className="p-6 text-center text-[12px] text-[#71809B]">Loading invoices...</div>
                            ) : bills.length > 0 ? (
                                bills.map((inv, idx) => {
                                    const isChecked = selectedBillIds.includes(inv._id);
                                    return (
                                        <div key={inv._id} className="p-3 border-b border-[#E5E7EB] last:border-0 hover:bg-[#FAFAFA] transition-colors" onClick={() => navigate(`/invoices/${inv._id}`)}>
                                            <div className="grid items-center gap-[8px]" style={{ gridTemplateColumns: '20px minmax(0, 1fr) auto 16px' }}>
                                                <div
                                                    className="flex items-center justify-center h-full cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        if (
                                                            inv.status !== "Paid" &&
                                                            safeNumber(inv.pendingAmount) > 0
                                                        ) {
                                                            toggleBillSelection(inv._id);
                                                        }
                                                    }}
                                                >
                                                    <div
                                                        className={`w-[16px] h-[16px] rounded-[4px] border flex items-center justify-center transition-colors ${isChecked
                                                            ? "bg-[#E50914] border-[#E50914]"
                                                            : "bg-white border-[#D7DEE8]"
                                                            }`}
                                                    >
                                                        {isChecked && (
                                                            <svg
                                                                width="10"
                                                                height="8"
                                                                viewBox="0 0 10 8"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M1 4L3.5 6.5L9 1"
                                                                    stroke="white"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[13px] font-[700] text-[#0F1B35] truncate">{inv.invoiceNumber}</span>
                                                    <span className="text-[11px] text-[#71809B] mt-0.5">{format(new Date(inv.date), "dd MMM yyyy")}</span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[13px] font-[700] text-[#0F1B35]">₹{safeNumber(inv.grandTotal).toFixed(2)}</span>
                                                    {inv.status === "Paid" ? (
                                                        <span className="bg-[#E6F6ED] text-[#00A651] text-[10px] font-[700] px-2 py-0.5 rounded-full mt-1">Paid</span>
                                                    ) : inv.status === "Partial" ? (
                                                        <span className="bg-[#FFF4E5] text-[#FF9800] text-[10px] font-[700] px-2 py-0.5 rounded-full mt-1">Partial</span>
                                                    ) : (
                                                        <span className="bg-[#FDE8EA] text-[#E50914] text-[10px] font-[700] px-2 py-0.5 rounded-full mt-1">Pending</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-end text-[#D7DEE8]">
                                                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-6 text-center text-[12px] text-[#71809B]">No invoices found.</div>
                            )}
                        </div>

                        {billsTotal > 0 && (
                            <div className="flex items-center justify-between p-3 border-t border-[#E5E7EB] bg-[#FAFAFA]">
                                <span className="text-[11px] text-[#71809B]">
                                    Showing {(page.pageIndex * page.pageSize) + 1} to {Math.min((page.pageIndex + 1) * page.pageSize, billsTotal)} of {billsTotal}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setPage(p => ({ ...p, pageIndex: p.pageIndex - 1 })); }}
                                        disabled={page.pageIndex === 0}
                                        className="w-[24px] h-[24px] flex items-center justify-center bg-white border border-[#E5E7EB] rounded text-[#71809B] disabled:opacity-50"
                                    >
                                        {"<"}
                                    </button>
                                    <span className="text-[11px] font-[700] text-[#0F1B35] mx-1">{page.pageIndex + 1}</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setPage(p => ({ ...p, pageIndex: p.pageIndex + 1 })); }}
                                        disabled={(page.pageIndex + 1) * page.pageSize >= billsTotal}
                                        className="w-[24px] h-[24px] flex items-center justify-center bg-white border border-[#E5E7EB] rounded text-[#71809B] disabled:opacity-50"
                                    >
                                        {">"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* DESKTOP VIEW */}
            <div className="hidden md:block p-3 md:p-4 space-y-4 md:space-y-5 w-full max-w-full overflow-x-hidden min-h-[calc(100vh-56px)] bg-transparent md:pb-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/customers" className="size-8 rounded flex items-center justify-center bg-white border border-[#DED8D3] hover:bg-secondary/5 text-[#243044] transition-colors">
                            <ArrowLeft size={16} strokeWidth={2} />
                        </Link>
                        <div>
                            <h1 className="text-[18px] font-bold text-[#243044] leading-tight">Customers</h1>
                            <p className="text-xs text-[#243044]/60">Customer details and billing information</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <BillingPeriodPicker value={exportPeriod} onApply={setExportPeriod} />
                        <Select value={exportStatus} onValueChange={setExportStatus}>
                            <SelectTrigger className="h-[36px] w-[130px] bg-white border-[#E5E7EB] rounded-[8px] text-[13px]">
                                <SelectValue placeholder="All Records" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem value="All">All Records</SelectItem>
                                <SelectItem value="Paid">Paid</SelectItem>
                                <SelectItem value="Unpaid">Unpaid</SelectItem>
                            </SelectContent>
                        </Select>
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="h-[36px] px-4 bg-[#E50914] text-white text-[13px] font-bold rounded-[8px] hover:bg-[#C90C15] disabled:opacity-50 flex items-center gap-2"
                        >
                            {isExporting ? "Exporting..." : "Export Excel"}
                        </button>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="bg-white p-4 rounded-[8px] shadow-sm border border-[#DED8D3] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="size-16 rounded-full bg-[#E50914]/10 text-[#E50914] flex items-center justify-center text-xl font-bold shrink-0">
                            {displayInitials}
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-[#243044]">{customer.shopName}</h2>
                            {fullName && <p className="text-sm font-medium text-[#243044]/80">{fullName}</p>}
                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1.5 text-xs text-[#243044]/60">
                                    <Phone size={14} />
                                    {formatIndianMobile(customer.mobileNumber) || customer.mobileNumber}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-[#243044]/60">
                                    <MapPin size={14} />
                                    <span className="line-clamp-1">{customer.address || "N/A"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsEditOpen(true)} className="flex items-center gap-2 px-4 py-2 border border-[#DED8D3] rounded-[8px] text-sm font-bold text-[#243044] hover:bg-secondary/5 transition-colors bg-white">
                            <Pencil size={14} strokeWidth={2} />
                            Edit Customer
                        </button>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="size-[38px] rounded-[8px] flex items-center justify-center bg-white border border-[#DED8D3] text-[#243044] hover:bg-secondary/5 transition-colors outline-none cursor-pointer">
                                <EllipsisVertical size={16} strokeWidth={2} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-white border border-[#DED8D3] shadow-lg rounded-[8px]">
                                <DropdownMenuItem onClick={() => navigate(`/billing/create?customerId=${customer._id}`)} className="text-sm font-medium text-[#243044] hover:bg-secondary/5 cursor-pointer py-2 px-3 focus:bg-secondary/5">
                                    Create Bill
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                    if (window.confirm("Are you sure you want to delete/deactivate this customer?")) {
                                        deleteMutation.mutate();
                                    }
                                }} className="text-sm font-medium text-[#E50914] hover:bg-[#E50914]/5 cursor-pointer py-2 px-3 focus:bg-[#E50914]/5 focus:text-[#E50914]">
                                    Delete Customer
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-[8px] shadow-sm border border-[#DED8D3] flex items-center gap-4">
                        <div className="size-11 rounded-md bg-[#E50914]/10 text-[#E50914] flex items-center justify-center shrink-0">
                            <FileText size={22} strokeWidth={1.8} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#243044]/60 uppercase">Total Bills</p>
                            <h3 className="text-[18px] font-bold text-[#243044] mt-0.5">{isSummaryLoading ? "..." : summary.totalBills}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-[8px] shadow-sm border border-[#DED8D3] flex items-center gap-4">
                        <div className="size-11 rounded-md bg-[#08A64A]/10 text-[#08A64A] flex items-center justify-center shrink-0">
                            <CreditCard size={22} strokeWidth={1.8} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#243044]/60 uppercase">Paid Amount</p>
                            <h3 className="text-[18px] font-bold text-[#243044] mt-0.5">{isSummaryLoading ? "..." : `₹${safeNumber(summary.paidAmount).toFixed(2)}`}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-[8px] shadow-sm border border-[#DED8D3] flex items-center gap-4">
                        <div className="size-11 rounded-md bg-[#F59E0B]/10 text-[#D97706] flex items-center justify-center shrink-0">
                            <Clock size={22} strokeWidth={1.8} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#243044]/60 uppercase">Pending Amount</p>
                            <h3 className="text-[18px] font-bold text-[#243044] mt-0.5">{isSummaryLoading ? "..." : `₹${safeNumber(summary.pendingAmount).toFixed(2)}`}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-[8px] shadow-sm border border-[#DED8D3] flex items-center gap-4">
                        <div className="size-11 rounded-md bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                            <BarChart3 size={22} strokeWidth={1.8} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#243044]/60 uppercase">Total Billing</p>
                            <h3 className="text-[18px] font-bold text-[#243044] mt-0.5">{isSummaryLoading ? "..." : `₹${safeNumber(summary.totalBilling).toFixed(2)}`}</h3>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <h2 className="text-base font-bold text-[#243044]">Bill History</h2>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#243044]/40" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search bills..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(prev => ({ ...prev, pageIndex: 0 }));
                                    }}
                                    className="pl-9 pr-3 py-2 bg-white border border-[#DED8D3] rounded-[8px] text-sm outline-none focus:border-[#E50914] w-full sm:w-[220px]"
                                />
                            </div>
                            <Select
                                value={status || "All"}
                                onValueChange={(val) => {
                                    setStatus(val === "All" ? "" : val);
                                    setPage(prev => ({ ...prev, pageIndex: 0 }));
                                }}
                            >
                                <SelectTrigger className="h-[35px] w-[110px] min-w-[110px] bg-white border border-[#E5E7EB] rounded-[7px] text-[13px] font-medium text-[#0F172A] hover:border-[#CBD5E1] hover:bg-[#FAFAFA] focus:ring-[3px] focus:ring-[#E50914]/10 focus:border-[#E50914] data-[state=open]:border-[#E50914] data-[state=open]:ring-[3px] data-[state=open]:ring-[#E50914]/10 shadow-none px-2.5 gap-1.5 transition-colors [&>svg]:size-[14px] [&>svg]:transition-transform [&>svg]:duration-200 [&>svg]:data-[state=open]:rotate-180">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent className="bg-white rounded-[8px] border border-[#E5E7EB] shadow-[0px_4px_16px_rgba(0,0,0,0.08)] p-1 z-50 overflow-hidden w-[var(--radix-select-trigger-width)]">
                                    <SelectItem
                                        value="All"
                                        className={cn(
                                            "h-8 px-2 mb-0.5 last:mb-0 rounded-[5px] text-[13px] text-[#0F172A] cursor-pointer outline-none transition-colors",
                                            (status === "" || status === "All") ? "bg-[#FDE8EA] text-[#E50914] font-semibold hover:bg-[#FDE8EA] focus:bg-[#FDE8EA] focus:text-[#E50914]" : "hover:bg-[#FFF5F5] focus:bg-[#FFF5F5]"
                                        )}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <div className="size-1.5 rounded-full bg-[#94A3B8]" />
                                            All Status
                                        </div>
                                    </SelectItem>
                                    <SelectItem
                                        value="Paid"
                                        className={cn(
                                            "h-8 px-2 mb-0.5 last:mb-0 rounded-[5px] text-[13px] text-[#0F172A] cursor-pointer outline-none transition-colors",
                                            status === "Paid" ? "bg-[#FDE8EA] text-[#E50914] font-semibold hover:bg-[#FDE8EA] focus:bg-[#FDE8EA] focus:text-[#E50914]" : "hover:bg-[#FFF5F5] focus:bg-[#FFF5F5]"
                                        )}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <div className="size-1.5 rounded-full bg-[#00A651]" />
                                            Paid
                                        </div>
                                    </SelectItem>
                                    <SelectItem
                                        value="Partial"
                                        className={cn(
                                            "h-8 px-2 mb-0.5 last:mb-0 rounded-[5px] text-[13px] text-[#0F172A] cursor-pointer outline-none transition-colors",
                                            status === "Partial" ? "bg-[#FDE8EA] text-[#E50914] font-semibold hover:bg-[#FDE8EA] focus:bg-[#FDE8EA] focus:text-[#E50914]" : "hover:bg-[#FFF5F5] focus:bg-[#FFF5F5]"
                                        )}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <div className="size-1.5 rounded-full bg-[#FF9800]" />
                                            Partial
                                        </div>
                                    </SelectItem>
                                    <SelectItem
                                        value="Pending"
                                        className={cn(
                                            "h-8 px-2 rounded-[5px] text-[13px] text-[#0F172A] cursor-pointer outline-none transition-colors",
                                            status === "Pending" ? "bg-[#FDE8EA] text-[#E50914] font-semibold hover:bg-[#FDE8EA] focus:bg-[#FDE8EA] focus:text-[#E50914]" : "hover:bg-[#FFF5F5] focus:bg-[#FFF5F5]"
                                        )}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <div className="size-1.5 rounded-full bg-[#E50914]" />
                                            Pending
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>


                    <div className="bg-white rounded-[8px] border border-[#DED8D3] shadow-sm overflow-hidden">
                        {/* Bulk Action Bar */}
                        {table.getSelectedRowModel().rows.length > 0 && (
                            <div className="flex items-center justify-between p-3 border-b border-[#DED8D3] bg-secondary/5">
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="font-bold text-secondary">
                                        {table.getSelectedRowModel().rows.length} invoices selected
                                    </div>
                                    <div className="font-semibold text-secondary/70">
                                        Selected Pending: <span className="font-bold text-[#E50914]">₹{
                                            (Math.round(table.getSelectedRowModel().rows.reduce((acc, row) => acc + (safeNumber(row.original.pendingAmount) * 100), 0)) / 100).toFixed(2)
                                        }</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => table.resetRowSelection()}
                                        className="text-xs font-bold text-secondary hover:text-secondary/80 bg-white border border-[#DED8D3] px-3 py-1.5 rounded transition-colors"
                                    >
                                        Clear
                                    </button>
                                    <button
                                        onClick={() => setIsBulkPaymentOpen(true)}
                                        className="text-xs font-bold text-white bg-[#E50914] hover:bg-[#C90C15] px-4 py-1.5 rounded shadow-sm transition-colors"
                                    >
                                        Collect Payment
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    {table.getHeaderGroups().map(hg => (
                                        <TableRow key={hg.id} className="bg-[#F5F1EE] hover:bg-[#F5F1EE]">
                                            {hg.headers.map(header => (
                                                <TableHead key={header.id} className="py-2.5 px-4 text-xs font-bold text-secondary uppercase">
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {isBillsFetching ? (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                                Loading invoices...
                                            </TableCell>
                                        </TableRow>
                                    ) : table.getRowModel().rows.length > 0 ? (
                                        table.getRowModel().rows.map(row => (
                                            <TableRow key={row.id}>
                                                {row.getVisibleCells().map(cell => (
                                                    <TableCell key={cell.id} className="py-3 px-4 text-sm text-[#243044]">
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="h-24 text-center text-secondary">
                                                No invoices found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {billsTotal > 0 && (
                            <div className="flex items-center justify-between p-4 border-t border-[#DED8D3]">
                                <div className="text-xs font-medium text-[#243044]/60">
                                    Showing {(page.pageIndex * page.pageSize) + 1} to {Math.min((page.pageIndex + 1) * page.pageSize, billsTotal)} of {billsTotal} invoices
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                        className="px-2 py-1 rounded border border-[#DED8D3] text-secondary disabled:opacity-50"
                                    >
                                        {"<"}
                                    </button>
                                    <span className="text-xs font-bold mx-2">
                                        Page {page.pageIndex + 1} of {table.getPageCount()}
                                    </span>
                                    <button
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                        className="px-2 py-1 rounded border border-[#DED8D3] text-secondary disabled:opacity-50"
                                    >
                                        {">"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isEditOpen && (
                <AddCustomerDialog
                    open={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    refetchCustomer={() => {
                        queryClient.invalidateQueries(["customer", id]);
                        queryClient.invalidateQueries(["customerSummary", id]);
                    }}
                    initialData={customer}
                />
            )}


            {isBulkPaymentOpen && (
                <BulkPaymentDialog
                    open={isBulkPaymentOpen}
                    onClose={(success) => {
                        setIsBulkPaymentOpen(false);

                        if (success) {
                            // Clear both desktop and mobile selection
                            setRowSelection({});
                            setSelectedBillIds([]);
                        }
                    }}
                    selectedInvoices={
                        table.getSelectedRowModel().rows.length > 0
                            ? table.getSelectedRowModel().rows.map(
                                (row) => row.original
                            )
                            : mobileSelectedInvoices
                    }
                    customerId={id}
                    customerName={customer.shopName}
                    totalSelectedPending={
                        table.getSelectedRowModel().rows.length > 0
                            ? Math.round(
                                table
                                    .getSelectedRowModel()
                                    .rows.reduce(
                                        (acc, row) =>
                                            acc +
                                            safeNumber(
                                                row.original.pendingAmount
                                            ) *
                                            100,
                                        0
                                    )
                            ) / 100
                            : mobileSelectedPending
                    }
                />
            )}

            {paymentInvoice && (
                <RecordPaymentDialog
                    open={!!paymentInvoice}
                    onClose={() => setPaymentInvoice(null)}
                    invoice={paymentInvoice}
                />
            )}
        </>
    );
}
