import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    crop: 0,
    disease: 0,
    price: 0,
    farmers: 0,
  });

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 500;

      setCounts({
        crop: Math.min(i, 50000),
        disease: Math.min(i, 30000),
        price: Math.min(i, 20000),
        farmers: Math.min(i, 10000),
      });

      if (i >= 50000) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-dashboard">

      {/* HEADER */}
      <div className="home-header center fade-in">
        <h1>Good Evening, Farmer 🌾</h1>
        <h5>Smart agriculture solutions for better farming.</h5>
        <div className="location-text">📍 Lucknow, India</div>
      </div>

      {/* WEATHER */}
      <div className="weather-card fade-in">
        🌤 Warm weather expected. Ideal for irrigation & monitoring.
      </div>

      {/* STATS */}
      <div className="stats-row single-row fade-in">
        <div className="stat-box">
          <h2>{counts.crop / 1000}K+</h2>
          <p>Crop Predictions</p>
        </div>

        <div className="stat-box">
          <h2>{counts.disease / 1000}K+</h2>
          <p>Disease Detection</p>
        </div>

        <div className="stat-box">
          <h2>{counts.price / 1000}K+</h2>
          <p>Price Forecasts</p>
        </div>

        <div className="stat-box">
          <h2>{counts.farmers / 1000}K+</h2>
          <p>Farmers Helped</p>
        </div>
      </div>

      {/* SERVICES */}
      <h2 className="section-title">🌾 Our Services</h2>

      <div className="feature-grid">

        <div className="feature-card" onClick={() => navigate("/CropPrediction")}>
          <h3>📊 Crop Prediction</h3>
          <p>AI-based crop suggestions</p>
        </div>

        <div className="feature-card" onClick={() => navigate("/PricePridiction")}>
          <h3>💰 Price Prediction</h3>
          <p>Forecast market prices</p>
        </div>

        <div className="feature-card" onClick={() => navigate("/CropDisease")}>
          <h3>🦠 Disease Detection</h3>
          <p>Detect plant diseases</p>
        </div>

        <div className="feature-card" onClick={() => navigate("/Chatbot")}>
          <h3>🤖 AI Assistant</h3>
          <p>Ask farming queries</p>
        </div>

        <div className="feature-card" onClick={() => navigate("/ShopFinder")}>
          <h3>🏪 Shop Finder</h3>
          <p>Find nearby shops</p>
        </div>

        <div className="feature-card" onClick={() => navigate("/Government")}>
          <h3>🏛 Govt Schemes</h3>
          <p>Explore subsidies</p>
        </div>

      </div>

      {/* ABOUT */}
      <div className="about-section center fade-in">
        <h2>🌾 About AgriSathi</h2>
        <p>
          AgriSathi is an AI-powered agriculture platform built to transform the way farmers make decisions.
          It combines intelligent crop prediction, disease detection, and price forecasting into one seamless experience.
          Farmers can easily access government schemes, find nearby agricultural stores, and get real-time assistance
          through an AI chatbot in their regional language. With a focus on simplicity and impact, AgriSathi empowers
          farmers to increase productivity, reduce risks, and embrace modern, data-driven farming practices.
        </p>
      </div>

    </div>
  );
}

export default Home;