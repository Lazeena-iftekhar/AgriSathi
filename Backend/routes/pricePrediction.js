const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// POST API (async/await version)
router.post("/add-price", async (req, res) => {
  const { cropName, state } = req.body;

  if (!cropName || !state) {
    return res.status(400).json({ message: "Crop and state are required." });
  }

  try {
    // 🔍 Check if already exists
    const [existing] = await db.query(
      "SELECT * FROM crop_prices WHERE crop_name = ? AND state = ?",
      [cropName, state]
    );

    if (existing.length > 0) {
      return res.json({
        message: "Already exists",
        duplicate: true,
        existingData: existing[0],
      });
    }

    // 🔥 Call ML API
    // 🔥 Call ML API
const mlResponse = await fetch("http://127.0.0.1:5001/predict-price", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ cropName, state }),
});

const mlData = await mlResponse.json();

console.log("Flask Response:", mlData);

// 🚨 STOP if prediction failed
if (!mlResponse.ok || !mlData.predicted_price) {
  return res.status(400).json({
    message: "ML prediction failed",
    error: mlData.error || "Unknown ML error"
  });
}

const predictedPrice = mlData.predicted_price;
    
    // Insert new row
    await db.query(
      "INSERT INTO crop_prices (crop_name, price, state) VALUES (?, ?, ?)",
      [cropName, predictedPrice, state]
    );

    res.json({
      message: "Prediction successful",
      duplicate: false,
      predicted_price: predictedPrice,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Prediction failed." });
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
