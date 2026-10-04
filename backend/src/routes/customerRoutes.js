const express = require("express");
const router = express.Router();
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerSummary,
  getCustomerSummaryById,
  exportCustomerBillingSummary,
} = require("../controllers/customerController");

router.route("/summary").get(getCustomerSummary);
router.route("/billing-summary/export").get(exportCustomerBillingSummary);
router.route("/").get(getCustomers).post(createCustomer);
router
  .route("/:id")
  .get(getCustomerById)
  .put(updateCustomer)
  .delete(deleteCustomer);
router.route("/:id/summary").get(getCustomerSummaryById);

module.exports = router;
