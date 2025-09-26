// models/Narak.js
const mongoose = require("mongoose");
const GarudPuranSchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
    description: String,
    image: String,
  }
  // 👈 collection ka naam fix kar diya
);

const GarudPuran = new mongoose.model("Garudpuran", GarudPuranSchema);
module.exports = GarudPuran;
