const Property = require("../models/Property");


// GET ALL PROPERTIES
const getAllProperties = async (req, res) => {
  try {

    const properties = await Property.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
      error: error.message
    });

  }
};


// GET SINGLE PROPERTY
const getPropertyById = async (req, res) => {
  try {

    const property =
      await Property.findById(
        req.params.id
      );

    if (!property) {

      return res.status(404).json({
        success: false,
        message: "Property not found"
      });

    }

    res.status(200).json({
      success: true,
      data: property
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch property",
      error: error.message
    });

  }
};


// CREATE PROPERTY
const createProperty = async (req, res) => {
  try {

    const property =
      await Property.create(
        req.body
      );

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: "Failed to create property",
      error: error.message
    });

  }
};


// UPDATE PROPERTY
const updateProperty = async (req, res) => {
  try {

    const property =
      await Property.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

    if (!property) {

      return res.status(404).json({
        success: false,
        message: "Property not found"
      });

    }

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: property
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: "Failed to update property",
      error: error.message
    });

  }
};


// DELETE PROPERTY
const deleteProperty = async (req, res) => {
  try {

    const property =
      await Property.findByIdAndDelete(
        req.params.id
      );

    if (!property) {

      return res.status(404).json({
        success: false,
        message: "Property not found"
      });

    }

    res.status(200).json({
      success: true,
      message: "Property deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to delete property",
      error: error.message
    });

  }
};


module.exports = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
};