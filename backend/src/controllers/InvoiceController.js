const Invoice = require("../models/Invoice");
const Customer = require("../models/Customer");
const Rate = require("../models/Rate");
const Settings = require("../models/Settings");
const Sequence = require("../models/Sequence");
const asyncHandler = require("../utils/asyncHandler");
const CustomError = require("../utils/customError");
const { roundMoney } = require("../utils/moneyUtils");

async function getNextInvoiceNumber() {
  const sequenceDocument = await Sequence.findByIdAndUpdate(
    "invoice",
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  let settings = await Settings.findOne();
  let prefix = "INV-";
  if (settings && settings.invoicePrefix) {
    prefix = settings.invoicePrefix;
  }
  const seqStr = String(sequenceDocument.seq).padStart(4, "0");
  return `${prefix}${seqStr}`;
}

const getInvoices = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search;
  const status = req.query.status;
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;
  const customerId = req.query.customerId;

  let query = {};
  if (search) {
    const searchRegex = new RegExp(search, "i");
    query.$or = [
      { invoiceNumber: searchRegex },
      { "customerSnapshot.name": searchRegex },
      { "customerSnapshot.phone": searchRegex },
    ];
  }
  if (status) {
    query.status = status;
  }
  if (fromDate || toDate) {
    query.date = {};
    if (fromDate) query.date.$gte = new Date(fromDate);
    if (toDate) query.date.$lte = new Date(toDate);
  }
  if (customerId) {
    query.customer = customerId;
  }

  const total = await Invoice.countDocuments(query);
  const invoices = await Invoice.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: invoices,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    throw new CustomError("Invoice not found", 404);
  }
  res.status(200).json({ success: true, data: invoice });
});

const createInvoice = asyncHandler(async (req, res) => {
  const { date, customerId, items, invoiceDiscount, notes } = req.body;

  if (!customerId) throw new CustomError("Customer ID is required", 400);
  if (!items || items.length === 0) throw new CustomError("Invoice must have at least one item", 400);
  if (!date) throw new CustomError("Date is required", 400);

  const customer = await Customer.findById(customerId);
  if (!customer) throw new CustomError("Customer not found", 404);

  let processedItems = [];
  let dotTotal = 0;
  let siteTotal = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.jarkan <= 0) throw new CustomError("Jarkan must be greater than 0", 400);

    const rateDoc = await Rate.findOne({ site: item.site });
    if (!rateDoc) throw new CustomError(`Valid Site required. Site ${item.site} not found.`, 400);

    const jarkan = Number(item.jarkan);
    const site = Number(rateDoc.site);
    const rate = Number(rateDoc.rate);

    const dotAmount = roundMoney(jarkan * rate);
    const siteAmount = site;
    const total = roundMoney(dotAmount + siteAmount);

    processedItems.push({
      jarkan,
      site,
      rate,
      dotAmount,
      siteAmount,
      total
    });

    dotTotal = roundMoney(dotTotal + dotAmount);
    siteTotal = roundMoney(siteTotal + siteAmount);
  }

  const grossTotal = roundMoney(dotTotal + siteTotal);
  const discountVal = Number(invoiceDiscount) || 0;
  
  if (discountVal < 0) throw new CustomError("Discount cannot be negative", 400);
  if (discountVal > grossTotal) throw new CustomError("Discount cannot exceed gross total", 400);

  const grandTotal = roundMoney(grossTotal - discountVal);
  const invoiceNumber = await getNextInvoiceNumber();

  const invoice = await Invoice.create({
    invoiceNumber,
    date,
    customer: customer._id,
    customerSnapshot: {
      shopName: customer.shopName || "",
      firstName: customer.firstName || "",
      lastName: customer.lastName || "",
      name: `${customer.firstName} ${customer.lastName}`.trim(),
      phone: customer.mobileNumber || "",
      address: customer.address || "",
    },
    items: processedItems,
    dotTotal,
    siteTotal,
    invoiceDiscount: discountVal,
    grandTotal,
    paidAmount: 0,
    pendingAmount: grandTotal,
    status: "Pending",
    notes: notes || "",
  });

  res.status(201).json({ success: true, data: invoice });
});

const updateInvoiceStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["Pending", "Paid"].includes(status)) {
    throw new CustomError("Invalid status", 400);
  }

  const invoice = await Invoice.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!invoice) {
    throw new CustomError("Invoice not found", 404);
  }

  res.status(200).json({ success: true, data: invoice });
});

const deleteInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findByIdAndDelete(req.params.id);
  if (!invoice) {
    throw new CustomError("Invoice not found", 404);
  }
  res.status(200).json({ success: true, data: {} });
});

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoiceStatus,
  deleteInvoice,
};
