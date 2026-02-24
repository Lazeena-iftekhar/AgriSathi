const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// POST API (async/await version)
router.post("/add-price", async (req, res) => {
  const { cropName, price, state } = req.body;

  if (!cropName || !price || !state) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const priceNum = Number(price);
  if (isNaN(priceNum) || priceNum <= 0) {
    return res.status(400).json({ message: "Price must be a positive number." });
  }

  const query = `INSERT INTO crop_prices (crop_name, price, state) VALUES (?, ?, ?)`;

  try {
    await db.query(query, [cropName, priceNum, state]);
    res.status(201).json({ message: "Price added successfully!" });
  } catch (err) {
    console.error("DB Insert Error:", err);
    res.status(500).json({ message: "Database insert failed." });
  }
});

// GET API (already correct)
router.get("/all-prices", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM crop_prices ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching prices:", err);
    res.status(500).json({ error: "Failed to fetch prices" });
  }
});

module.exports = router;
