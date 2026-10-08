const Customer = require("../models/Customer");
const Invoice = require("../models/Invoice");
const asyncHandler = require("../utils/asyncHandler");
const CustomError = require("../utils/customError");

const getCustomerSummary = asyncHandler(async (req, res) => {
  const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
  const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
  const invStatus = req.query.invStatus;


  let invoiceMatch = {};
  if (startDate && endDate) {
    invoiceMatch.date = { $gte: startDate, $lte: endDate };
  } else if (startDate) {
    invoiceMatch.date = { $gte: startDate };
  } else if (endDate) {
    invoiceMatch.date = { $lte: endDate };
  }

  if (invStatus === 'Paid') {
    invoiceMatch.pendingAmount = { $lte: 0 };
  } else if (invStatus === 'Unpaid') {
    invoiceMatch.pendingAmount = { $gt: 0 };
  }

  const invoicePipeline = [];
  if (Object.keys(invoiceMatch).length > 0) {
    invoicePipeline.push({ $match: invoiceMatch });
  }
  invoicePipeline.push({
    $group: {
      _id: null,
      totalBills: { $sum: 1 },
      totalBilling: { $sum: "$grandTotal" },
      pendingAmount: { $sum: "$pendingAmount" },
    },
  });

  const totalCustomers = await Customer.countDocuments({ isActive: { $ne: false } });
  const invoiceAggregation = await Invoice.aggregate(invoicePipeline);

  const totals = invoiceAggregation[0] || {
    totalBills: 0,
    totalBilling: 0,
    pendingAmount: 0,
  };

  res.status(200).json({
    success: true,
    data: {
      totalCustomers,
      totalBills: totals.totalBills,
      totalBilling: totals.totalBilling,
      pendingAmount: totals.pendingAmount,
    }
  });
});

const getCustomers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search;
  const status = req.query.status; // 'active', 'inactive', 'all'
  const pending = req.query.pending; // 'has', 'no'
  const pendingSort = req.query.pendingSort; // 'asc', 'desc'
  const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
  const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
  const invStatus = req.query.invStatus;

  let matchQuery = {};

  if (status === 'active') {
    matchQuery.isActive = { $ne: false };
  } else if (status === 'inactive') {
    matchQuery.isActive = false;
  } else if (status === 'all') {
    // no status filter
  } else {
    // default to active
    matchQuery.isActive = { $ne: false };
  }

  if (search) {
    const searchRegex = new RegExp(search, "i");
    matchQuery.$or = [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { shopName: searchRegex },
      { mobileNumber: searchRegex },
      { city: searchRegex },
    ];
  }

  let invoiceMatch = { $expr: { $eq: ["$customer", "$$c_id"] } };
  if (startDate && endDate) {
    invoiceMatch.date = { $gte: startDate, $lte: endDate };
  } else if (startDate) {
    invoiceMatch.date = { $gte: startDate };
  } else if (endDate) {
    invoiceMatch.date = { $lte: endDate };
  }

  if (invStatus === 'Paid') {
    invoiceMatch.pendingAmount = { $lte: 0 };
  } else if (invStatus === 'Unpaid') {
    invoiceMatch.pendingAmount = { $gt: 0 };
  }

  // Base pipeline
  let pipeline = [
    { $match: matchQuery },
    {
      $lookup: {
        from: "invoices",
        let: { c_id: "$_id" },
        pipeline: [
          { $match: invoiceMatch }
        ],
        as: "invoices",
      }
    },
    {
      $addFields: {
        totalBills: { $size: "$invoices" },
        pendingAmount: { $sum: "$invoices.pendingAmount" },
        status: { $cond: { if: { $eq: ["$isActive", false] }, then: "inactive", else: "active" } }
      }
    },
    {
      $project: { invoices: 0 }
    }
  ];

  // Pending filter
  if (pending === 'has') {
    pipeline.push({ $match: { pendingAmount: { $gt: 0 } } });
  } else if (pending === 'no') {
    pipeline.push({ $match: { pendingAmount: 0 } });
  }

  // Pending sort or default sort
  if (pendingSort === 'asc') {
    pipeline.push({ $sort: { pendingAmount: 1, createdAt: -1 } });
  } else if (pendingSort === 'desc') {
    pipeline.push({ $sort: { pendingAmount: -1, createdAt: -1 } });
  } else {
    pipeline.push({ $sort: { createdAt: -1 } });
  }

  // Count total documents matching the pipeline filters (before skip/limit)
  const countPipeline = [...pipeline, { $count: "total" }];
  const countResult = await Customer.aggregate(countPipeline);
  const total = countResult.length > 0 ? countResult[0].total : 0;

  // Pagination
  pipeline.push({ $skip: (page - 1) * limit });
  pipeline.push({ $limit: limit });

  const customers = await Customer.aggregate(pipeline);

  res.status(200).json({
    success: true,
    data: customers,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
  });
});

