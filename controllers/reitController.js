const Reit = require("../models/Reit");


// GET ALL REITS
const getAllReits = async (req, res) => {
  try {

    const reits = await Reit.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reits.length,
      data: reits
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch REITs",
      error: error.message
    });

  }
};


// GET SINGLE REIT
const getReitById = async (req, res) => {
  try {

    const reit = await Reit.findById(
      req.params.id
    );

    if (!reit) {

      return res.status(404).json({
        success: false,
        message: "REIT not found"
      });

    }

    res.status(200).json({
      success: true,
      data: reit
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch REIT",
      error: error.message
    });

  }
};


// CREATE REIT
const createReit = async (req, res) => {
  try {

    const reit = await Reit.create(
      req.body
    );

    res.status(201).json({
      success: true,
      message: "REIT created successfully",
      data: reit
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: "Failed to create REIT",
      error: error.message
    });

  }
};


// UPDATE REIT
const updateReit = async (req, res) => {
  try {

    const reit =
      await Reit.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

    if (!reit) {

      return res.status(404).json({
        success: false,
        message: "REIT not found"
      });

    }

    res.status(200).json({
      success: true,
      message: "REIT updated successfully",
      data: reit
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: "Failed to update REIT",
      error: error.message
    });

  }
};


// DELETE REIT
const deleteReit = async (req, res) => {
  try {

    const reit =
      await Reit.findByIdAndDelete(
        req.params.id
      );

    if (!reit) {

      return res.status(404).json({
        success: false,
        message: "REIT not found"
      });

    }

    res.status(200).json({
      success: true,
      message: "REIT deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to delete REIT",
      error: error.message
    });

  }
};


module.exports = {
  getAllReits,
  getReitById,
  createReit,
  updateReit,
  deleteReit
};