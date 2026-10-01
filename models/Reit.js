const mongoose = require("mongoose");

const reitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    ticker: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },

    sector: {
      type: String,
      required: true,
      enum: [
        "Office",
        "Retail",
        "Industrial",
        "Residential",
        "Healthcare",
        "Mixed"
      ]
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    marketCap: {
      type: Number,
      default: 0
    },

    dividendYield: {
      type: Number,
      default: 0
    },

    annualDistribution: {
      type: Number,
      default: 0
    },

    occupancy: {
      type: Number,
      default: 0
    },

    debt: {
      type: Number,
      default: 0
    },

    return1Y: {
      type: Number,
      default: 0
    },

    return3Y: {
      type: Number,
      default: 0
    },

    return5Y: {
      type: Number,
      default: 0
    },

    volatility: {
      type: Number,
      default: 0
    },

    riskScore: {
      type: Number,
      default: 0
    },

    description: {
      type: String,
      default: ""
    },

    performance: [
      {
        year: String,
        return: Number,
        dividend: Number
      }
    ]
  },
  {
    timestamps: true
  }
);

const Reit = mongoose.model("Reit", reitSchema);

module.exports = Reit;