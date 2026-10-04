const Settings = require("../models/Settings");
const asyncHandler = require("../utils/asyncHandler");

const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  res.status(200).json({ success: true, data: settings });
});

const updateSettings = asyncHandler(async (req, res) => {
  if (req.body.whatsappNumber) {
    let num = req.body.whatsappNumber.replace(/[\s\+\-\(\)]/g, "");
    if (num.length === 10) {
      num = "91" + num;
    }
    req.body.whatsappNumber = num;
  }

  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create(req.body);
  } else {
    settings = await Settings.findByIdAndUpdate(settings._id, req.body, {
      new: true,
      runValidators: true,
    });
  }
  res.status(200).json({ success: true, data: settings });
});

module.exports = {
  getSettings,
  updateSettings,
};
