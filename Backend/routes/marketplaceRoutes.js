const express = require("express");
const router = express.Router();
const db = require("../db/connection"); 

// POST route 
router.post("/add-products", async (req, res) => {
  const { product, price, state } = req.body;
  if (!product || !price || !state) {
    return res.status(400).json({ message: "All fields are required." });
  }
  const query = "INSERT INTO marketplace (product, price, state) VALUES (?, ?, ?)";
  try {
    await db.query(query, [product, price, state]);
    res.status(201).json({ message: "Product added successfully!" });
  } catch (err) {
    console.error("DB Insert Error:", err);
    res.status(500).json({ message: "Database insert failed." });
  }
});
// GET route 
// router.get("/all-products", async (req, res) => {
//   try {
//     const [rows] = await db.query("SELECT * FROM marketplace");
//     res.json(rows);
//   } catch (err) {
//     console.error("Error fetching products:", err);
//     res.status(500).json({ error: "Failed to fetch products" });
//   }
// });
// GET /all-products?state=Delhi
// router.get("/all-products", async (req, res) => {
//   const { state } = req.query;
//   let query = "SELECT * FROM marketplace";
//   let params = [];

//   if (state && state !== "Select state") {
//     query += " WHERE state = ?";
//     params.push(state);
//   }

//   try {
//     const [rows] = await db.query(query, params);
//     res.json(rows);
//   } catch (err) {
//     console.error("Error fetching products:", err);
//     res.status(500).json({ error: "Failed to fetch products" });
//   }
// });
router.get("/all-products", async (req, res) => {
  const { state } = req.query;
  let query = "SELECT * FROM marketplace";
  let params = [];

  if (state && state !== "Select state") {
    query += " WHERE state = ?";
    params.push(state);
  }

  try {
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});


module.exports = router;