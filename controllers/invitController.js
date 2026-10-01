const Invit = require("../models/Invit");

// GET all InvITs
const getInvits = async (req, res) => {
  try {
    const invits = await Invit.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: invits.length,
      data: invits
    });
  } catch (error) {
    console.error("Error fetching InvITs:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch InvITs",
      error: error.message
    });
  }
};

// GET single InvIT by ID
const getInvitById = async (req, res) => {
  try {
    const invit = await Invit.findById(req.params.id);

    if (!invit) {
      return res.status(404).json({
        success: false,
        message: "InvIT not found"
      });
    }

    res.status(200).json({
      success: true,
      data: invit
    });
  } catch (error) {
    console.error("Error fetching InvIT:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch InvIT",
      error: error.message
    });
  }
};

// CREATE new InvIT
const createInvit = async (req, res) => {
  try {
    const invit = await Invit.create(req.body);

    res.status(201).json({
      success: true,
      message: "InvIT created successfully",
      data: invit
    });
  } catch (error) {
    console.error("Error creating InvIT:", error);

    res.status(400).json({
      success: false,
      message: "Failed to create InvIT",
      error: error.message
    });
  }
};

module.exports = {
  getInvits,
  getInvitById,
  createInvit
};