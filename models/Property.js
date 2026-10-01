const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    city: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      required: true,
      enum: [
        "Residential",
        "Commercial",
        "Retail",
        "Industrial"
      ]
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    area: {
      type: Number,
      required: true,
      min: 0
    },

    bedrooms: {
      type: Number,
      default: 0
    },

    bathrooms: {
      type: Number,
      default: 0
    },

    rentalYield: {
      type: Number,
      default: 0
    },

    appreciation: {
      type: Number,
      default: 0
    },

    occupancy: {
      type: Number,
      default: 0
    },

    developer: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: [
        "Available",
        "Ready to Invest",
        "Sold",
        "Under Review"
      ],
      default: "Available"
    },

    description: {
      type: String,
      default: ""
    },

    amenities: {
      type: [String],
      default: []
    },

    image: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Property = mongoose.model(
  "Property",
  propertySchema
);

module.exports = Property;