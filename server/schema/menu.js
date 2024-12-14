const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  price: {
    type: "number",
    required: true,
  },
  description: {
    type: "string",
  },
  category: {
    type: "string",
    required: true,
    enum: ["Others", "Drinks", "Starters", "Main", "Desserts"],
    default: "Others",
  },
  image: {
    type: "string",
  },
});

module.exports = new mongoose.model("Menu", menuSchema);
