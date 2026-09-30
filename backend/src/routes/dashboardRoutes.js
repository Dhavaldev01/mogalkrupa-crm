const express = require("express");
const router = express.Router();
const { getDashboardSummary } = require("../controllers/DashboardController");

router.route("/summary").get(getDashboardSummary);

module.exports = router;
