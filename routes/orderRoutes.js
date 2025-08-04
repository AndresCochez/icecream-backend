const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");
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

// GET bestelling per ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Bestelling niet gevonden." });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Fout bij ophalen bestelling", error });
  }
});

// PATCH status aanpassen (admin only)
router.patch("/:id", protect, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["te verwerken", "verzonden", "geannuleerd"].includes(status)) {
      return res.status(400).json({ message: "Ongeldige status." });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Bestelling niet gevonden." });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Fout bij aanpassen status", error });
  }
});

// DELETE bestelling verwijderen (admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Bestelling niet gevonden." });
    }
    res.json({ message: "Bestelling succesvol verwijderd." });
  } catch (error) {
    res.status(500).json({ message: "Fout bij verwijderen bestelling", error });
  }
});

module.exports = router;