const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    throw new CustomError("Customer not found", 404);
  }
  res.status(200).json({ success: true, data: customer });
});

const getCustomerSummaryById = asyncHandler(async (req, res) => {
  const customerId = req.params.id;
  const { mongoose } = require("mongoose");
  const invoiceAggregation = await Invoice.aggregate([
    { $match: { customer: new mongoose.Types.ObjectId(customerId) } },
    {
      $group: {
        _id: null,
        totalBills: { $sum: 1 },
        totalBilling: { $sum: "$grandTotal" },
        paidAmount: { $sum: "$paidAmount" },
        pendingAmount: { $sum: "$pendingAmount" },
      },
    },
  ]);

  const totals = invoiceAggregation[0] || {
    totalBills: 0,
    totalBilling: 0,
    paidAmount: 0,
    pendingAmount: 0,
  };

  res.status(200).json({
    success: true,
    data: totals
  });
});

const normalizeMobile = (mobile) => {
  if (!mobile) return "";
  const digits = mobile.replace(/\D/g, "");
  return digits.slice(-10);
};

const createCustomer = asyncHandler(async (req, res) => {
  const { shopName, firstName, lastName, mobileNumber, gstin, address, city } = req.body;
  if (!shopName || !firstName || !lastName || !mobileNumber) {
    throw new CustomError("Shop name, first name, last name, and mobile number are required", 400);
  }

  const normalizedMobile = normalizeMobile(mobileNumber);
  const existingCustomer = await Customer.findOne({
    $expr: { $eq: [{ $substr: ["$mobileNumber", { $subtract: [{ $strLenCP: "$mobileNumber" }, 10] }, 10] }, normalizedMobile] }
  });
  // Wait, MongoDB aggregation string functions might be slow. Since we already have data, we'll do a RegExp search or fetch and compare, or just check exact match on normalized. But the DB might have unnormalized ones!
  // Actually, wait, let's just use regex to match the last 10 digits:
  const duplicateCustomer = await Customer.findOne({
    mobileNumber: { $regex: new RegExp(normalizedMobile + "$") }
  });

  if (duplicateCustomer) {
    throw new CustomError("Customer with this mobile number already exists", 409);
  }

  const customer = await Customer.create({
    shopName,
    firstName,
    lastName,
    mobileNumber: normalizedMobile, // Store normalized to prevent future issues
    gstin,
    address,
    city,
  });

  res.status(201).json({ success: true, data: customer });
});

const updateCustomer = asyncHandler(async (req, res) => {
  if (req.body.mobileNumber) {
    const normalizedMobile = normalizeMobile(req.body.mobileNumber);
    const duplicateCustomer = await Customer.findOne({
      _id: { $ne: req.params.id },
      mobileNumber: { $regex: new RegExp(normalizedMobile + "$") }
    });

    if (duplicateCustomer) {
      throw new CustomError("Customer with this mobile number already exists", 409);
    }
    req.body.mobileNumber = normalizedMobile;
  }

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!customer) {
    throw new CustomError("Customer not found", 404);
  }

  res.status(200).json({ success: true, data: customer });
});

const deleteCustomer = asyncHandler(async (req, res) => {
  const customerId = req.params.id;
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new CustomError("Customer not found", 404);
  }

  const invoiceCount = await Invoice.countDocuments({ customer: customerId });

  if (invoiceCount > 0) {
    customer.isActive = false;
    await customer.save();
  } else {
    await Customer.findByIdAndDelete(customerId);
  }

  res.status(200).json({ success: true, data: {} });
});

