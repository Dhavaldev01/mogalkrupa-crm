const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getPaymentsForInvoice,
  createPayment,
} = require("../controllers/paymentController");

// The route prefix will be /api/v1/invoices/:id/payments
router.route("/").get(getPaymentsForInvoice).post(createPayment);

module.exports = router;
