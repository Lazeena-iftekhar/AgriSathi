const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

// Store images in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST endpoint to receive image and forward to Flask AI model
router.post("/crop-prediction", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Create FormData to send to Flask API
    const formData = new FormData();
    formData.append('image', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Send image to Flask AI model
    const flaskResponse = await axios.post(
      'http://localhost:5001/predict', // Flask server URL
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 30000, // 30 seconds timeout
      }
    );

    // Return the prediction result
    res.json({ 
      result: flaskResponse.data.result,
      confidence: flaskResponse.data.confidence || null
    });

  } catch (err) {
    console.error("Error processing image:", err);
    
    if (err.code === 'ECONNREFUSED') {
      res.status(503).json({ error: "AI model service is unavailable" });
    } else if (err.response) {
      res.status(err.response.status).json({ 
        error: err.response.data.error || "Failed to process image" 
      });
    } else {
      res.status(500).json({ error: "Failed to process image" });
    }
  }
});

module.exports = router;