const express = require("express");

const {
  signup,
  login
} = require("../controllers/authController");


const router = express.Router();


// =====================================
// SIGNUP
// POST /api/auth/signup
// =====================================

router.post(
  "/signup",
  signup
);


// =====================================
// LOGIN
// POST /api/auth/login
// =====================================

router.post(
  "/login",
  login
);


module.exports = router;