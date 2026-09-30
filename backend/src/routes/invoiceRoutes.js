const express = require("express");
const router = express.Router();
const { bulkPayment } = require("../controllers/paymentController");
const {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoiceStatus,
  deleteInvoice,
} = require("../controllers/InvoiceController");
const paymentRoutes = require("./paymentRoutes");

router.route("/").get(getInvoices).post(createInvoice);
router.route("/:id").get(getInvoiceById).delete(deleteInvoice);
router.route("/:id/status").patch(updateInvoiceStatus);

router.post("/bulk/payments", bulkPayment);
router.use("/:id/payments", paymentRoutes);

module.exports = router;
