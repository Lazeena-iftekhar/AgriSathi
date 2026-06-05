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


const formData = new FormData();

formData.append("image", req.file.buffer, {
  filename: req.file.originalname,
  contentType: req.file.mimetype,
});

const flaskResponse = await axios.post(
  " https://largest-scene-dirt-dad.trycloudflare.com/detect-disease",
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
    const sortedDiseases = diseases.sort(
      (a, b) => b.probability - a.probability
    );

    const topDisease = sortedDiseases[0];
    const topConfidence = topDisease.probability || 0;

    if (topConfidence > 0.5) {
      let additionalAdvice = [];

      if (topConfidence > 0.75) {
        additionalAdvice.push(
          "High infection risk. Immediate treatment required."
        );
      } else if (topConfidence > 0.5) {
        additionalAdvice.push(
          "Moderate infection. Monitor closely."
        );
      }

      const name = topDisease.name.toLowerCase();

      if (name.includes("fung") || name.includes("rust")) {
        additionalAdvice.push("Avoid overhead watering.");
        additionalAdvice.push("Apply fungicide spray.");
      }

      if (name.includes("bacter")) {
        additionalAdvice.push("Remove infected leaves.");
        additionalAdvice.push("Use copper-based bactericide.");
      }

      additionalAdvice.push("Maintain proper plant spacing.");
      additionalAdvice.push("Disinfect gardening tools.");

      processedResult = {
        status: "disease_detected",
        message: `${topDisease.name} detected`,
        diseases: sortedDiseases.map((disease) => {
          const key = disease.name.toLowerCase();

          return {
            name: disease.name,
            probability: Math.round(
              (disease.probability || 0) * 100
            ),
            description: disease.description
              ? disease.description
              : diseaseInfo[key] ||
                `No detailed info available for ${disease.name}`,
            treatment: disease.treatment || {},
            similar_images: disease.similar_images || [],
          };
        }),
        plant_info: flaskResult.plant_details || null,
        is_healthy: false,
        confidence: Math.round(topConfidence * 100),
        additional_advice: additionalAdvice,
      };
    } else {
      processedResult = {
        status: "healthy",
        message: "Plant appears healthy",
        diseases: [],
        plant_info: flaskResult.plant_details || null,
        is_healthy: true,
        confidence: Math.round(healthyProbability * 100),
        additional_advice: [],
      };
    }
  } else {
    processedResult = {
      status: "healthy",
      message: "Plant appears healthy",
      diseases: [],
      plant_info: flaskResult.plant_details || null,
      is_healthy: healthyProbability > 0.5,
      confidence: Math.round(healthyProbability * 100),
      additional_advice: [],
    };
  }
}

return res.json(processedResult);


} catch (error) {
  console.error("Error processing image:", error.message);

  if (error.response) {
    console.log("STATUS:", error.response.status);
    console.log("DATA:", error.response.data);

    return res.status(error.response.status).json(error.response.data);
  }

  return res.status(500).json({
    error: "Failed to process image",
  });
}
});

module.exports = router;
