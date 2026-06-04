const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed."), false);
    }

    cb(null, true);
  }
});

function verifyMagicBytes(buffer) {
  if (buffer.length < 4) return false;

  const hex = buffer.toString("hex", 0, 4).toUpperCase();

  return (
    hex.startsWith("FFD8FF") ||
    hex.startsWith("89504E47")
  );
}

router.post(
  "/crop-prediction",
  upload.single("image"),

  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "No image uploaded"
        });
      }

      if (!verifyMagicBytes(req.file.buffer)) {
        return res.status(422).json({
          error: "Invalid image format detected"
        });
      }

      const state = req.body.state;

      if (!state || state.trim() === "") {
        return res.status(400).json({
          error: "State is required"
        });
      }

      const formData = new FormData();

      formData.append("image", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      formData.append("state", state.trim());
      console.log("Calling Flask Predict...");
      const flaskResponse = await axios.post(
        "https://agrisathiml.onrender.com/predict",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          timeout: 120000,
        }
      );
      console.log("Flask Response Received");

      return res.status(200).json(flaskResponse.data);

    } catch (err) {
      console.error("Crop Prediction Error:", err.message);
      console.log(err.code);
      console.log(err.response?.data);

      if (err.code === "ECONNREFUSED") {
        return res.status(503).json({
          error: "AI server offline"
        });
      }

      if (err.response) {
        return res.status(err.response.status).json({
          error: err.response.data.error || "Prediction failed",
          message: err.response.data.message || ""
        });
      }

      return res.status(500).json({
        error: "Internal server error"
      });
    }
  }
);

module.exports = router;
