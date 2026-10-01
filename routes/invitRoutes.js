const express = require("express");

const {
  getInvits,
  getInvitById,
  createInvit
} = require("../controllers/invitController");

const router = express.Router();

// GET all InvITs
router.get("/", getInvits);

// GET single InvIT
router.get("/:id", getInvitById);

// CREATE new InvIT
router.post("/", createInvit);

module.exports = router;