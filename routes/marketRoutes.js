const express = require("express");

const {
  getLiveReitPrice,
  getLiveReitPrices,
  getLiveInvitPrice,
  getLiveInvitPrices
} = require("../controllers/marketController");

const router = express.Router();

// ================================
// REIT MARKET ROUTES
// ================================

// Multiple REIT quotes
router.get("/quotes", getLiveReitPrices);

// Single REIT quote
router.get("/quote/:symbol", getLiveReitPrice);


// ================================
// INVIT MARKET ROUTES
// ================================

// Multiple InvIT quotes
// IMPORTANT: Keep this BEFORE /invit/quote/:symbol
router.get(
  "/invit/quotes",
  getLiveInvitPrices
);

// Single InvIT quote
router.get(
  "/invit/quote/:symbol",
  getLiveInvitPrice
);


module.exports = router;