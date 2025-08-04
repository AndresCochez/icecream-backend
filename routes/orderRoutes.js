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

// PATCH status van bestelling aanpassen
router.patch("/:id", async (req, res) => {
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

// DELETE bestelling verwijderen
router.delete("/:id", async (req, res) => {
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
