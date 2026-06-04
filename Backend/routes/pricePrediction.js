const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const fetch = require("node-fetch");

router.post("/add-price", async (req, res) => {
  const { cropName, state, district, market } = req.body;

  if (!cropName || !state || cropName.trim() === "" || state.trim() === "") {
    return res.status(400).json({ error: "Crop name and State are mandatory parameters." });
  }

  try {
    const finalDistrict = district && district.trim() !== "" ? district.trim() : "Unknown";
    const finalMarket = market && market.trim() !== "" ? market.trim() : "Unknown";
    const finalCrop = cropName.trim();
    const finalState = state.trim();

    const [existing] = await db.query(
      "SELECT * FROM crop_prices WHERE crop_name = ? AND state = ? AND district = ? AND market = ?",
      [finalCrop, finalState, finalDistrict, finalMarket]
    );

    if (existing.length > 0) {
      return res.json({
        message: "Already exists",
        duplicate: true,
        existingData: existing[0],
      });
    }

    const mlResponse = await fetch(" https://cakes-finals-charm-tale.trycloudflare.com /predict-price", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cropName: finalCrop,
        state: finalState,
        district: finalDistrict,
        market: finalMarket,
      }),
    });

    const mlData = await mlResponse.json();

    if (!mlResponse.ok) {
      return res.status(mlResponse.status).json({
        error: mlData.error || "ML engine calculation error models.",
      });
    }

    const predictedPrice = Math.max(0.0, parseFloat(mlData.predicted_price || 0));

    await db.query(
      "INSERT INTO crop_prices (crop_name, price, state, district, market) VALUES (?, ?, ?, ?, ?)",
      [finalCrop, predictedPrice, finalState, finalDistrict, finalMarket]
    );

    res.json({
      message: "Prediction successful",
      predicted_price: predictedPrice,
    });

  } catch (err) {
    console.error("🔥 ERROR in /add-price:", err);
    res.status(500).json({ error: "Downstream runtime core failure processing prediction." });
  }
});

router.get("/history", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT crop_name, price, state, district, market, created_at
      FROM crop_prices
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("🔥 HISTORY ERROR:", err);
    res.status(500).json({ error: "Failed to pull execution history logs from schema metadata." });
  }
});

router.delete("/history", async (req, res) => {
  try {
    await db.query("DELETE FROM crop_prices");
    res.json({ message: "History cleared successfully" });
  } catch (err) {
    console.error("Error clearing history:", err);
    res.status(500).json({ error: "Failed to clear history" });
  }
});

module.exports = router;