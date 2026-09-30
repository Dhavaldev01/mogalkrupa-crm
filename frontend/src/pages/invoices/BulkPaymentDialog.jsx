import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Button from "@/components/common/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/services";
import { toast } from "sonner";
import { safeNumber } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

export default function BulkPaymentDialog({ open, onClose, selectedInvoices, customerId, customerName, totalSelectedPending }) {
    const queryClient = useQueryClient();
    const [amount, setAmount] = useState("");
    const [discountAmount, setDiscountAmount] = useState("");
    const [method, setMethod] = useState("Cash");
    const [reference, setReference] = useState("");
    const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [notes, setNotes] = useState("");

    // Reset fields when modal opens
    useEffect(() => {
        if (open) {
            setAmount(totalSelectedPending.toFixed(2));
            setDiscountAmount("");
            setMethod("Cash");
            setReference("");
            setDate(format(new Date(), "yyyy-MM-dd"));
            setNotes("");
        }
    }, [open, totalSelectedPending]);

    const handleDiscountChange = (e) => {
        const val = e.target.value;
        setDiscountAmount(val);
        const discountPaise = Math.round(safeNumber(val) * 100);
        const pendingPaise = Math.round(totalSelectedPending * 100);
        if (discountPaise >= 0 && discountPaise <= pendingPaise) {
            setAmount(((pendingPaise - discountPaise) / 100).toFixed(2));
        }
    };

    const numAmount = safeNumber(amount);
    const numDiscount = safeNumber(discountAmount);
    
    // Paise precision for logic
    const pendingPaise = Math.round(totalSelectedPending * 100);
    const paymentPaise = Math.round(numAmount * 100);
    const explicitDiscountPaise = Math.round(numDiscount * 100);
    const remainingPaise = pendingPaise - paymentPaise - explicitDiscountPaise;
    const isOverpaid = (paymentPaise + explicitDiscountPaise) > pendingPaise;

    const mutation = useMutation({
        mutationFn: (data) => paymentService.createBulk(data),
        onSuccess: (res) => {
            toast.success(`Payment of ₹${numAmount.toFixed(2)} collected successfully.`);
            queryClient.invalidateQueries(["customerInvoices"]);
            queryClient.invalidateQueries(["customerSummary"]);
            queryClient.invalidateQueries(["customer"]);
            onClose(true);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Failed to collect payment");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (paymentPaise < 0 || explicitDiscountPaise < 0) {
            toast.error("Values cannot be negative");
            return;
        }
        if (paymentPaise === 0 && explicitDiscountPaise === 0) {
            toast.error("Please enter an amount");
            return;
        }
        if (isOverpaid) {
            toast.error(`Total cannot exceed ₹${totalSelectedPending.toFixed(2)}`);
            return;
        }

        mutation.mutate({
            customerId,
            invoiceIds: selectedInvoices.map(inv => inv._id),
            amount: numAmount,
            discountAmount: explicitDiscountPaise > 0 ? explicitDiscountPaise / 100 : 0,
            method,
            date,
            reference,
            notes
        });
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose(false)}>
            <DialogContent className="w-[calc(100vw-24px)] md:max-w-[460px] max-h-[88vh] flex flex-col p-0 bg-white rounded-[12px] shadow-lg gap-0">
                <DialogHeader className="py-4 px-[18px] border-b border-[#E4E7EC] shrink-0">
                    <DialogTitle className="text-[18px] font-bold text-[#0F1B35]">Collect Payment</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden min-h-0">
                    <div className="flex-1 overflow-y-auto px-[18px] py-4 space-y-3">
                        <div className="bg-[#F8FAFC] rounded-[8px] p-3 flex flex-col gap-1.5">
                            <div className="flex justify-between text-[13px]">
                                <span className="text-secondary/70 font-medium">Customer:</span>
                                <span className="font-bold text-secondary">{customerName}</span>
                            </div>
                            <div className="flex justify-between text-[13px]">
                                <span className="text-secondary/70 font-medium">Selected Invoices:</span>
                                <span className="font-bold text-secondary">{selectedInvoices.length}</span>
                            </div>
                            <div className="flex justify-between text-[13px] mt-1 pt-1.5 border-t border-secondary/10">
                                <span className="text-secondary/70 font-medium">Total Selected Pending:</span>
                                <span className="font-bold text-[#E50914]">₹{totalSelectedPending.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-semibold text-[#344054]">Payment Amount *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    required
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className={`w-full h-[40px] px-3 bg-white border ${isOverpaid ? 'border-red-500 focus:ring-red-500/10' : 'border-[#D0D5DD] focus:border-primary focus:ring-primary/10'} rounded-[8px] text-[14px] outline-none focus:ring-4 transition-all`}
                                />
                                {isOverpaid && (
                                    <p className="text-[11px] text-red-500 mt-1 font-medium leading-tight">Total exceeds ₹{totalSelectedPending.toFixed(2)}</p>
                                )}
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-semibold text-[#344054]">Discount (Optional)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={discountAmount}
                                    onChange={handleDiscountChange}
                                    placeholder="₹0.00"
                                    className="w-full h-[40px] px-3 bg-white border border-[#D0D5DD] rounded-[8px] text-[14px] outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                />
                            </div>
                        </div>

                        {/* Remaining Display */}
                        {remainingPaise > 0 && !isOverpaid && paymentPaise > 0 && (
                            <div className="bg-[#FFF8E6] border border-[#FDE047] rounded-[8px] p-2.5 space-y-1 mt-2">
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-[#854D0E] font-medium">Remaining Pending</span>
                                    <span className="font-bold text-[#854D0E]">₹{(remainingPaise / 100).toFixed(2)}</span>
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[12px] font-semibold text-[#344054]">Payment Method</label>
                            <Select value={method} onValueChange={setMethod}>
                                <SelectTrigger className="w-full h-[40px] bg-white border border-[#D0D5DD] rounded-[8px] text-[14px] outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none">
                                    <SelectValue placeholder="Select Method" />
                                </SelectTrigger>
                                <SelectContent className="bg-white rounded-[8px] shadow-lg border border-[#D0D5DD]">
                                    {["Cash", "UPI", "Bank Transfer", "Cheque", "Other"].map(m => (
                                        <SelectItem key={m} value={m} className="hover:bg-primary/5 focus:bg-primary/5 cursor-pointer text-[14px]">{m}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[12px] font-semibold text-[#344054]">Reference / Transaction No.</label>
                            <input
                                type="text"
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                                placeholder="Optional"
                                className="w-full h-[40px] px-3 bg-white border border-[#D0D5DD] rounded-[8px] text-[14px] outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[12px] font-semibold text-[#344054]">Payment Date</label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full h-[40px] px-3 bg-white border border-[#D0D5DD] rounded-[8px] text-[14px] outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[12px] font-semibold text-[#344054]">Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Optional notes..."
                                className="w-full py-2 px-3 bg-white border border-[#D0D5DD] rounded-[8px] text-[14px] outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none min-h-[60px] max-h-[80px]"
                            />
                        </div>
                    </div>

                    <div className="p-4 border-t border-[#E4E7EC] flex items-center justify-end gap-[10px] shrink-0">
                        <Button 
                            type="button" 
                            variant="secondary" 
                            onClick={() => onClose(false)}
                            className="bg-white hover:bg-gray-50 text-secondary border border-[#E5E7EB] h-[40px] px-4 font-medium"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={mutation.isPending || isOverpaid || (paymentPaise === 0 && explicitDiscountPaise === 0)}
                            className="bg-[#E50914] hover:bg-[#C90C15] text-white disabled:opacity-50 disabled:cursor-not-allowed h-[40px] px-4 font-semibold"
                        >
                            {mutation.isPending 
                                ? "Processing..." 
                                : `Collect ₹${(paymentPaise / 100).toFixed(2)}`
                            }
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
