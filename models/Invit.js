const mongoose = require("mongoose");

const invitSchema = new mongoose.Schema(
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
        "Power Transmission",
        "Roads",
        "Renewable Energy",
        "Telecom",
        "Transport",
        "Diversified"
      ]
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    marketCap: {
      type: Number,
      default: null
    },

    distributionYield: {
      type: Number,
      default: null
    },

    annualDistribution: {
      type: Number,
      default: null
    },

    nav: {
      type: Number,
      default: null
    },

    assetValue: {
      type: Number,
      default: null
    },

    aum: {
      type: Number,
      default: null
    },

    debt: {
      type: Number,
      default: null
    },

    return1Y: {
      type: Number,
      default: null
    },

    return3Y: {
      type: Number,
      default: null
    },

    return5Y: {
      type: Number,
      default: null
    },

    volatility: {
      type: Number,
      default: null
    },

    riskScore: {
      type: Number,
      default: null
    },

    description: {
      type: String,
      default: ""
    },

    assets: [
      {
        name: { type: String, default: "" },
        type: { type: String, default: "" },
        location: { type: String, default: "" }
      }
    ],

    performance: [
      {
        year: String,
        return: Number,
        distribution: Number
      }
    ]
  },
  {
    timestamps: true
  }
);

const Invit = mongoose.model("Invit", invitSchema);

module.exports = Invit;