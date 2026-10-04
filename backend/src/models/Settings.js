const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    shopName: { type: String, default: "મોગલ ટ્રેડર્સ" },
    shopSubtitle: { type: String, default: "CNC & Tools" },
    owner1Name: { type: String, default: "" },
    phone1: { type: String, default: "" },
    owner2Name: { type: String, default: "" },
    phone2: { type: String, default: "" },
    whatsappNumber: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "Gujarat" },
    pincode: { type: String, default: "" },
    email: { type: String, default: "" },
    website: { type: String, default: "" },
    gstin: { type: String, default: "" },
    businessType: { type: String, default: "Proprietorship" },
    businessCategory: { type: String, default: "CNC & Laser Cutting" },
    currency: { type: String, default: "₹ INR" },
    upiId: { type: String, default: "" },
    bankName: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
    ifsc: { type: String, default: "" },
    logoUrl: { type: String, default: "" },

    qrCodeUrl: { type: String, default: "" },
    invoicePrefix: { type: String, default: "INV-" },
    defaultNotes: { type: String, default: "Thank you for your business." },
    defaultTerms: { type: String, default: "" },
    paperSize: { type: String, default: "A4" },
    showLogo: { type: Boolean, default: true },
    showGstin: { type: Boolean, default: true },
    showPhone: { type: Boolean, default: true },
    showEmail: { type: Boolean, default: true },
    showWebsite: { type: Boolean, default: true },
    showAddress: { type: Boolean, default: true },
    showQrCode: { type: Boolean, default: false },

    showTerms: { type: Boolean, default: true },
    showNotes: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
