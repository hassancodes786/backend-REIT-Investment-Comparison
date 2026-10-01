const express = require("express");

const {
  getAllReits,
  getReitById,
  createReit,
  updateReit,
  deleteReit
} = require("../controllers/reitController");

const router = express.Router();


// GET all REITs
router.get("/", getAllReits);


// GET single REIT
router.get("/:id", getReitById);


// CREATE REIT
router.post("/", createReit);


// UPDATE REIT
router.put("/:id", updateReit);


// DELETE REIT
router.delete("/:id", deleteReit);


module.exports = router;