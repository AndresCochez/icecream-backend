const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  address: { type: String, required: true },
  flavor: { type: String, required: true },
  topping: { type: String, required: true },
  status: {
    type: String,
    enum: ["te verwerken", "verzonden", "geannuleerd"],
    default: "te verwerken"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
