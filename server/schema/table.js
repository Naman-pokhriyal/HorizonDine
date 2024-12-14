const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    no: {
      type: Number,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["AVAILABLE", "OCCUPIED", "RESERVED", "CLEANING"],
      default: "AVAILABLE",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Table", tableSchema);
