const Customer = require("../models/Customer");
const Invoice = require("../models/Invoice");
const asyncHandler = require("../utils/asyncHandler");

const getDashboardSummary = asyncHandler(async (req, res) => {
  const { fromDate, toDate } = req.query;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let dateQuery = {};
  let createdAtQuery = {};
  if (fromDate || toDate) {
      dateQuery.date = {};
      createdAtQuery.createdAt = {};
      if (fromDate) {
          dateQuery.date.$gte = new Date(fromDate);
          createdAtQuery.createdAt.$gte = new Date(fromDate);
      }
      if (toDate) {
          dateQuery.date.$lte = new Date(toDate);
          createdAtQuery.createdAt.$lte = new Date(toDate);
      }
  } else {
      // Default to current month if no filter
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      dateQuery = { date: { $gte: startOfMonth } };
      createdAtQuery = { createdAt: { $gte: startOfMonth } };
  }

  const totalCustomers = await Customer.countDocuments({ isActive: true, ...createdAtQuery });
  const totalInvoices = await Invoice.countDocuments(dateQuery);

  // Today's billing (always today)
  const todayInvoices = await Invoice.aggregate([
    { $match: { date: { $gte: today } } },
    { $group: { _id: null, total: { $sum: "$grandTotal" } } },
  ]);
  const todayBilling = todayInvoices.length > 0 ? todayInvoices[0].total : 0;

  // Pending and Paid across filtered invoices (or all if not filtered, but we filter if dates provided)
  const totals = await Invoice.aggregate([
    { $match: dateQuery },
    { $group: { 
        _id: null, 
        totalPending: { $sum: "$pendingAmount" },
        totalPaid: { $sum: "$paidAmount" }
    }}
  ]);
  const pendingAmount = totals.length > 0 ? totals[0].totalPending : 0;
  const paidAmount = totals.length > 0 ? totals[0].totalPaid : 0;

  // Revenue for the filtered period (or month)
  const periodInvoices = await Invoice.aggregate([
    { $match: dateQuery },
    { $group: { _id: null, total: { $sum: "$grandTotal" } } },
  ]);
  const monthRevenue = periodInvoices.length > 0 ? periodInvoices[0].total : 0;

  // Chart data: Billing Overview for the filtered period
  const billingOverview = await Invoice.aggregate([
    { $match: dateQuery },
    { $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        amount: { $sum: "$grandTotal" }
    }},
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: "$_id", amount: 1 } }
  ]);

  const recentInvoices = await Invoice.find(dateQuery)
    .sort({ date: -1, createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    data: {
      totalCustomers,
      totalInvoices,
      todayBilling,
      pendingAmount,
      paidAmount,
      monthRevenue,
      billingOverview,
      recentInvoices,
    },
  });
});

module.exports = {
  getDashboardSummary,
};
