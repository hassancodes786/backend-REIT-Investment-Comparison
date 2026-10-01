const express = require("express");

const {
  createInvestment,
  getAllInvestments,
  getInvestmentById,
  updateInvestmentStatus,
  deleteInvestment
} = require("../controllers/investmentController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// =========================
// CREATE INVESTMENT
// =========================

router.post(
  "/",
  authMiddleware,
  createInvestment
);


// =========================
// GET INVESTMENTS
// =========================

// Admin → all investments
// User → only own investments

router.get(
  "/",
  authMiddleware,
  getAllInvestments
);


// =========================
// GET SINGLE INVESTMENT
// =========================

router.get(
  "/:id",
  authMiddleware,
  getInvestmentById
);


// =========================
// UPDATE STATUS
// =========================

// Admin only

router.put(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateInvestmentStatus
);


// =========================
// DELETE INVESTMENT
// =========================

// Logged-in user can delete
// only their own investment.
// Admin can delete investments too.

router.delete(
  "/:id",
  authMiddleware,
  deleteInvestment
);


module.exports = router;