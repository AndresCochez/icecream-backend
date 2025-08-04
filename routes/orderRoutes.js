const express = require("express");
const Order = require("../models/Order");
const router = express.Router();

// POST nieuwe bestelling
router.post("/", async (req, res) => {
  try {
    const { customerName, address, flavor, topping } = req.body;
    if (!customerName || !address || !flavor || !topping) {
      return res.status(400).json({ message: "Alle velden zijn verplicht." });
    }

    const newOrder = new Order({ customerName, address, flavor, topping });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Fout bij aanmaken bestelling", error });
  }
});

// GET alle bestellingen
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Fout bij ophalen bestellingen", error });
  }
});

module.exports = router;
