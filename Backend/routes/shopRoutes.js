const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/shops", async (req, res) => {

  const { location, type } = req.query;

  const API_KEY = process.env.GOOGLE_API_KEY;

  try {

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json`,
      {
        params: {
          query: `${type} shop in ${location}`,
          key: API_KEY
        }
      }
    );

    res.json(response.data.results);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch shops" });
  }
});

module.exports = router;