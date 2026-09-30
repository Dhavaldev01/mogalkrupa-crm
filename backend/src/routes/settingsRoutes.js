const express = require("express");
const router = express.Router();
const {
  getSettings,
  updateSettings,
} = require("../controllers/SettingsController");

router.route("/").get(getSettings).put(updateSettings);

module.exports = router;
