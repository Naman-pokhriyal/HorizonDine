const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    itemIDs: {
      type: [
        {
          itemID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu",
            required: true,
          },
          quantity: {
            type: Number,
            default: 1,
            min: 1,
          },
        },
      ],
      validate: {
        validator: function (value) {
          return value && value.length > 0;
        },
        message: "Order must contain at least one item",
      },
      required: true,
    },
    status: {
      type: String,
      enum: ["Placed", "Preparing", "Ready", "Payment", "Done"],
      required: true,
      default: "Placed",
    },
    tableID: {
      required: true,
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Table",
    },
    billID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Bill",
    },
    custID: {
      required: true,
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Customer",
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Orders", orderSchema);
