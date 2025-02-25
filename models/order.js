const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    mobileNum: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    product: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Shipped", "Delivered"],
    },
    orderStatus: {
      type: String,
      default: "Delivery",
      enum: ["Delivery", "Returned", "Exchange"],
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
