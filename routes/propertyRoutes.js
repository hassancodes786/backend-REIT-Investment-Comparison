const express = require("express");

const {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
} = require("../controllers/propertyController");

const router = express.Router();


// GET all properties
router.get("/", getAllProperties);


// GET single property
router.get("/:id", getPropertyById);


// CREATE property
router.post("/", createProperty);


// UPDATE property
router.put("/:id", updateProperty);


// DELETE property
router.delete("/:id", deleteProperty);


module.exports = router;