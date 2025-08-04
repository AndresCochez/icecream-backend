const express = require("express");
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Admin registreren (eenmalig gebruiken om eerste admin te maken)
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Gebruikersnaam en wachtwoord zijn verplicht." });
    }

    // check of admin al bestaat
    const bestaat = await Admin.findOne({ username });
    if (bestaat) {
      return res.status(400).json({ message: "Deze admin bestaat al." });
    }

    const newAdmin = new Admin({ username, password });
    await newAdmin.save();

    res.status(201).json({ message: "Admin succesvol aangemaakt." });
  } catch (error) {
    res.status(500).json({ message: "Fout bij registreren admin", error });
  }
});

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
