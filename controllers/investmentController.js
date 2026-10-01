const Investment = require("../models/Investment");
const Property = require("../models/Property");


// =========================
// CREATE INVESTMENT
// =========================
const createInvestment = async (req, res) => {
  try {
    const {
      property,
      investorName,
      email,
      phone,
      amount,
      message
    } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const propertyExists = await Property.findById(property);

    if (!propertyExists) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Investment amount must be greater than 0"
      });
    }

    const investment = await Investment.create({
      property,
      user: req.user.id,
      investorName,
      email,
      phone,
      amount,
      message
    });

    const populatedInvestment =
      await Investment.findById(investment._id)
        .populate("property")
        .populate("user", "-password");

    res.status(201).json({
      success: true,
      message: "Investment request submitted successfully",
      data: populatedInvestment
    });

  } catch (error) {
    console.error("Investment Error:", error);

    res.status(400).json({
      success: false,
      message: "Failed to submit investment request",
      error: error.message
    });
  }
};


// =========================
// GET INVESTMENTS
// =========================
const getAllInvestments = async (req, res) => {
  try {

    let investments;

    // ADMIN → ALL INVESTMENTS
    if (req.user.role === "admin") {

      investments = await Investment.find()
        .populate("property")
        .populate("user", "-password")
        .sort({ createdAt: -1 });

    }

    // USER → ONLY HIS/HER INVESTMENTS
    else {

      investments = await Investment.find({
        user: req.user.id
      })
        .populate("property")
        .populate("user", "-password")
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: investments.length,
      data: investments
    });

  } catch (error) {

    console.error(
      "Get Investments Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch investments",
      error: error.message
    });
  }
};


// =========================
// GET INVESTMENT BY ID
// =========================
const getInvestmentById = async (req, res) => {
  try {

    const investment =
      await Investment.findById(req.params.id)
        .populate("property")
        .populate("user", "-password");

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: "Investment not found"
      });
    }

    // NORMAL USER CAN ONLY SEE HIS OWN INVESTMENT
    if (
      req.user.role !== "admin" &&
      investment.user &&
      investment.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to view this investment"
      });
    }

    res.status(200).json({
      success: true,
      data: investment
    });

  } catch (error) {

    console.error(
      "Get Investment Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch investment",
      error: error.message
    });
  }
};


// =========================
// UPDATE INVESTMENT STATUS
// =========================
const updateInvestmentStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const allowedStatuses = [
      "Interest Submitted",
      "Under Review",
      "Approved",
      "Rejected",
      "Completed"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid investment status"
      });
    }

    const investment =
      await Investment.findByIdAndUpdate(
        req.params.id,
        { status },
        {
          new: true,
          runValidators: true
        }
      )
        .populate("property")
        .populate("user", "-password");

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: "Investment not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Investment status updated",
      data: investment
    });

  } catch (error) {

    console.error(
      "Update Investment Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update investment status",
      error: error.message
    });
  }
};


// =========================
// DELETE INVESTMENT
// =========================
const deleteInvestment = async (req, res) => {
  try {

    // FIND INVESTMENT
    const investment =
      await Investment.findById(req.params.id);

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: "Investment not found"
      });
    }

    // NORMAL USER CAN DELETE ONLY HIS/HER INVESTMENT
    if (
      req.user.role !== "admin" &&
      investment.user &&
      investment.user.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to delete this investment"
      });
    }

    // DELETE FROM MONGODB
    await Investment.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Investment deleted successfully"
    });

  } catch (error) {

    console.error(
      "Delete Investment Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete investment",
      error: error.message
    });
  }
};


// =========================
// EXPORT
// =========================
module.exports = {
  createInvestment,
  getAllInvestments,
  getInvestmentById,
  updateInvestmentStatus,
  deleteInvestment
};