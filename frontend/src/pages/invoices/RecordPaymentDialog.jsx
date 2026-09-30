import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/services";
import Button from "@/components/common/Button";
import { toast } from "sonner";
import { safeNumber } from "@/lib/utils";

export default function RecordPaymentDialog({ open, onClose, invoice }) {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [method, setMethod] = useState("Cash");
  const [reference, setReference] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);

  // Initial load logic for amount
  React.useEffect(() => {
    if (open && invoice?.pendingAmount) {
      setAmount(invoice.pendingAmount.toFixed(2));
      setDiscountAmount("");
    }
  }, [open, invoice?.pendingAmount]);

  const handleDiscountChange = (e) => {
    const val = e.target.value;
    setDiscountAmount(val);
    if (!invoice?.pendingAmount) return;
    
    const discountPaise = Math.round(safeNumber(val) * 100);
    const pendingPaise = Math.round(invoice.pendingAmount * 100);
    
    if (discountPaise >= 0 && discountPaise <= pendingPaise) {
        setAmount(((pendingPaise - discountPaise) / 100).toFixed(2));
    }
  };

  const { data: res, isLoading } = useQuery({
    queryKey: ["payments", invoice?._id],
    queryFn: () => paymentService.getForInvoice(invoice._id),
    enabled: !!invoice?._id && open,
  });

  const payments = res?.data?.data || [];

  const mutation = useMutation({
    mutationFn: (data) => paymentService.create(invoice._id, data),
    onSuccess: () => {
      toast.success("Payment recorded successfully");
      queryClient.invalidateQueries(["payments", invoice._id]);
      queryClient.invalidateQueries(["invoices"]);
      setAmount("");
      setReference("");
      setMethod("Cash");
      onClose();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to record payment");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = safeNumber(amount);
    const numDiscount = safeNumber(discountAmount);
    
    const paymentPaise = Math.round(numAmount * 100);
    const discountPaise = Math.round(numDiscount * 100);
    const pendingPaise = Math.round((invoice?.pendingAmount || 0) * 100);
    
    if (paymentPaise < 0 || discountPaise < 0) return toast.error("Values cannot be negative");
    if (paymentPaise === 0 && discountPaise === 0) return toast.error("Enter a valid amount");
    if (paymentPaise + discountPaise > pendingPaise) return toast.error(`Total cannot exceed ₹${(pendingPaise/100).toFixed(2)}`);
    
    mutation.mutate({ 
        amount: numAmount, 
        discountAmount: discountPaise > 0 ? discountPaise / 100 : 0, 
        method, 
        reference, 
        date 
    });
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent showCloseButton={false} className="sm:max-w-[500px] rounded-md border border-[#DED8D3] p-0">
        <DialogHeader className="p-4 border-b border-[#DED8D3]">
          <DialogTitle className="text-base font-bold text-secondary">Record Payment for {invoice?.invoiceNumber}</DialogTitle>
        </DialogHeader>
        
        <div className="flex bg-[#F4F1ED] p-4 gap-4 border-b border-[#DED8D3]">
            <div className="flex-1 bg-white p-3 rounded shadow-sm border border-[#DED8D3]">
                <p className="text-[10px] uppercase font-bold text-secondary/60">Grand Total</p>
                <p className="text-sm font-bold text-secondary">₹{safeNumber(invoice?.grandTotal).toFixed(2)}</p>
            </div>
            <div className="flex-1 bg-white p-3 rounded shadow-sm border border-[#DED8D3]">
                <p className="text-[10px] uppercase font-bold text-secondary/60">Paid</p>
                <p className="text-sm font-bold text-[#08A64A]">₹{safeNumber(invoice?.paidAmount).toFixed(2)}</p>
            </div>
            <div className="flex-1 bg-white p-3 rounded shadow-sm border border-[#DED8D3]">
                <p className="text-[10px] uppercase font-bold text-secondary/60">Pending</p>
                <p className="text-sm font-bold text-[#E50914]">₹{safeNumber(invoice?.pendingAmount).toFixed(2)}</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                    <label className="text-xs font-bold text-secondary uppercase block">Amount *</label>
                    <input 
                        type="number"
                        step="0.01" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder={`Max ₹${invoice?.pendingAmount}`}
                        className="w-full text-sm p-2 border border-[#DED8D3] rounded outline-none focus:border-primary"
                    />
                </div>
                <div className="flex-1 space-y-1">
                    <label className="text-xs font-bold text-secondary uppercase block">Discount (Optional)</label>
                    <input 
                        type="number"
                        step="0.01" 
                        min="0"
                        value={discountAmount}
                        onChange={handleDiscountChange}
                        placeholder="₹0.00"
                        className="w-full text-sm p-2 border border-[#DED8D3] rounded outline-none focus:border-primary"
                    />
                </div>
            </div>
            <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                    <label className="text-xs font-bold text-secondary uppercase block">Date *</label>
                    <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full text-sm p-2 border border-[#DED8D3] rounded outline-none focus:border-primary"
                    />
                </div>
                <div className="flex-1 space-y-1">
                    <label className="text-xs font-bold text-secondary uppercase block">Method</label>
                    <select 
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                        className="w-full text-sm p-2 border border-[#DED8D3] rounded outline-none focus:border-primary bg-white"
                    >
                        <option value="Cash">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="flex-1 space-y-1">
                    <label className="text-xs font-bold text-secondary uppercase block">Reference (Optional)</label>
                    <input 
                        type="text" 
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="UPI Ref, Cheque No..."
                        className="w-full text-sm p-2 border border-[#DED8D3] rounded outline-none focus:border-primary"
                    />
                </div>
            </div>

            <Button 
                type="submit" 
                loading={mutation.isPending} 
                disabled={mutation.isPending || invoice?.pendingAmount <= 0} 
                primaryBtn 
                className="w-full py-2 bg-primary text-white hover:bg-primary/90 rounded text-sm font-bold mt-2"
            >
                {mutation.isPending ? "Saving..." : `Collect ₹${safeNumber(amount).toFixed(2)}`}
            </Button>
        </form>

        <div className="p-4 border-t border-[#DED8D3] bg-[#F4F1ED]">
            <p className="text-xs font-bold text-secondary uppercase mb-2">Payment History</p>
            {isLoading ? <p className="text-xs text-secondary/60">Loading...</p> : payments.length === 0 ? <p className="text-xs text-secondary/60">No payments recorded yet.</p> : (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                    {payments.map(p => (
                        <div key={p._id} className="flex justify-between items-center bg-white p-2 rounded border border-[#DED8D3] text-sm">
                            <div className="flex flex-col">
                                <span className="font-bold text-secondary">₹{safeNumber(p.amount).toFixed(2)} <span className="text-xs text-secondary/60 font-medium">via {p.method}</span></span>
                                {p.reference && <span className="text-[10px] text-secondary/60 uppercase">{p.reference}</span>}
                            </div>
                            <span className="text-xs text-secondary/80 font-medium">{new Date(p.date).toLocaleDateString("en-IN")}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
