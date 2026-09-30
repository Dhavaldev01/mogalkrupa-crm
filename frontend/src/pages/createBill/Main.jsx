import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import customerService from "@/services/customerService";
import rateService from "@/services/rateService";
import invoiceService from "@/services/invoiceService";
import settingsService from "@/services/settingsService";
import AddCustomerDialog from "@/components/common/AddCustomerDialog";
import { toast } from "sonner";
import { safeNumber, cn, formatCurrency } from "@/lib/utils";
import { FilePlus2, UserPlus, Plus, Trash2, RotateCcw, Save, ChevronDown, Check, Loader2, ArrowLeft, EllipsisVertical, FileText } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CreateBill() {
    const navigate = useNavigate();
    const [addCustomerDialog, setAddCustomerDialog] = useState(false);

    // Form State
    const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
    const [customerId, setCustomerId] = useState("");
    const [openCustomer, setOpenCustomer] = useState(false);
    const [openMobileCustomer, setOpenMobileCustomer] = useState(false);
    const [items, setItems] = useState([{ jarkan: "", site: "" }]);
    const [invoiceDiscount, setInvoiceDiscount] = useState("");
    const [notes, setNotes] = useState("");

    // Fetch Customers
    const { data: customersRes, refetch: refetchCustomers } = useQuery({
        queryKey: ["customers", { page: 1, limit: 1000 }],
        queryFn: () => customerService.getCustomers({ page: 1, limit: 1000 })
    });
    const customers = customersRes?.data?.data || [];

    const validCustomers = useMemo(() => {
        return customers.filter(c =>
            c && c._id && c._id !== "0" && c.firstName !== "0" && c.shopName !== "0" &&
            (c.shopName || c.firstName || c.mobileNumber)
        );
    }, [customers]);

    const selectedCustomer = useMemo(() => {
        return validCustomers.find(c => c._id === customerId);
    }, [validCustomers, customerId]);

    // Fetch Rates
    const { data: ratesRes } = useQuery({
        queryKey: ["rates"],
        queryFn: () => rateService.getRates()
    });
    const ratesList = ratesRes?.data?.data || [];
    const activeRatesList = ratesList.filter(r => r.isActive !== false);

    // Fetch Settings for Default Notes
    const { data: settingsRes } = useQuery({
        queryKey: ["settings"],
        queryFn: () => settingsService.getSettings()
    });

    useEffect(() => {
        if (settingsRes?.data?.data?.defaultNotes && !notes) {
            setNotes(settingsRes.data.data.defaultNotes);
        }
    }, [settingsRes]);

    // Calculations
    const calculatedItems = useMemo(() => {
        return items.map((item) => {
            const jarkan = parseFloat(item.jarkan) || 0;
            const site = parseFloat(item.site) || 0;

            const rateObj = activeRatesList.find(r => Number(r.site) === site);
            const rate = rateObj ? Number(rateObj.rate) : 0;

            const dotAmount = jarkan * rate;
            const siteAmount = site;
            const total = dotAmount + siteAmount;

            return {
                ...item,
                rate,
                dotAmount,
                siteAmount,
                total
            };
        });
    }, [items, ratesList, activeRatesList]);

    const totals = useMemo(() => {
        let dotTotal = 0;
        let siteTotal = 0;
        let validRows = 0;
        calculatedItems.forEach(item => {
            if (item.jarkan && item.site) {
                dotTotal += item.dotAmount;
                siteTotal += item.siteAmount;
                validRows++;
            }
        });
        const discountVal = Number(invoiceDiscount) || 0;
        return {
            dotTotal,
            siteTotal,
            grossTotal: dotTotal + siteTotal,
            invoiceDiscount: discountVal,
            grandTotal: (dotTotal + siteTotal) - discountVal,
            validRows
        };
    }, [calculatedItems, invoiceDiscount]);

    // Handlers
    const handleAddRow = () => setItems([...items, { jarkan: "", site: "" }]);
    const handleRemoveRow = (index) => {
        if (items.length === 1) return;
        setItems(items.filter((_, i) => i !== index));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleKeyDown = (e, index, field) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (field === "jarkan") {
                const siteTrigger = document.querySelector(`[data-site-idx="${index}"]`);
                if (siteTrigger) siteTrigger.focus();
            } else if (field === "site") {
                if (index === items.length - 1 && items[index].jarkan && items[index].site) {
                    handleAddRow();
                    setTimeout(() => {
                        const nextInput = document.getElementById(`jarkan-input-${index + 1}`);
                        if (nextInput) nextInput.focus();
                    }, 0);
                } else if (index < items.length - 1) {
                    const nextInput = document.getElementById(`jarkan-input-${index + 1}`);
                    if (nextInput) nextInput.focus();
                }
            }
        }
    };

    const handleReset = () => {
        setCustomerId("");
        setDate(new Date().toISOString().split("T")[0]);
        setItems([{ jarkan: "", site: "" }]);
        setInvoiceDiscount("");
        setNotes(settingsRes?.data?.data?.defaultNotes || "");
    };

    const mutation = useMutation({
        mutationFn: invoiceService.createInvoice,
        onSuccess: () => {
            toast.success("Billing saved successfully");
            navigate("/invoices");
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Failed to save billing");
        }
    });

    const handleSave = () => {
        if (!customerId) return toast.error("Please select a customer");
        if (!date) return toast.error("Please select a date");

        const validItems = items.filter(i => parseFloat(i.jarkan) > 0 && i.site !== "");
        if (validItems.length === 0) return toast.error("Please add at least one valid item");

        mutation.mutate({
            date,
            customerId,
            items: validItems.map(i => ({ jarkan: Number(i.jarkan), site: Number(i.site) })),
            invoiceDiscount: Number(invoiceDiscount) || 0,
            notes
        });
    };

    return (
        <>
            {/* MOBILE VIEW */}
            <div className="md:hidden flex flex-col min-h-screen bg-[#FAFAF9] pb-[130px]">
                {/* Header */}
                <div className="bg-white w-full border-b border-[#E5E7EB] px-3 flex items-center justify-between sticky top-0 z-40 shadow-sm h-[56px]">
                    <button onClick={() => navigate(-1)} className="w-[36px] h-[36px] flex items-center justify-center rounded-full bg-[#F8FAFC] text-[#0F172A] border border-[#E5E7EB] outline-none">
                        <ArrowLeft size={18} strokeWidth={2.5} />
                    </button>
                    <h1 className="text-[16px] font-bold text-[#0F172A]">Create New Billing</h1>
                    <button className="w-[36px] h-[36px] flex items-center justify-center rounded-full text-[#64748B] outline-none">
                        <EllipsisVertical size={20} />
                    </button>
                </div>

                <div className="px-3 py-4 space-y-4">
                    {/* Basic Details */}
                    <div className="bg-white rounded-[12px] p-3 shadow-sm border border-[#E4E7EC]">
                        <div className="flex items-center gap-2 mb-3">
                            <FileText size={16} className="text-[#E50914]" strokeWidth={2.5} />
                            <h2 className="text-[13px] font-bold text-[#0F172A]">Basic Details</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="flex flex-col">
                                <label className="text-[10px] font-semibold text-[#64748B] mb-1">Invoice No.</label>
                                <input disabled value="Auto Generated" className="h-[36px] px-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[8px] text-[12px] font-medium text-[#64748B] outline-none" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] font-semibold text-[#64748B] mb-1">Date</label>
                                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-[36px] px-2.5 bg-white border border-[#E5E7EB] rounded-[8px] text-[12px] font-medium text-[#0F172A] outline-none" />
                            </div>
                        </div>

                        <div className="flex flex-col mb-3">
                            <label className="text-[10px] font-semibold text-[#64748B] mb-1">Customer *</label>
                            <Popover open={openMobileCustomer} onOpenChange={setOpenMobileCustomer}>
                                <PopoverTrigger asChild>
                                    <button type="button" className="flex items-center justify-between w-full h-[38px] px-2.5 bg-white border border-[#E5E7EB] rounded-[8px] text-[12px] text-left outline-none">
                                        <span className="truncate pr-2 font-medium">
                                            {selectedCustomer ? (
                                                <span className="text-[#0F172A]">
                                                    {selectedCustomer.shopName ? `${selectedCustomer.shopName} - ` : ""}
                                                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                                                </span>
                                            ) : "Select customer..."}
                                        </span>
                                        <ChevronDown size={14} className="text-[#64748B] shrink-0" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-1 bg-white rounded-[8px] border border-[#E5E7EB] shadow-[0px_8px_24px_rgba(0,0,0,0.08)] z-[100]" sideOffset={4} align="start" preventScroll={true}>
                                    <Command>
                                        <CommandInput placeholder="Search customer..." className="h-9 text-[12px] border-none" />
                                        <CommandList className="max-h-[220px] overflow-y-auto mt-1">
                                            <CommandEmpty className="py-4 text-center text-[12px] text-[#64748B]">No customer found.</CommandEmpty>
                                            <CommandGroup>
                                                {validCustomers.map(c => (
                                                    <CommandItem
                                                        key={c._id}
                                                        value={`${c.shopName || ''} ${c.firstName || ''} ${c.lastName || ''} ${c.mobileNumber || ''}`.trim()}
                                                        onSelect={() => { setCustomerId(c._id); setOpenMobileCustomer(false); }}
                                                        className="flex flex-col items-start px-2 py-1.5 rounded-[6px]"
                                                    >
                                                        <span className="text-[13px] font-semibold">{c.shopName || `${c.firstName} ${c.lastName}`}</span>
                                                        <span className="text-[11px] text-[#64748B]">{c.mobileNumber}</span>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <button
                            type="button"
                            onClick={() => setAddCustomerDialog(true)}
                            className="w-full h-[38px] bg-white text-[#E50914] border border-[#E50914] rounded-[8px] text-[13px] font-semibold flex items-center justify-center gap-2 outline-none"
                        >
                            + New Customer
                        </button>
                    </div>

                    {/* Items Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-[3px] h-[14px] bg-[#E50914] rounded-full"></div>
                            <h2 className="text-[14px] font-bold text-[#0F172A]">Items</h2>
                        </div>
                        <button
                            onClick={handleAddRow}
                            className="h-[30px] px-3 bg-[#FDE8EA] text-[#E50914] rounded-full text-[11px] font-bold flex items-center gap-1"
                        >
                            + Add Item
                        </button>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2">
                        {calculatedItems.map((item, idx) => (
                            <div key={idx} className="bg-white rounded-[12px] p-3 shadow-sm border border-[#E4E7EC]">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-bold text-[#0F172A]">Item {idx + 1}</span>
                                    <button
                                        onClick={() => handleRemoveRow(idx)}
                                        disabled={items.length === 1}
                                        className="w-[28px] h-[28px] flex items-center justify-center text-[#64748B] hover:text-[#E50914] hover:bg-[#FDE8EA] rounded-full disabled:opacity-30"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                <div className="mb-2">
                                    <label className="text-[10px] font-semibold text-[#64748B] mb-1 block">Jarkan No.</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={item.jarkan}
                                        onChange={(e) => handleItemChange(idx, "jarkan", e.target.value)}
                                        className="h-[36px] w-full px-2.5 bg-white border border-[#E5E7EB] rounded-[8px] text-[12px] text-[#0F172A] outline-none"
                                        placeholder="0"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="text-[10px] font-semibold text-[#64748B] mb-1 block">Site</label>
                                        <Select value={item.site} onValueChange={(val) => handleItemChange(idx, "site", val)}>
                                            <SelectTrigger className="h-[36px] w-full bg-white border-[#E5E7EB] rounded-[8px] text-[12px] font-medium text-[#0F172A]">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white z-50">
                                                {activeRatesList.map(r => (
                                                    <SelectItem key={r._id} value={r.site} className="text-[12px]">{r.site}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-semibold text-[#64748B] mb-1 block">Rate (₹)</label>
                                        <div className="h-[36px] w-full px-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[8px] text-[12px] font-medium text-[#64748B] flex items-center">
                                            {item.site ? safeNumber(item.rate).toFixed(2) : "-"}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5 border-t border-[#E5E7EB] pt-2">
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-[#64748B] font-medium">Dot Amount</span>
                                        <span className="text-[#0F172A] font-semibold">₹{item.jarkan && item.site ? safeNumber(item.dotAmount).toFixed(2) : "0.00"}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-[#64748B] font-medium">Site Amount</span>
                                        <span className="text-[#0F172A] font-semibold">₹{item.site ? safeNumber(item.siteAmount).toFixed(2) : "0.00"}</span>
                                    </div>
                                    <div className="w-full h-[1px] bg-dashed bg-[#E5E7EB] my-1"></div>
                                    <div className="flex justify-between items-center text-[12px]">
                                        <span className="text-[#0F172A] font-bold">Total</span>
                                        <span className="text-[#E50914] font-bold">₹{item.jarkan && item.site ? safeNumber(item.total).toFixed(2) : "0.00"}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Totals & Discount */}
                    <div className="bg-white rounded-[12px] p-3 shadow-sm border border-[#E4E7EC] mt-1 mb-20">
                        <div className="flex justify-between items-center text-[12px] mb-2">
                            <span className="text-[#64748B] font-semibold">Subtotal</span>
                            <span className="text-[#0F172A] font-bold">₹{safeNumber(totals.grossTotal).toFixed(2)}</span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-y border-dashed border-[#E5E7EB] my-2">
                            <label className="text-[12px] font-bold text-[#0F172A]">Discount (₹)</label>
                            <div className="relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#E50914] text-[12px] font-bold select-none pointer-events-none">−</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={invoiceDiscount}
                                    onChange={(e) => setInvoiceDiscount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-[100px] h-[32px] pl-6 pr-2 bg-white border border-[#E5E7EB] rounded-[6px] text-[13px] text-right text-[#0F172A] focus:border-[#E50914] outline-none font-semibold"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-[14px] mt-2">
                            <span className="text-[#0F172A] font-bold">Grand Total</span>
                            <span className="text-[#E50914] font-bold">₹{safeNumber(totals.grandTotal).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Sticky Action Bar */}
                <div className="fixed bottom-[64px] left-0 right-0 bg-white border-t border-[#E5E7EB] px-3 py-3 z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-[#64748B]">Grand Total</span>
                        <span className="text-[18px] font-bold text-[#E50914]">₹{safeNumber(totals.grandTotal).toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={mutation.isPending}
                        className="h-[42px] px-6 bg-[#E50914] hover:bg-[#C90C15] text-white rounded-[10px] text-[14px] font-bold flex items-center gap-2 outline-none disabled:opacity-70"
                    >
                        {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : null}
                        Create Invoice
                    </button>
                </div>
            </div>

            {/* DESKTOP VIEW */}
            <div className="hidden md:flex bg-[#FAFAF9] p-4 md:p-5 flex-1 flex-col min-h-[calc(100vh-60px)]">
                <div className="space-y-4">
                    {/* <div className="flex items-center gap-2 mb-2">
                        <FilePlus2 size={24} className="text-[#E50914]" strokeWidth={2} />
                        <h1 className="text-[20px] font-bold text-[#0F172A]">Create New Billing</h1>
                    </div> */}

                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-[180px_180px_1fr_140px] gap-4">
                            <div className="flex flex-col">
                                <label className="text-[13px] font-semibold text-[#334155] mb-1.5">Invoice No.</label>
                                <input
                                    disabled
                                    value="Auto Generated"
                                    className="h-[40px] px-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[8px] text-[14px] text-[#64748B] outline-none"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[13px] font-semibold text-[#334155] mb-1.5">Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="h-[40px] px-3 bg-white border border-[#E5E7EB] rounded-[8px] text-[14px] text-[#0F172A] focus:border-[#E50914] focus:ring-[3px] focus:ring-[#E50914]/10 outline-none transition-colors"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[13px] font-semibold text-[#334155] mb-1.5">Customer</label>
                                <Popover open={openCustomer} onOpenChange={setOpenCustomer}>
                                    <PopoverTrigger asChild>
                                        <button
                                            type="button"
                                            className={cn(
                                                "flex items-center justify-between w-[350px] h-[40px] px-3 bg-white border border-[#E5E7EB] rounded-[8px] text-[14px] text-left outline-none transition-colors",
                                                openCustomer ? "border-[#E50914] ring-[3px] ring-[#E50914]/10" : "hover:border-[#CBD5E1]",
                                                !customerId && "text-[#64748B]"
                                            )}
                                        >
                                            <span className="truncate pr-2 font-medium">
                                                {selectedCustomer ? (
                                                    <span className="text-[#0F172A]">
                                                        {selectedCustomer.shopName ? `${selectedCustomer.shopName} - ` : ""}
                                                        {selectedCustomer.firstName} {selectedCustomer.lastName}
                                                        {selectedCustomer.mobileNumber ? ` (${selectedCustomer.mobileNumber})` : ""}
                                                    </span>
                                                ) : (
                                                    "Select Customer..."
                                                )}
                                            </span>
                                            <ChevronDown size={16} className="text-[#64748B] shrink-0" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-[var(--radix-popover-trigger-width)] p-1.5 bg-white rounded-[8px] border border-[#E5E7EB] shadow-[0px_8px_24px_rgba(0,0,0,0.08)] z-50"
                                    >
                                        <Command>
                                            <CommandInput placeholder="Search customer..." className="h-10 text-[14px] border-none focus:ring-0" />
                                            <CommandList className="max-h-[260px] overflow-y-auto mt-1">
                                                <CommandEmpty className="py-5 text-center text-[13px] text-[#64748B]">No customer found.</CommandEmpty>
                                                <CommandGroup>
                                                    {validCustomers.map(c => {
                                                        const isSelected = customerId === c._id;
                                                        return (
                                                            <CommandItem
                                                                key={c._id}
                                                                value={`${c.shopName || ''} ${c.firstName || ''} ${c.lastName || ''} ${c.mobileNumber || ''}`.trim()}
                                                                onSelect={() => { setCustomerId(c._id); setOpenCustomer(false); }}
                                                                className={cn(
                                                                    "flex flex-col items-start px-2.5 py-2 mb-1 last:mb-0 rounded-[6px] cursor-pointer transition-colors relative",
                                                                    isSelected ? "bg-[#FDE8EA] data-[selected]:bg-[#FDE8EA]" : "hover:bg-[#FFF5F5] data-[selected]:bg-[#FFF5F5]"
                                                                )}
                                                            >
                                                                <div className="flex w-full items-center justify-between">
                                                                    <span className={cn("text-[14px] font-semibold", isSelected ? "text-[#E50914]" : "text-[#0F172A]")}>
                                                                        {c.shopName || `${c.firstName} ${c.lastName}`}
                                                                    </span>
                                                                    {isSelected && <Check size={16} className="text-[#E50914] shrink-0" />}
                                                                </div>
                                                                <span className={cn("text-[13px] mt-0.5", isSelected ? "text-[#E50914]/80" : "text-[#64748B]")}>
                                                                    {c.shopName ? `${c.firstName} ${c.lastName} • ` : ""}{c.mobileNumber}
                                                                </span>
                                                            </CommandItem>
                                                        );
                                                    })}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex flex-col justify-end">
                                <button
                                    onClick={() => setAddCustomerDialog(true)}
                                    className="h-[40px] bg-[#E50914] hover:bg-[#C90C15] text-white rounded-[8px] text-[14px] font-semibold flex items-center justify-center gap-2 transition-colors outline-none focus:ring-[3px] focus:ring-[#E50914]/20"
                                >
                                    <UserPlus size={18} strokeWidth={2} /> New Customer
                                </button>
                            </div>
                        </div>
                        {selectedCustomer && (
                            <div className="mt-2 bg-white border border-[#E5E7EB] rounded-[8px] py-3 px-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px]">
                                <span className="font-semibold text-[#E50914]">{selectedCustomer.shopName || `${selectedCustomer.firstName} ${selectedCustomer.lastName}`}</span>

                                {selectedCustomer.shopName && (
                                    <>
                                        <span className="text-[#CBD5E1] hidden sm:block">|</span>
                                        <span className="text-[#475569]">{selectedCustomer.firstName} {selectedCustomer.lastName}</span>
                                    </>
                                )}

                                <span className="text-[#CBD5E1] hidden sm:block">|</span>
                                <span className="text-[#475569]">+91 {selectedCustomer.mobileNumber}</span>

                                {selectedCustomer.address && (
                                    <>
                                        <span className="text-[#CBD5E1] hidden sm:block">|</span>
                                        <span className="text-[#475569] truncate">{selectedCustomer.address}</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-[8px] shadow-sm border border-[#E5E7EB] flex flex-col overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead className="bg-[#E50914] text-white">
                                    <tr>
                                        <th className="h-[40px] px-4 text-[13px] font-semibold w-12 text-center">#</th>
                                        <th className="h-[40px] px-4 text-[13px] font-semibold w-[200px]">Jarkan *</th>
                                        <th className="h-[40px] px-4 text-[13px] font-semibold w-[200px]">Site *</th>
                                        <th className="h-[40px] px-4 text-[13px] font-semibold text-right">Rate</th>
                                        <th className="h-[40px] px-4 text-[13px] font-semibold text-right">Dot Amount (₹)</th>
                                        <th className="h-[40px] px-4 text-[13px] font-semibold text-right">Site Amount (₹)</th>
                                        <th className="h-[40px] px-4 text-[13px] font-semibold text-right">Total (₹)</th>
                                        <th className="h-[40px] px-4 text-[13px] font-semibold text-center w-16">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {calculatedItems.map((item, idx) => (
                                        <tr key={idx} className="border-b border-[#E5E7EB] hover:bg-[#FAFAFA] transition-colors">
                                            <td className="py-2.5 px-4 text-center text-[#64748B] font-medium text-[14px]">{idx + 1}</td>
                                            <td className="py-2.5 px-4">
                                                <input
                                                    id={`jarkan-input-${idx}`}
                                                    type="number"
                                                    min="0"
                                                    value={item.jarkan}
                                                    onChange={(e) => handleItemChange(idx, "jarkan", e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(e, idx, "jarkan")}
                                                    className="h-[40px] w-full px-3 bg-white border border-[#E5E7EB] rounded-[8px] text-[14px] text-[#0F172A] focus:border-[#E50914] focus:ring-[3px] focus:ring-[#E50914]/10 outline-none transition-colors"
                                                    placeholder="0"
                                                />
                                            </td>
                                            <td className="py-2.5 px-4">
                                                <Select
                                                    value={item.site}
                                                    onValueChange={(val) => handleItemChange(idx, "site", val)}
                                                >
                                                    <SelectTrigger
                                                        id={`site-select-${idx}`}
                                                        data-site-idx={idx}
                                                        className="h-[40px] w-full bg-white border-[#E5E7EB] rounded-[8px] text-[14px] font-medium text-[#0F172A] focus:ring-[3px] focus:ring-[#E50914]/10 focus:border-[#E50914] shadow-none outline-none"
                                                    >
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white rounded-[8px] border-[#E5E7EB] shadow-[0px_8px_24px_rgba(0,0,0,0.08)] z-50">
                                                        {activeRatesList.length > 0 ? (
                                                            activeRatesList.map(r => (
                                                                <SelectItem
                                                                    key={r._id}
                                                                    value={r.site}
                                                                    className="text-[13px] font-medium cursor-pointer transition-colors focus:bg-[#FDE8EA] focus:text-[#E50914]"
                                                                >
                                                                    {r.site}
                                                                </SelectItem>
                                                            ))
                                                        ) : (
                                                            <SelectItem value="" disabled className="text-[13px] text-[#64748B]">
                                                                No active rates
                                                            </SelectItem>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </td>
                                            <td className="py-2.5 px-4 text-right font-medium text-[#475569] text-[14px]">
                                                {item.site ? safeNumber(item.rate).toFixed(2) : "-"}
                                            </td>
                                            <td className="py-2.5 px-4 text-right font-medium text-[#475569] text-[14px]">
                                                {item.jarkan && item.site ? safeNumber(item.dotAmount).toFixed(2) : "-"}
                                            </td>
                                            <td className="py-2.5 px-4 text-right font-medium text-[#475569] text-[14px]">
                                                {item.site ? safeNumber(item.siteAmount).toFixed(2) : "-"}
                                            </td>
                                            <td className="py-2.5 px-4 text-right font-bold text-[#0F172A] text-[14px]">
                                                {item.jarkan && item.site ? safeNumber(item.total).toFixed(2) : "-"}
                                            </td>
                                            <td className="py-2.5 px-4 text-center">
                                                <button
                                                    onClick={() => handleRemoveRow(idx)}
                                                    disabled={items.length === 1}
                                                    className="size-8 flex items-center justify-center text-[#E50914] hover:bg-[#FDE8EA] rounded-[6px] disabled:opacity-30 mx-auto transition-colors outline-none focus:ring-2 focus:ring-[#E50914]/20"
                                                    title="Remove Row"
                                                >
                                                    <Trash2 size={16} strokeWidth={2} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 border-b border-[#E5E7EB] bg-white">
                            <button
                                onClick={handleAddRow}
                                className="h-[40px] px-[16px] bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#10B981] border border-[#A7F3D0] rounded-[8px] text-[14px] font-medium flex items-center gap-2 transition-colors outline-none focus:ring-2 focus:ring-[#10B981]/20"
                            >
                                <Plus size={16} strokeWidth={2.5} /> Add Row
                            </button>
                        </div>

                        <div className="flex flex-col lg:flex-row p-4 gap-4 bg-white">
                            <div className="w-full lg:w-[73%] flex flex-col">
                                <label className="text-[13px] font-semibold text-[#334155] mb-2">Notes</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full min-h-[100px] p-3 bg-white border border-[#E5E7EB] rounded-[8px] text-[14px] text-[#0F172A] focus:border-[#E50914] focus:ring-[3px] focus:ring-[#E50914]/10 outline-none resize-y transition-colors leading-relaxed"
                                    placeholder="Enter any notes..."
                                />
                            </div>

                            <div className="w-full lg:w-[27%] bg-white rounded-[8px] border border-[#E5E7EB] p-4">
                                <div className="space-y-3.5 mb-4">
                                    <div className="flex justify-between items-center text-[14px]">
                                        <span className="text-[#64748B] font-medium">Dot Total (₹)</span>
                                        <span className="text-[#0F172A] font-semibold">₹{safeNumber(totals.dotTotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[14px]">
                                        <span className="text-[#64748B] font-medium">Site Total (₹)</span>
                                        <span className="text-[#0F172A] font-semibold">₹{safeNumber(totals.siteTotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[14px]">
                                        <span className="text-[#64748B] font-medium">Items</span>
                                        <span className="text-[#0F172A] font-semibold">{totals.validRows}</span>
                                    </div>
                                    <div className="pt-2 flex justify-between items-center">
                                        <label className="text-[13px] font-semibold text-[#334155]">Discount (₹)</label>
                                        <div className="relative">
                                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#E50914] text-[13px] font-bold select-none pointer-events-none">− ₹</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={invoiceDiscount}
                                                onChange={(e) => setInvoiceDiscount(e.target.value)}
                                                placeholder="0.00"
                                                className="w-[120px] h-[36px] pl-8 pr-2 bg-white border border-[#E5E7EB] rounded-[8px] text-[14px] text-right text-[#0F172A] focus:border-[#E50914] focus:ring-[3px] focus:ring-[#E50914]/10 outline-none transition-colors font-semibold"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="h-[1px] bg-[#E5E7EB] w-full my-4"></div>

                                <div className="h-[52px] bg-[#E50914] rounded-[8px] px-[14px] flex justify-between items-center shadow-[0_2px_8px_rgba(229,9,20,0.15)] mb-4">
                                    <span className="text-white text-[16px] font-bold">Grand Total (₹)</span>
                                    <span className="text-white text-[18px] font-bold">₹{safeNumber(totals.grandTotal).toFixed(2)}</span>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleReset}
                                        disabled={mutation.isPending}
                                        className="flex-1 h-[40px] bg-white border border-[#E5E7EB] rounded-[8px] text-[#334155] text-[14px] font-medium hover:bg-[#F8FAFC] transition-colors flex items-center justify-center gap-2 outline-none focus:ring-2 focus:ring-[#E5E7EB] disabled:opacity-50"
                                    >
                                        <RotateCcw size={16} strokeWidth={2} /> Reset
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={mutation.isPending}
                                        className="flex-1 h-[40px] bg-[#E50914] hover:bg-[#C90C15] text-white rounded-[8px] text-[14px] font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed outline-none focus:ring-[3px] focus:ring-[#E50914]/20 whitespace-nowrap"
                                    >
                                        {mutation.isPending ? <Loader2 size={16} strokeWidth={2} className="animate-spin" /> : <Save size={16} strokeWidth={2} />}
                                        {mutation.isPending ? "Saving..." : "Save Billing"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AddCustomerDialog
                open={addCustomerDialog}
                onClose={() => setAddCustomerDialog(false)}
                refetchCustomer={(newCustomer) => {
                    refetchCustomers();
                    if (newCustomer && newCustomer._id) {
                        setCustomerId(newCustomer._id);
                    }
                }}
            />
        </>
    );
}