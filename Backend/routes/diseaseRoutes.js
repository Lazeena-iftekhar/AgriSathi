const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios"); // Add axios for making requests to Flask
const FormData = require("form-data"); // For sending multipart data

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/detect-disease", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Create FormData to send to Flask service
    const formData = new FormData();
    formData.append('image', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    // Make request to Flask service
    const flaskResponse = await axios.post(
      'http://localhost:5001/detect-disease', // Flask service URL
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 30000 // 30 second timeout for ML processing
      }
    );

    // Extract meaningful result from Flask response
    const flaskResult = flaskResponse.data;
    
    // Process the result to extract comprehensive information
    let processedResult = {
      status: "no_disease",
      message: "No disease detected",
      diseases: [],
      plant_info: null,
      is_healthy: true,
      confidence: 0
    };
    
    if (flaskResult && flaskResult.health_assessment) {
      const healthAssessment = flaskResult.health_assessment;
      const diseases = healthAssessment.diseases || [];
      const isHealthy = healthAssessment.is_healthy;
      
      if (diseases.length > 0) {
        // Sort diseases by probability (highest first)
        const sortedDiseases = diseases.sort((a, b) => b.probability - a.probability);
        
        processedResult = {
          status: "disease_detected",
          message: `${sortedDiseases[0].name} detected`,
          diseases: sortedDiseases.map(disease => ({
            name: disease.name,
            probability: Math.round(disease.probability * 100),
            description: disease.description || "No description available",
            treatment: disease.treatment || {},
            similar_images: disease.similar_images || []
          })),
          plant_info: flaskResult.plant_details || null,
          is_healthy: isHealthy,
          confidence: Math.round(sortedDiseases[0].probability * 100)
        };
      } else {
        processedResult = {
          status: "healthy",
          message: "Plant appears healthy",
          diseases: [],
          plant_info: flaskResult.plant_details || null,
          is_healthy: isHealthy.probability > 0.5,
          confidence: Math.round((isHealthy.probability || 0) * 100)
        };
      }
    } else if (flaskResult.error) {
      processedResult = {
        status: "error",
        message: "Error analyzing image",
        diseases: [],
        plant_info: null,
        is_healthy: false,
        confidence: 0
      };
    }

    res.json(processedResult);
    
  } catch (error) {
    console.error("Error processing image:", error.message);
    
    if (error.code === 'ECONNREFUSED') {
      res.status(503).json({ error: "ML service unavailable. Please ensure Flask service is running." });
    } else if (error.response) {
      res.status(500).json({ error: `ML service error: ${error.response.status}` });
    } else {
      res.status(500).json({ error: "Failed to process image" });
    }
  }
});

module.exports = router;