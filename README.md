🌾 Krishi Sathi – Empowering Farmers with AI & Technology

🎯 About
Krishi Sathi bridges the gap between traditional farming and modern technology, providing Indian farmers with AI-powered tools for smarter agricultural decisions.
Live Demo:- (https://www.youtube.com/watch?v=9OSl-3ICMC0)
Key Benefits:
🤖 AI-Powered Insights - Price prediction and crop recommendations
🛒 Easy Market Access - Direct marketplace for produce listing
🌱 Smart Agriculture - Disease detection and soil analysis
🏛️ Government Integration - Access to subsidies (upcoming)

✨ Features
🔹 AI Solutions
🧠 Price Prediction - Market forecasting using ML algorithms
🤖 Smart Chatbot - Agricultural guidance and support
🌱 Crop Recommendation - Soil-based crop suggestions
🦠 Disease Detection - Image-based crop disease identification (50+ diseases)
🛒 Marketplace
Product listing with real-time updates
State-wise pricing information
Dynamic product tables with search/filter
Responsive design for all devices
📊 Dashboard
Interactive data visualization
Price trend analysis
Regional market insights
User-friendly interface

🛠️ Tech Stack
Frontend: React.js, HTML5, CSS3, Bootstrap, Axios,javascript
 Backend: Node.js, Express.js, Python
 Database: MySQL, XAMPP
 AI/ML: Machine Learning Models, TenserFlow, NLP

🚀 Quick Start
Prerequisites
Node.js (v16+), Python (v3.8+), MySQL, Git
Installation
Clone & Setup

 git clone https://github.com/your-username/krishi-sathi.git
cd krishi-sathi

Run Application

 # Terminal 1: Backend
-cd backend
-npm install
-node server.js

# Terminal 2: Python Server

-cd backend 
-pip install requirement.txt
-python server.py

# Terminal 3: Frontend
-cd Frontend/Krishi-Sathi 
- npm run dev

Environment Config

 # backend/.env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=Farmers
DB_TABLE =   

create database farmers ;
USE farmers;

CREATE TABLE crop_prices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  crop_name VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE marketplace (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  state VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Access: Frontend (http://localhost:3000) | Backend (http://localhost:5000) | python (http://localhost:5001)



📊 Version History
🏷️ Version 1.0.0 (Current)
✅ Available: AI price prediction, Disease detection (50+ diseases), Crop recommendation, Marketplace, Chatbot
🚀 Version 2.0.0  🆕 Coming: Multi-language support, Disease cure recommendations, Enhanced chatbot, Government subsidy portal, User authentication



About AI models
Crop prediction
This model classifies soil images into various soil types using image-based features.
It was trained on a curated dataset of labeled soil images to learn textural and color patterns using tensorflow and keras.
The model is designed to assist farmers and researchers in identifying soil types visually.
Crop disease
This model detects plant diseases from leaf images by identifying visible symptoms.
It helps farmers quickly diagnose issues like blight, rust, or mildew using a photo.
The training was done on a large labeled dataset of diseased and healthy plant leaves using tensorflow and with Keras for Convolutional Neural Network.
3.Price Prediction

Price Prediction: Based on historical dataset or hardcoded values with future scope for ML model integration


