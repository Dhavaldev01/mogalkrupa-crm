const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },
    gstin: {
      type: String,
      uppercase: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

customerSchema.index({ firstName: 1, lastName: 1 });
customerSchema.index({ mobileNumber: 1 });
customerSchema.index({ gstin: 1 });

module.exports = mongoose.model("Customer", customerSchema);
