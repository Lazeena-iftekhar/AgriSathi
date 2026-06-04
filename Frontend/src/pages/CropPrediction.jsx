import { useEffect, useState } from "react";
import { CloudUpload, Loader2, Leaf, BarChart3 } from "lucide-react";
import "./CropPrediction.css";
import axios from "axios";
import ComparisonChart from "./ComparisonChart";

function CropPrediction() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [state, setState] = useState("");
  const [visiblePrices, setVisiblePrices] = useState({});

  const indianStates = [
    "Andaman and Nicobar Islands", "Andhra Pradesh", "Assam", "Bihar", "Chandigarh",
    "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi(NCR)", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand",
    "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra",
    "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal"
  ];

  const handleShowPrice = (index) => {
    setVisiblePrices((prev) => ({ ...prev, [index]: true }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file only.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB.");
        return;
      }

      setSelectedImage(URL.createObjectURL(file));
      setPrediction(null);
      setError("");
    }
  };

  const handleDetectClick = async () => {
    const fileInput = document.getElementById("imageUpload");
    const imageFile = fileInput?.files[0];

    if (!imageFile) {
      setError("Please upload a soil image first.");
      return;
    }

    if (!state) {
      setError("Please select your state.");
      return;
    }

    setLoading(true);
    setError("");
    setPrediction(null);

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("state", state);

    try {
      const res = await axios.post(
        "https://agrisathi-express.onrender.com/api/crop-prediction",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          timeout: 20000,
        }
      );

      setPrediction({
        topPredictions: res.data.top_predictions,
        crop_price_data: res.data.crop_price_data,
      });

    } catch (err) {
      console.error("Error uploading image:", err);

      if (err.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
      }
      else if (err.response) {
        const backendError = err.response.data.message || err.response.data.error;
        setError(backendError || "Prediction failed.");
      }
      else if (err.request) {
        setError("Cannot connect to server.");
      }
      else {
        setError("Unexpected error occurred.");
      }
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (selectedImage) URL.revokeObjectURL(selectedImage);
    };
  }, [selectedImage]);

  const bestCropIndex = prediction?.crop_price_data
    ?.map((c, i) => ({ ...c, index: i }))
    ?.filter(c => c.price !== null)
    ?.sort((a, b) => b.price - a.price)[0]?.index;

  return (
    <div className="main_content1">
      <div className="header-section">
        <h1 className="main-title">
          Crop Prediction <Leaf className="title-icon" />
        </h1>

        <h3 className="subtitle">
          Upload a soil image to identify suitable crops
        </h3>
      </div>

      <div className="content-grid">

        <div className="upload-card">

          <div className="state-selector">
            <label>Select State</label>

            <select value={state} onChange={(e) => setState(e.target.value)}>
              <option value="">Select state</option>

              {indianStates.map((s, idx) => (
                <option key={idx} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <label htmlFor="imageUpload" className="upload-box">

            {selectedImage ? (
              <img src={selectedImage} alt="Preview" className="preview-image" />
            ) : (
              <div className="upload-placeholder">
                <CloudUpload size={48} strokeWidth={1.5} />
                <p>Choose soil image</p>
                <span>Drag & drop or click to browse</span>
              </div>
            )}

            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </label>

          <button
            className="detect-button"
            onClick={handleDetectClick}
            disabled={!selectedImage || !state || loading}
          >
            {loading ? (
              <>
                <Loader2 className="spinner-icon" size={16} />
                Analyzing...
              </>
            ) : (
              <>
                <BarChart3 size={20} />
                Predict Crop
              </>
            )}
          </button>

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}
        </div>

        <div className="prediction-wrapper">

          {!prediction && !loading && (
            <div className="comparison-section">
              <h3>AgriSathi AI Crop Prediction</h3>

              <p
                style={{
                  textAlign: "center",
                  fontSize: "0.85rem",
                  color: "#8d6e63"
                }}
              >
                AI-assisted soil analysis and crop recommendation system
              </p>

              <ComparisonChart />

              <ul>
                <li>No manual soil testing required</li>
                <li>Instant AI-based prediction</li>
                <li>CNN-based soil classification</li>
                <li>Top crop recommendations with prices</li>
              </ul>
            </div>
          )}

          {prediction?.topPredictions?.length > 0 && (
            <div className="prediction-card">

              <h3 className="prediction-title">Top 3 Predictions</h3>

              {prediction.topPredictions.map((item, index) => (
                <div key={index} className="prediction-item">

                  <div className="prediction-header">
                    <span className="rank-badge">#{index + 1}</span>
                    <span className="result-text">{item.soil_type}</span>
                  </div>

                  <div className="confidence-container">
                    <div className="confidence-bar">
                      <div
                        className="confidence-fill"
                        style={{ width: `${item.confidence}%` }}
                      />
                    </div>

                    <span className="confidence-text">
                      {item.confidence}%
                    </span>
                  </div>
                </div>
              ))}

              {prediction.crop_price_data?.length > 0 && (
                <div className="crops-container">

                  <h4>Recommended Crops</h4>

                  <div className="crops-grid">

                    {prediction.crop_price_data.map((item, index) => (
                      <div
                        key={index}
                        className={`crop-chip ${index === bestCropIndex ? "best-crop" : ""}`}
                      >
                        🌱 {item.crop}

                        {index === bestCropIndex && (
                          <div className="best-badge">⭐ Best Profit</div>
                        )}

                        {!visiblePrices[index] ? (
                          <button
                            className="price-btn"
                            onClick={() => handleShowPrice(index)}
                          >
                            Price Prediction
                          </button>
                        ) : item.price ? (
                          <div className="price-text reveal">
                            ₹ {item.price}/quintal
                          </div>
                        ) : (
                          <div className="no-price reveal">
                            Market Data Unavailable
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!prediction && !loading && (
            <div className="empty-state">
              Upload a soil image to see predictions
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              Analyzing soil image...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CropPrediction;
