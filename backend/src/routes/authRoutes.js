const express = require("express");
const {
    login,
    logout,
    getMe,
    register,
} = require("../controllers/authController");

const { requireAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Logout
router.post("/logout", logout);

// Protected route
router.get("/me", requireAuth, getMe);

module.exports = router;