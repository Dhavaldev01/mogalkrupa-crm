function notFoundHandler(req, res) {
  res.status(404).json({ error: "Route not found" });
}

function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // Handle MongoDB duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    if (field === "mobileNumber" || field === "mobile") {
      message = "Customer with this mobile number already exists";
    } else {
      message = `Duplicate field value entered for ${field}`;
    }
  }

  res.status(statusCode).json({ success: false, message });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
