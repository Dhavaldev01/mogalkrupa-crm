const express = require("express");
const router = express.Router();
const { bulkPayment } = require("../controllers/paymentController");
const {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoiceStatus,
  deleteInvoice,
  exportCustomerInvoices,
  getEarliestInvoiceYear,
} = require("../controllers/InvoiceController");
const paymentRoutes = require("./paymentRoutes");

router.route("/earliest-year").get(getEarliestInvoiceYear);
router.route("/customer/:id/export").get(exportCustomerInvoices);

router.route("/").get(getInvoices).post(createInvoice);
router.route("/:id").get(getInvoiceById).delete(deleteInvoice);
router.route("/:id/status").patch(updateInvoiceStatus);

router.post("/bulk/payments", bulkPayment);
router.use("/:id/payments", paymentRoutes);

module.exports = router;
