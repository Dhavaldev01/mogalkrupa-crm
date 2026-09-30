require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/User");

const db = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/khodiyar-crm";

mongoose
  .connect(db)
  .then(async () => {
    console.log("MongoDB connected");
    const adminExists = await User.findOne({ email: "admin@example.com" });
    if (!adminExists) {
      await User.create({
        name: "Admin User",
        email: "admin@example.com",
        password: "secure-password",
        role: "admin",
      });
      console.log("Admin account created: admin@example.com / secure-password");
    } else {
      console.log("Admin account already exists");
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
