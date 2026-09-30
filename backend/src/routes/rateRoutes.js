const express = require("express");
const router = express.Router();
const {
  getRates,
  getRateById,
  createRate,
  updateRate,
  deleteRate,
} = require("../controllers/RateController");

router.route("/").get(getRates).post(createRate);
router.route("/:id").get(getRateById).put(updateRate).delete(deleteRate);

module.exports = router;
