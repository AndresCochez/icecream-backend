const express = require("express");
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Admin login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: "Ongeldige login gegevens." });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login mislukt", error });
  }
});

module.exports = router;
