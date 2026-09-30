const mongoose = require("mongoose");
const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");
const asyncHandler = require("../utils/asyncHandler");
const CustomError = require("../utils/customError");

const getPaymentsForInvoice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payments = await Payment.find({ invoice: id }).sort({ date: -1 });
  res.status(200).json({ success: true, data: payments });
});

const createPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount, date, method, reference, notes } = req.body;

  if (amount == null || amount <= 0) {
    throw new CustomError("Valid amount is required", 400);
  }

  const invoice = await Invoice.findById(id);
  if (!invoice) {
    throw new CustomError("Invoice not found", 404);
  }

  const amountPaise = Math.round(amount * 100);
  const discountPaise = Math.round((req.body.discountAmount || 0) * 100);
  const pendingPaise = Math.round(invoice.pendingAmount * 100);

  // Check if overpaying
  if (pendingPaise < (amountPaise + discountPaise)) {
    throw new CustomError(`Payment and discount combined cannot exceed pending amount (₹${(pendingPaise / 100).toFixed(2)})`, 400);
  }

  const payment = await Payment.create({
    invoice: id,
    amount,
    date: date || new Date(),
    method: method || "Cash",
    reference,
    notes,
  });

  // Update invoice totals
  const allPayments = await Payment.find({ invoice: id });
  const paidPaise = allPayments.reduce((acc, curr) => acc + Math.round(curr.amount * 100), 0);
  
  const grandTotalPaise = Math.round(invoice.grandTotal * 100);
  
  // Accumulate the new discount with any previously applied discount
  const existingDiscountPaise = Math.round((invoice.discountAmount || 0) * 100);
  const totalDiscountPaise = existingDiscountPaise + discountPaise;
  
  const newPendingPaise = grandTotalPaise - paidPaise - totalDiscountPaise;

  let status = "Pending";
  if (newPendingPaise <= 0) {
    status = "Paid";
  } else if (paidPaise > 0 || totalDiscountPaise > 0) {
    status = "Partial";
  }

  invoice.paidAmount = paidPaise / 100;
  invoice.discountAmount = totalDiscountPaise / 100;
  invoice.pendingAmount = newPendingPaise / 100;
  invoice.status = status;
  await invoice.save();

  res.status(201).json({ success: true, data: payment, invoiceStatus: { paidAmount: invoice.paidAmount, pendingAmount: invoice.pendingAmount, status } });
});


const bulkPayment = asyncHandler(async (req, res) => {
  const { customerId, invoiceIds, amount, discountAmount, method, date, reference, notes } = req.body;

  // 1. PHASE 1: READ AND VALIDATE
  if (!customerId) {
    throw new CustomError("Customer ID is required", 400);
  }

  if (!invoiceIds || !Array.isArray(invoiceIds) || invoiceIds.length === 0) {
    throw new CustomError("A list of Invoice IDs is required", 400);
  }

  if (amount == null || amount <= 0) {
    throw new CustomError("Valid payment amount is required", 400);
  }

  const Customer = require("../models/Customer");
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new CustomError("Customer not found", 404);
  }

  // Fetch invoices
  const invoices = await Invoice.find({ 
    _id: { $in: invoiceIds } 
  }).sort({ date: 1, createdAt: 1 });

  if (invoices.length !== invoiceIds.length) {
    throw new CustomError("Some invoices are invalid or missing", 400);
  }

  const toPaise = (value) => Math.round((Number(value) || 0) * 100);
  const fromPaise = (value) => Number((value / 100).toFixed(2));

  let totalPendingPaise = 0;
  for (const inv of invoices) {
    if (inv.customer.toString() !== customerId.toString()) {
      throw new CustomError(`Invoice ${inv.invoiceNumber} does not belong to this customer`, 400);
    }
    totalPendingPaise += toPaise(inv.pendingAmount);
  }

  const amountPaise = toPaise(amount);
  const explicitDiscountPaise = toPaise(discountAmount || 0);

  if (amountPaise + explicitDiscountPaise > totalPendingPaise) {
    throw new CustomError(`Payment + Discount cannot exceed the total selected pending amount (₹${fromPaise(totalPendingPaise)})`, 400);
  }

  // 2. PHASE 2: CALCULATE ALLOCATION PLAN
  let remainingPaymentPaise = amountPaise;
  let remainingDiscountPaise = explicitDiscountPaise;
  const updates = [];

  for (const inv of invoices) {
    const invPendingPaise = toPaise(inv.pendingAmount);
    
    if (invPendingPaise <= 0 || (remainingPaymentPaise <= 0 && remainingDiscountPaise <= 0)) {
      continue;
    }

    const appliedPaise = Math.min(invPendingPaise, remainingPaymentPaise);
    const newPaidPaise = toPaise(inv.paidAmount) + appliedPaise;
    remainingPaymentPaise -= appliedPaise;

    const appliedDiscountPaise = Math.min(invPendingPaise - appliedPaise, remainingDiscountPaise);
    const newDiscountPaise = toPaise(inv.discountAmount || 0) + appliedDiscountPaise;
    remainingDiscountPaise -= appliedDiscountPaise;

    const newPendingPaise = invPendingPaise - appliedPaise - appliedDiscountPaise;

    let newStatus = "Pending";
    if (newPendingPaise <= 0) {
      newStatus = "Paid";
    } else if (newPaidPaise > 0 || newDiscountPaise > 0) {
      newStatus = "Partial";
    }

    updates.push({
      invoice: inv,
      appliedAmount: fromPaise(appliedPaise),
      newPaidAmount: fromPaise(newPaidPaise),
      newDiscountAmount: fromPaise(newDiscountPaise),
      newPendingAmount: fromPaise(newPendingPaise),
      newStatus
    });
  }

  // 3. PHASE 3: EXECUTE WRITES (No transactions, no sessions)
  const updatedInvoices = [];
  for (const update of updates) {
    const inv = update.invoice;
    
    // Create payment history record
    await Payment.create({
      invoice: inv._id,
      amount: update.appliedAmount,
      date: date || new Date(),
      method: method || "Cash",
      reference: reference || "",
      notes: notes || "Bulk Payment",
    });

    // Update invoice
    inv.paidAmount = update.newPaidAmount;
    inv.discountAmount = update.newDiscountAmount;
    inv.pendingAmount = update.newPendingAmount;
    inv.status = update.newStatus;
    
    await inv.save();
    updatedInvoices.push(inv);
  }

  res.status(200).json({ 
    success: true, 
    message: "Bulk payment successful", 
    data: { invoices: updatedInvoices } 
  });
});module.exports = {
  bulkPayment,
  getPaymentsForInvoice,
  createPayment,
};
