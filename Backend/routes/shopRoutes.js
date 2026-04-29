const express = require("express");
const axios = require("axios");

const router = express.Router();
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km

  const toRad = (value) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *   // ✅ FIXED
    Math.cos(toRad(lat2)) *   // ✅ FIXED
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
router.get("/shops", 

async (req, res) => {
  try {
    const { location, type } = req.query;

    // 🔍 Step 1: Geocode
    const geoRes = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: location,
          key: process.env.GOOGLE_API_KEY,
        },
      }
    );

    console.log("Geocode:", geoRes.data); // 👈 DEBUG

    if (
      !geoRes.data ||
      geoRes.data.status !== "OK" ||
      !geoRes.data.results ||
      geoRes.data.results.length === 0
    ) {
      return res.status(400).json({ message: "Invalid location" });
    }

    const coords = geoRes.data.results[0].geometry.location;

    // 🔍 Step 2: Places API
    const placesRes = await axios.get(
      "https://maps.googleapis.com/maps/api/place/textsearch/json",
      {
        params: {
          query: type,
          location: `${coords.lat},${coords.lng}`,
          radius: 3000,
          key: process.env.GOOGLE_API_KEY,
        },
      }
    );

    console.log("Places:", placesRes.data); // 👈 DEBUG

    if (placesRes.data.status !== "OK") {
      return res.status(400).json({
        message: "Places API error",
        status: placesRes.data.status,
      });
    }

const userLat = coords.lat;
const userLng = coords.lng;

// ✅ Step 1: Add distance
let filteredShops = placesRes.data.results
  .map((shop) => {
    if (!shop.geometry || !shop.geometry.location) return null;

    const shopLat = shop.geometry.location.lat;
    const shopLng = shop.geometry.location.lng;

    const distance = getDistance(userLat, userLng, shopLat, shopLng);

    return {
      ...shop,
      distance,
    };
  })
  .filter((shop) => shop && shop.distance <= 3); // ✅ remove null + filter

// ✅ Step 2: sort by nearest
filteredShops.sort((a, b) => {
  const d1 = getDistance(
    userLat,
    userLng,
    a.geometry.location.lat,
    a.geometry.location.lng
  );
  const d2 = getDistance(
    userLat,
    userLng,
    b.geometry.location.lat,
    b.geometry.location.lng
  );
  return d1 - d2;
});

// ✅ Step 3: send response
res.json(filteredShops);

  } catch (error) {
    console.error("FULL ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "Server error" });
  }
}
);



module.exports = router;