const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const diseaseInfo = {
  pseudoperonospora: "A fungal-like pathogen causing downy mildew in plants.",
  pucciniales: "A group of fungi causing rust diseases in crops.",
  bacteria: "Bacterial infections that can cause leaf spots and wilting."
};

router.post("/detect-disease", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Prepare form data for Flask
    const formData = new FormData();
    formData.append("image", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Call Flask ML service
    const flaskResponse = await axios.post(
      "http://localhost:5001/detect-disease",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 30000,
      }
    );

    const flaskResult = flaskResponse.data;

    let processedResult = {
      status: "healthy",
      message: "Plant appears healthy",
      diseases: [],
      plant_info: null,
      is_healthy: true,
      confidence: 0,
    };

    if (flaskResult && flaskResult.health_assessment) {
      const healthAssessment = flaskResult.health_assessment;
      const diseases = healthAssessment.diseases || [];
      const isHealthy = healthAssessment.is_healthy || {};
      const healthyProbability = isHealthy.probability || 0;

      if (diseases.length > 0) {
        // Sort diseases by probability
        const sortedDiseases = diseases.sort(
          (a, b) => b.probability - a.probability
        );

        const topDisease = sortedDiseases[0];
        const topConfidence = topDisease.probability || 0;

        // ✅ Only treat as disease if confidence > 50%
        if (topConfidence > 0.5) {

            let additionalAdvice = [];

            if (topConfidence > 0.75) {
              additionalAdvice.push("High infection risk. Immediate treatment required.");
            } else if (topConfidence > 0.5) {
              additionalAdvice.push("Moderate infection. Monitor closely.");
            }

            // Disease type logic
            const name = topDisease.name.toLowerCase();

            if (name.includes("fung") || name.includes("rust")) {
              additionalAdvice.push("Avoid overhead watering.");
              additionalAdvice.push("Apply fungicide spray.");
            }

            if (name.includes("bacter")) {
              additionalAdvice.push("Remove infected leaves.");
              additionalAdvice.push("Use copper-based bactericide.");
            }

            // General care
            additionalAdvice.push("Maintain proper plant spacing.");
            additionalAdvice.push("Disinfect gardening tools.");

      

            processedResult = {
              status: "disease_detected",
              message: `${topDisease.name} detected`,
              diseases: sortedDiseases.map((disease) => {
                const key = disease.name.toLowerCase();
                return {
                  name: disease.name,
                  probability: Math.round((disease.probability || 0) * 100),
                  description: disease.description
                    ? disease.description
                    : diseaseInfo[key] || `No detailed info available for ${disease.name}`,
                  treatment: disease.treatment || {},
                  similar_images: disease.similar_images || [],
                };
              }),
              plant_info: flaskResult.plant_details || null,
              is_healthy: false,
              confidence: Math.round(topConfidence * 100),
              additional_advice: additionalAdvice, // ✅ FIXED
            };
        } else {
          // ✅ Low confidence = treat as healthy
          processedResult = {
            status: "healthy",
            message: "Plant appears healthy",
            diseases: [],
            plant_info: flaskResult.plant_details || null,
            is_healthy: true,
            confidence: Math.round(healthyProbability * 100),
            additional_advice: [], // 🚫 No advice when healthy
          };
        }
      } else {
        // No diseases returned
        processedResult = {
          status: "healthy",
          message: "Plant appears healthy",
          diseases: [],
          plant_info: flaskResult.plant_details || null,
          is_healthy: healthyProbability > 0.5,
          confidence: Math.round(healthyProbability * 100),
          additional_advice: [], // 🚫 No advice when healthy
        };
      }
    } else if (flaskResult.error) {
      processedResult = {
        status: "error",
        message: "Error analyzing image",
        diseases: [],
        plant_info: null,
        is_healthy: false,
        confidence: 0,
      };
    }

    res.json(processedResult);
  } catch (error) {
    console.error("Error processing image:", error.message);

    if (error.code === "ECONNREFUSED") {
      res.status(503).json({
        error:
          "ML service unavailable. Please ensure Flask service is running.",
      });
    } else if (error.response) {
      res
        .status(500)
        .json({ error: `ML service error: ${error.response.status}` });
    } else {
      res.status(500).json({ error: "Failed to process image" });
    }
  }
});

module.exports = router;