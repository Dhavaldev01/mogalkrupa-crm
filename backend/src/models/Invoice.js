const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema({
  jarkan: {
    type: Number,
    required: true,
    min: 0,
  },
  site: {
    type: Number,
    required: true,
    min: 0,
  },
  rate: {
    type: Number,
    required: true,
    min: 0,
  },
  dotAmount: {
    type: Number,
    required: true,
  },
  siteAmount: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    customerSnapshot: {
      shopName: { type: String, default: "" },
      firstName: { type: String, default: "" },
      lastName: { type: String, default: "" },
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, default: "" },
    },
    items: {
      type: [invoiceItemSchema],
      validate: [
        (val) => val.length > 0,
        "Invoice must have at least one item",
      ],
    },
    dotTotal: {
      type: Number,
      required: true,
    },
    siteTotal: {
      type: Number,
      required: true,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    pendingAmount: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    invoiceDiscount: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Paid", "Partial", "Pending"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

invoiceSchema.index({ "customerSnapshot.name": "text", "customerSnapshot.phone": "text" });

module.exports = mongoose.model("Invoice", invoiceSchema);
