const express = require("express");
require("dotenv").config();
// const db = require("./db/connection");
const cors = require('cors');
const multer = require("multer");
const app = express();
const bodyParser = require("body-parser")

const PORT = 5000;

app.use(cors());
app.use(express.json());



app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

const diseaseRoutes = require("./routes/diseaseRoutes");
const cropRoutes = require("./routes/cropPredictionRoutes");
const shopRoutes = require("./routes/shopRoutes");
const pricePredictionRoutes = require("./routes/pricePrediction");
// const paymentRoute = require("./routes/paymentRoute")

app.use("/api", diseaseRoutes);
app.use("/api", cropRoutes);
app.use("/api", shopRoutes);
app.use("/api/crops", pricePredictionRoutes); 
// app.use("/api/payment", paymentRoute)

app.post("/api/chat", async (req, res) => {
  try {
    const systemInstruction = {
      role: "user",
      parts: [
        {
          text: `
                  You are AgriSathi AI, an expert agriculture assistant for Indian farmers.
                  - Give practical farming advice.
                  - Keep answers simple and clear.
                  - If related to crops, soil, disease, or price prediction, explain step-by-step.
                  - If user uploads an image, analyze it properly.
                  - Use short paragraphs.
                  `
        }
      ]
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            systemInstruction,
            ...req.body.contents
          ]
        }),
      }
    );

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Gemini API failed" });
  }
});

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
