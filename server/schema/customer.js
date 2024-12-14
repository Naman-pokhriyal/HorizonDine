const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  fname: {
    type: "string",
    required: true,
  },
  lname: {
    type: "string",
    required: true,
  },
  phone: {
    type: "number",
    required: true,
  },
});
module.exports = new mongoose.model("Customer", customerSchema);
