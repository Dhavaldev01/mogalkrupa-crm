const ExcelJS = require("exceljs");
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

    const rateDoc = await Rate.findById(item.rateId);
    if (!rateDoc) throw new CustomError(`Valid Rate required. Selected rate not found.`, 400);

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

const exportCustomerInvoices = asyncHandler(async (req, res) => {
  const customerId = req.params.id;
  const { startDate, endDate, status } = req.query;

  if (!customerId) {
    throw new CustomError("Customer ID is required", 400);
  }

  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new CustomError("Customer not found", 404);
  }

  let query = { customer: customerId };
  
  if (status && status !== "All") {
    if (status === "Unpaid") {
       query.pendingAmount = { $gt: 0 };
    } else if (status === "Paid") {
       query.status = "Paid";
    }
  }

  if (startDate && endDate) {
    const startObj = new Date(startDate);
    startObj.setHours(0, 0, 0, 0);
    const endObj = new Date(endDate);
    endObj.setHours(0, 0, 0, 0);
    endObj.setDate(endObj.getDate() + 1);
    
    query.date = { $gte: startObj, $lt: endObj };
  }

  const invoices = await Invoice.find(query).sort({ date: -1, createdAt: -1 });

  if (invoices.length === 0) {
      return res.status(404).json({ success: false, message: "No invoices found for the selected month and status." });
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Invoices", {
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1 }
  });

  worksheet.getColumn(1).width = 10;
  worksheet.getColumn(2).width = 18;
  worksheet.getColumn(3).width = 18;
  worksheet.getColumn(4).width = 18;
  worksheet.getColumn(5).width = 18;
  worksheet.getColumn(6).width = 16;
  worksheet.getColumn(7).width = 20;
  worksheet.getColumn(8).width = 16;

  worksheet.mergeCells('A1:H2');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = "CUSTOMER INVOICE REPORT";
  titleCell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 16 };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF800000' }
  };

  const addInfoRow = (rowNum, leftLabel, leftValue, rightLabel, rightValue) => {
      const row = worksheet.getRow(rowNum);
      row.height = 25;
      
      // Merge and style Left Label (A:B)
      worksheet.mergeCells(`A${rowNum}:B${rowNum}`);
      ['A', 'B'].forEach(col => {
          const cell = worksheet.getCell(`${col}${rowNum}`);
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE4E1' } };
          cell.border = { top: {style:'thin', color:{argb:'FFCCCCCC'}}, left: {style:'thin', color:{argb:'FFCCCCCC'}}, bottom: {style:'thin', color:{argb:'FFCCCCCC'}}, right: {style:'thin', color:{argb:'FFCCCCCC'}} };
      });
      const llCell = worksheet.getCell(`A${rowNum}`);
      llCell.value = leftLabel;
      llCell.font = { bold: true };
      llCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

      // Merge and style Left Value (C:D)
      worksheet.mergeCells(`C${rowNum}:D${rowNum}`);
      ['C', 'D'].forEach(col => {
          const cell = worksheet.getCell(`${col}${rowNum}`);
          cell.border = { top: {style:'thin', color:{argb:'FFCCCCCC'}}, left: {style:'thin', color:{argb:'FFCCCCCC'}}, bottom: {style:'thin', color:{argb:'FFCCCCCC'}}, right: {style:'thin', color:{argb:'FFCCCCCC'}} };
      });
      const lvCell = worksheet.getCell(`C${rowNum}`);
      lvCell.value = leftValue;
      lvCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

      // Style Right Label (F)
      if (rightLabel) {
        const rlCell = worksheet.getCell(`F${rowNum}`);
        rlCell.value = rightLabel;
        rlCell.font = { bold: true };
        rlCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE4E1' } };
        rlCell.border = { top: {style:'thin', color:{argb:'FFCCCCCC'}}, left: {style:'thin', color:{argb:'FFCCCCCC'}}, bottom: {style:'thin', color:{argb:'FFCCCCCC'}}, right: {style:'thin', color:{argb:'FFCCCCCC'}} };
        rlCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

        // Merge and style Right Value (G:H)
        worksheet.mergeCells(`G${rowNum}:H${rowNum}`);
        ['G', 'H'].forEach(col => {
            const cell = worksheet.getCell(`${col}${rowNum}`);
            cell.border = { top: {style:'thin', color:{argb:'FFCCCCCC'}}, left: {style:'thin', color:{argb:'FFCCCCCC'}}, bottom: {style:'thin', color:{argb:'FFCCCCCC'}}, right: {style:'thin', color:{argb:'FFCCCCCC'}} };
        });
        const rvCell = worksheet.getCell(`G${rowNum}`);
        rvCell.value = rightValue;
        rvCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
      }
  };

  const formatDate = (dateString) => {
      const d = new Date(dateString);
      const day = d.getDate().toString().padStart(2, '0');
      const monthStr = d.toLocaleString('en-US', { month: 'short' });
      const year = d.getFullYear();
      return `${day} ${monthStr} ${year}`;
  };

  const dateRangeStr = (startDate && endDate) ? `${formatDate(startDate)} - ${formatDate(endDate)}` : "All Dates";
  const statusStrForDisplay = status && status !== "All" ? status : "All Records";
  const dateStr = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  const custName = customer.firstName ? `${customer.firstName} ${customer.lastName || ''}`.trim() : "";

  addInfoRow(4, "Customer Name", custName, "Date Range", dateRangeStr);
  addInfoRow(5, "Shop Name", customer.shopName || "", "Status", statusStrForDisplay);
  addInfoRow(6, "Mobile Number", customer.mobileNumber || "", "Exported On", dateStr);

  const headerRow = worksheet.getRow(9);
  headerRow.height = 25;
  const headers = ["Sr. No.", "Invoice No.", "Invoice Date", "Bill Amount", "Paid Amount", "Discount", "Pending Amount", "Status"];
  headers.forEach((text, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = text;
    cell.font = { bold: true, color: { argb: 'FF800000' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE4E1' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
  });

  worksheet.views = [{ state: 'frozen', ySplit: 9 }];

  let currentRow = 10;
  let totalBillAmount = 0;
  let totalPaidAmount = 0;
  let totalDiscount = 0;
  let totalPendingAmount = 0;

  invoices.forEach((inv, index) => {
    const row = worksheet.getRow(currentRow);
    
    row.getCell(1).value = index + 1;
    row.getCell(2).value = inv.invoiceNumber;
    row.getCell(3).value = inv.date ? new Date(inv.date) : "";
    row.getCell(3).numFmt = 'yyyy-mm-dd';

    row.getCell(4).value = inv.grandTotal || 0;
    row.getCell(5).value = inv.paidAmount || 0;
    row.getCell(6).value = inv.invoiceDiscount || 0;
    row.getCell(7).value = inv.pendingAmount || 0;
    
    [4, 5, 6, 7].forEach(colIndex => {
        row.getCell(colIndex).numFmt = '₹#,##0.00';
    });

    const statusCell = row.getCell(8);
    statusCell.value = inv.status || "";
    
    let statusFill = { argb: 'FFFFFFFF' };
    if (inv.status === "Paid") {
        statusFill = { argb: 'FFD4EDDA' };
    } else if (inv.status === "Pending") {
        statusFill = { argb: 'FFF8D7DA' };
    } else if (inv.status === "Partial") {
        statusFill = { argb: 'FFFFF3CD' };
    }
    
    statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: statusFill };

    for (let i = 1; i <= 8; i++) {
        const cell = row.getCell(i);
        cell.border = { top: {style:'thin', color:{argb:'FFCCCCCC'}}, left: {style:'thin', color:{argb:'FFCCCCCC'}}, bottom: {style:'thin', color:{argb:'FFCCCCCC'}}, right: {style:'thin', color:{argb:'FFCCCCCC'}} };
        if (i === 1 || i === 8) {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } else if (i === 2) {
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
        }
    }

    totalBillAmount += (inv.grandTotal || 0);
    totalPaidAmount += (inv.paidAmount || 0);
    totalDiscount += (inv.invoiceDiscount || 0);
    totalPendingAmount += (inv.pendingAmount || 0);

    currentRow++;
  });

  const totalsRow = worksheet.getRow(currentRow);
  totalsRow.height = 25;
  
  worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
  const labelCell = totalsRow.getCell(1);
  labelCell.value = "TOTALS :";
  labelCell.font = { bold: true, color: { argb: 'FF800000' } };
  labelCell.alignment = { vertical: 'middle', horizontal: 'right' };
  
  totalsRow.getCell(4).value = totalBillAmount;
  totalsRow.getCell(5).value = totalPaidAmount;
  totalsRow.getCell(6).value = totalDiscount;
  totalsRow.getCell(7).value = totalPendingAmount;
  
  for (let i = 1; i <= 8; i++) {
      const cell = totalsRow.getCell(i);
      if (i < 8) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE4E1' } };
      }
      cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
      if (i >= 4 && i <= 7) {
          cell.font = { bold: true };
          cell.numFmt = '₹#,##0.00';
          cell.alignment = { vertical: 'middle', horizontal: 'right' };
      }
  }

  const dateRangeForFile = (startDate && endDate) ? `${startDate}_to_${endDate}` : "All-Dates";
  const statusStrForFile = status ? status : "All-Records";
  let safeCustomerName = (customer.firstName ? customer.firstName : customer.shopName || "Customer").replace(/[^a-z0-9]/gi, '-');
  
  const filename = `${safeCustomerName}_${dateRangeForFile}_${statusStrForFile}.xlsx`;

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  await workbook.xlsx.write(res);
  res.end();
});

const getEarliestInvoiceYear = asyncHandler(async (req, res) => {
  const earliestInvoice = await Invoice.findOne({}, "date").sort({ date: 1 });
  let earliestYear = new Date().getFullYear();
  if (earliestInvoice && earliestInvoice.date) {
    earliestYear = new Date(earliestInvoice.date).getFullYear();
  }
  res.status(200).json({ success: true, data: { earliestYear } });
});

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoiceStatus,
  deleteInvoice,
  exportCustomerInvoices,
  getEarliestInvoiceYear,
};