const exportCustomerBillingSummary = asyncHandler(async (req, res) => {
  const { startDate, endDate, customerId, invStatus, search } = req.query;
  const ExcelJS = require("exceljs");

  let customerMatchQuery = { isActive: { $ne: false } };

  if (customerId && customerId !== "All") {
    const { mongoose } = require("mongoose");
    customerMatchQuery._id = new mongoose.Types.ObjectId(customerId);
  }

  if (search) {
    const searchRegex = new RegExp(search, "i");
    customerMatchQuery.$or = [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { shopName: searchRegex },
      { mobileNumber: searchRegex },
      { city: searchRegex },
    ];
  }

  let invoiceMatch = { $expr: { $eq: ["$customer", "$$c_id"] } };
  if (startDate && endDate) {
    const startObj = new Date(startDate);
    startObj.setHours(0, 0, 0, 0);
    const endObj = new Date(endDate);
    endObj.setHours(0, 0, 0, 0);
    endObj.setDate(endObj.getDate() + 1);
    invoiceMatch.date = { $gte: startObj, $lt: endObj };
  }

  if (invStatus === 'Paid') {
    invoiceMatch.pendingAmount = { $lte: 0 };
  } else if (invStatus === 'Unpaid') {
    invoiceMatch.pendingAmount = { $gt: 0 };
  }

  let pipeline = [
    { $match: customerMatchQuery },
    {
      $lookup: {
        from: "invoices",
        let: { c_id: "$_id" },
        pipeline: [
          { $match: invoiceMatch },
          {
            $group: {
              _id: null,
              totalBills: { $sum: 1 },
              totalBilling: { $sum: "$grandTotal" },
              paidAmount: { $sum: "$paidAmount" },
              discount: { $sum: "$invoiceDiscount" },
              pendingAmount: { $sum: "$pendingAmount" },
            }
          }
        ],
        as: "invoiceStats",
      }
    },
    {
      $unwind: {
        path: "$invoiceStats",
        preserveNullAndEmptyArrays: true
      }
    }
  ];

  if (invStatus === 'Paid' || invStatus === 'Unpaid') {
    pipeline.push({ $match: { "invoiceStats": { $ne: null } } });
  }

  pipeline.push({ $sort: { createdAt: -1 } });

  const customersData = await Customer.aggregate(pipeline);

  if (customersData.length === 0) {
    return res.status(404).json({ success: false, message: "No customers found for the selected criteria." });
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Billing Summary", {
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1 }
  });

  worksheet.getColumn(1).width = 10;
  worksheet.getColumn(2).width = 22;
  worksheet.getColumn(3).width = 25;
  worksheet.getColumn(4).width = 18;
  worksheet.getColumn(5).width = 14;
  worksheet.getColumn(6).width = 18;
  worksheet.getColumn(7).width = 18;
  worksheet.getColumn(8).width = 16;
  worksheet.getColumn(9).width = 20;

  worksheet.mergeCells('A1:I2');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = "CUSTOMER BILLING SUMMARY REPORT";
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

    worksheet.mergeCells(`A${rowNum}:B${rowNum}`);
    ['A', 'B'].forEach(col => {
      const cell = worksheet.getCell(`${col}${rowNum}`);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE4E1' } };
      cell.border = { top: { style: 'thin', color: { argb: 'FFCCCCCC' } }, left: { style: 'thin', color: { argb: 'FFCCCCCC' } }, bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } }, right: { style: 'thin', color: { argb: 'FFCCCCCC' } } };
    });
    const llCell = worksheet.getCell(`A${rowNum}`);
    llCell.value = leftLabel;
    llCell.font = { bold: true };
    llCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

    worksheet.mergeCells(`C${rowNum}:D${rowNum}`);
    ['C', 'D'].forEach(col => {
      const cell = worksheet.getCell(`${col}${rowNum}`);
      cell.border = { top: { style: 'thin', color: { argb: 'FFCCCCCC' } }, left: { style: 'thin', color: { argb: 'FFCCCCCC' } }, bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } }, right: { style: 'thin', color: { argb: 'FFCCCCCC' } } };
    });
    const lvCell = worksheet.getCell(`C${rowNum}`);
    lvCell.value = leftValue;
    lvCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

    if (rightLabel) {
      const rlCell = worksheet.getCell(`G${rowNum}`);
      rlCell.value = rightLabel;
      rlCell.font = { bold: true };
      rlCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE4E1' } };
      rlCell.border = { top: { style: 'thin', color: { argb: 'FFCCCCCC' } }, left: { style: 'thin', color: { argb: 'FFCCCCCC' } }, bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } }, right: { style: 'thin', color: { argb: 'FFCCCCCC' } } };
      rlCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

      worksheet.mergeCells(`H${rowNum}:I${rowNum}`);
      ['H', 'I'].forEach(col => {
        const cell = worksheet.getCell(`${col}${rowNum}`);
        cell.border = { top: { style: 'thin', color: { argb: 'FFCCCCCC' } }, left: { style: 'thin', color: { argb: 'FFCCCCCC' } }, bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } }, right: { style: 'thin', color: { argb: 'FFCCCCCC' } } };
      });
      const rvCell = worksheet.getCell(`H${rowNum}`);
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
  const dateStr = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  let custNameForDisplay = "All Customers";
  if (customerId && customerId !== "All") {
    const c = customersData.find(c => c._id.toString() === customerId);
    if (c) {
      custNameForDisplay = `${c.firstName || ""} ${c.lastName || ""}`.trim() || c.shopName || "";
    }
  }

  addInfoRow(4, "Date Range", dateRangeStr, "Exported On", dateStr);
  addInfoRow(5, "Customer", custNameForDisplay, "", "");

  const headerRow = worksheet.getRow(7);
  headerRow.height = 25;
  const headers = ["Sr. No.", "Shop Name", "Customer Name", "Mobile No.", "Total Bills", "Total Billing", "Paid Amount", "Discount", "Pending Amount"];
  headers.forEach((text, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = text;
    cell.font = { bold: true, color: { argb: 'FF800000' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE4E1' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  });

  worksheet.views = [{ state: 'frozen', ySplit: 7 }];

  let currentRow = 8;
  let tCustomers = 0;
  let tBills = 0;
  let tBilling = 0;
  let tPaid = 0;
  let tDiscount = 0;
  let tPending = 0;

  customersData.forEach((cust, index) => {
    const ag = cust.invoiceStats || {};

    const row = worksheet.getRow(currentRow);
    row.getCell(1).value = index + 1;
    row.getCell(2).value = cust.shopName || "";
    row.getCell(3).value = `${cust.firstName || ""} ${cust.lastName || ""}`.trim();
    row.getCell(4).value = cust.mobileNumber || "";

    row.getCell(5).value = ag.totalBills || 0;
    row.getCell(6).value = ag.totalBilling || 0;
    row.getCell(7).value = ag.paidAmount || 0;
    row.getCell(8).value = ag.discount || 0;
    row.getCell(9).value = ag.pendingAmount || 0;

    [6, 7, 8, 9].forEach(colIndex => {
      row.getCell(colIndex).numFmt = '₹#,##0.00';
    });

    for (let i = 1; i <= 9; i++) {
      const cell = row.getCell(i);
      cell.border = { top: { style: 'thin', color: { argb: 'FFCCCCCC' } }, left: { style: 'thin', color: { argb: 'FFCCCCCC' } }, bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } }, right: { style: 'thin', color: { argb: 'FFCCCCCC' } } };
      if (i === 1 || i === 5) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      } else if (i <= 4) {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      }
    }

    tCustomers++;
    tBills += (ag.totalBills || 0);
    tBilling += (ag.totalBilling || 0);
    tPaid += (ag.paidAmount || 0);
    tDiscount += (ag.discount || 0);
    tPending += (ag.pendingAmount || 0);

    currentRow++;
  });

  const totalsRow = worksheet.getRow(currentRow);
  totalsRow.height = 25;

  worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
  const labelCell = totalsRow.getCell(1);
  labelCell.value = `TOTALS | Customers: ${tCustomers}`;
  labelCell.font = { bold: true, color: { argb: 'FF800000' } };
  labelCell.alignment = { vertical: 'middle', horizontal: 'right', indent: 1 };

  totalsRow.getCell(5).value = tBills;
  totalsRow.getCell(6).value = tBilling;
  totalsRow.getCell(7).value = tPaid;
  totalsRow.getCell(8).value = tDiscount;
  totalsRow.getCell(9).value = tPending;

  for (let i = 1; i <= 9; i++) {
    const cell = totalsRow.getCell(i);
    if (i < 5) {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE4E1' } };
    } else {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE4E1' } };
    }
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    if (i >= 5 && i <= 9) {
      cell.font = { bold: true };
      if (i >= 6) {
        cell.numFmt = '₹#,##0.00';
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
      } else {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }
    }
  }

  const dateRangeForFile = (startDate && endDate) ? `${startDate}_to_${endDate}` : "All-Dates";

  let filename;
  if (customerId && customerId !== "All") {
    let safeName = custNameForDisplay.replace(/[^a-z0-9]/gi, '-');
    filename = `${safeName}_Billing-Summary_${dateRangeForFile}.xlsx`;
  } else {
    filename = `Customer-Billing-Summary_${dateRangeForFile}.xlsx`;
  }

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  await workbook.xlsx.write(res);
  res.end();
});

module.exports = {
  getCustomerSummary,
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerSummaryById,
  exportCustomerBillingSummary,
};
