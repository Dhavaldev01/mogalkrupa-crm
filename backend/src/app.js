const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const customerRoutes = require("./routes/customerRoutes");
const rateRoutes = require("./routes/rateRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const authRoutes = require("./routes/authRoutes");
const { requireAuth } = require("./middlewares/authMiddleware");
const cookieParser = require("cookie-parser");
const path = require("path");
const { notFoundHandler, errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Serve static files (uploads)
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

app.get("/health", (req, res) => {
  return res.status(200).json({ success: true, message: "Backend is running" });
});

// Auth Routes (Public)
app.use("/api/v1/auth", authRoutes);

// Protected API Routes
app.use("/api/v1/customers", requireAuth, customerRoutes);
app.use("/api/v1/rates", requireAuth, rateRoutes);
app.use("/api/v1/invoices", requireAuth, invoiceRoutes);
app.use("/api/v1/settings", requireAuth, settingsRoutes);
app.use("/api/v1/dashboard", requireAuth, dashboardRoutes);
app.use("/api/v1/upload", requireAuth, uploadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
