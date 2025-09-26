const mongoose = require("mongoose");

const crimeSchema = new mongoose.Schema(
  {
    // Reference to User model (One-to-Many relationship)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    kyaHua: {
      type: String,
      trim: true,
    },
    doshiNaam: {
      type: String,
      trim: true,
    },
    doshiUmar: {
      type: Number,
    },
    doshiGender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    doshiPehchan: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Crime = mongoose.model("Crime", crimeSchema);
module.exports = Crime;
