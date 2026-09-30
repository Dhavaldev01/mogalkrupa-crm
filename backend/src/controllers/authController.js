const User = require("../models/User");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "default_secret_key",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id);

  res.cookie("token", token, {
    ...getCookieOptions(),
    maxAge:
      parseInt(process.env.JWT_COOKIE_EXPIRES_IN || "7", 10) *
      24 *
      60 *
      60 *
      1000,
  });

  res.status(statusCode).json({
    success: true,
    message,
    data: user,
  });
};

/* =========================
   REGISTER
========================= */

exports.register = async (req, res) => {
  try {
    const { email, mobile, password } = req.body;

    if (!email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email, mobile number, and password",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailExists = await User.findOne({
      email: normalizedEmail,
    });

    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const mobileExists = await User.findOne({ mobile });

    if (mobileExists) {
      return res.status(409).json({
        success: false,
        message: "Mobile number already exists",
      });
    }

    const user = await User.create({
      email: normalizedEmail,
      mobile,
      password,
      role: "admin",
    });

    createSendToken(
      user,
      201,
      res,
      "Registration successful"
    );
  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =========================
   LOGIN
========================= */

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is inactive",
      });
    }

    user.lastLogin = new Date();

    await user.save({
      validateBeforeSave: false,
    });

    // Do not expose password
    user.password = undefined;

    createSendToken(
      user,
      200,
      res,
      "Logged in successfully"
    );
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =========================
   LOGOUT
========================= */

exports.logout = (req, res) => {
  res.clearCookie("token", getCookieOptions());

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

/* =========================
   CURRENT USER
========================= */

exports.getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
};