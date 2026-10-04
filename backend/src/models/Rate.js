const mongoose = require("mongoose");

const rateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    site: {
      type: Number,
      required: true,
      min: [0.0001, "Site must be greater than 0"],
      // IMPORTANT: unique: true અહીં ન હોવું જોઈએ
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

// Same name + same site duplicate નહીં થાય
rateSchema.index(
  { name: 1, site: 1 },
  { unique: true }
);

module.exports = mongoose.model("Rate", rateSchema);