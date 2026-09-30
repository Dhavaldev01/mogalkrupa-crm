const mongoose = require("mongoose");

const rateSchema = new mongoose.Schema(
  {
    site: {
      type: Number,
      required: true,
      unique: true,
      min: [0.0001, "Site must be greater than 0"],
    },
    rate: {
      type: Number,
      required: true,
      min: [0, "Rate cannot be negative"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rate", rateSchema);
