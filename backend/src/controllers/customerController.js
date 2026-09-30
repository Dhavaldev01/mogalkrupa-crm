const Customer = require("../models/Customer");
const Invoice = require("../models/Invoice");
const asyncHandler = require("../utils/asyncHandler");
const CustomError = require("../utils/customError");

const getCustomerSummary = asyncHandler(async (req, res) => {
  const totalCustomers = await Customer.countDocuments({ isActive: { $ne: false } });
  
  const invoiceAggregation = await Invoice.aggregate([
    {
      $group: {
        _id: null,
        totalBills: { $sum: 1 },
        totalBilling: { $sum: "$grandTotal" },
        pendingAmount: { $sum: "$pendingAmount" },
      },
    },
  ]);
  
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

  // Base pipeline
  let pipeline = [
    { $match: matchQuery },
    {
      $lookup: {
        from: "invoices",
        localField: "_id",
        foreignField: "customer",
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

module.exports = {
  getCustomerSummary,
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerSummaryById,
};
