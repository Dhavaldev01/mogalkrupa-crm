const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

const customerRoutes = require("./routes/customerRoutes");
const rateRoutes = require("./routes/rateRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const authRoutes = require("./routes/authRoutes");

const { requireAuth } = require("./middlewares/authMiddleware");
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/errorHandler");

const app = express();

/* =====================================================
   CORS
===================================================== */

const allowedOrigins = [
  "http://localhost:5173",
  "https://mogalkrupa-crm.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman / server-to-server / health checks
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

/* =====================================================
   BODY PARSERS
===================================================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(morgan("dev"));

/* =====================================================
   STATIC UPLOADS
===================================================== */

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../public/uploads"))
);

/* =====================================================
   HEALTH CHECK - PUBLIC
===================================================== */

app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    status: "ok",
    message: "Mogal Krupa CRM backend is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/v1/health", (req, res) => {
  return res.status(200).json({
    success: true,
    status: "ok",
    message: "Mogal Krupa CRM backend is running",
    timestamp: new Date().toISOString(),
  });
});

/* =====================================================
   AUTH - PUBLIC
===================================================== */

app.use("/api/v1/auth", authRoutes);

/* =====================================================
   PROTECTED ROUTES
===================================================== */

app.use("/api/v1/customers", requireAuth, customerRoutes);
app.use("/api/v1/rates", requireAuth, rateRoutes);
app.use("/api/v1/invoices", requireAuth, invoiceRoutes);
app.use("/api/v1/settings", requireAuth, settingsRoutes);
app.use("/api/v1/dashboard", requireAuth, dashboardRoutes);
app.use("/api/v1/upload", requireAuth, uploadRoutes);

/* =====================================================
   ERROR HANDLERS
===================================================== */

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;