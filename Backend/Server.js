const express = require("express");
require("dotenv").config();
// const db = require("./db/connection");
const cors = require('cors');
const multer = require("multer");
const app = express();
const bodyParser = require("body-parser")
const PORT = 5000;


app.use(express.json());
app.use(cors());


app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

const diseaseRoutes = require("./routes/diseaseRoutes");
const cropRoutes = require("./routes/cropPredictionRoutes");
const marketplaceRoutes = require("./routes/marketplaceRoutes");
const pricePredictionRoutes = require("./routes/pricePrediction");
// const paymentRoute = require("./routes/paymentRoute")

app.use("/api", diseaseRoutes);
app.use("/api", cropRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/crops", pricePredictionRoutes); 
// app.use("/api/payment", paymentRoute)

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
