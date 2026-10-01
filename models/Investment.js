const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true
    },

    user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
},

    investorName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    amount: {
      type: Number,
      required: true,
      min: 1
    },

    message: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: [
        "Interest Submitted",
        "Under Review",
        "Approved",
        "Rejected",
        "Completed"
      ],
      default: "Interest Submitted"
    }
  },
  {
    timestamps: true
  }
);

const Investment = mongoose.model(
  "Investment",
  investmentSchema
);

module.exports = Investment;