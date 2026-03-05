import { useEffect, useState } from "react";
import { CloudUpload, Loader2, Leaf, BarChart3 } from "lucide-react";
import "./CropPrediction.css";
import axios from "axios";

function CropPrediction() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setPrediction(null); // Clear previous prediction
      setError(""); // Clear previous error
    }
  };

  const handleDetectClick = async () => {
    const fileInput = document.getElementById("imageUpload");
    const imageFile = fileInput?.files[0];

    if (!imageFile) {
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/crop-prediction",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000, // 30 seconds timeout
        }
      );

      setPrediction({
  topPredictions: res.data.top_predictions,
  recommendedCrops: res.data.recommended_crops,
  confidenceMessage: res.data.confidence_message,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      
      if (error.code === 'ECONNABORTED') {
        setError("Request timed out. Please try again.");
      } else if (error.response) {
        setError(error.response.data.error || "Failed to detect soil type. Please try again.");
      } else if (error.request) {
        setError("Unable to connect to the server. Please check if the server is running.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Clean up object URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  return (
  <div className="main_content1">
    <div className="header-section">
      <h1 className="main-title">
        <Leaf className="title-icon" />
        Crop Prediction
      </h1>
      <h3 className="subtitle">
        Upload an image of the soil to identify the crops you can grow
      </h3>
    </div>

    <div className="content-grid">
      
      {/* LEFT SIDE - Upload */}
      <div className="upload-card">
        <label htmlFor="imageUpload" className="upload-box">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Preview"
              className="preview-image"
            />
          ) : (
            <div className="upload-placeholder">
              <CloudUpload size={48} strokeWidth={1.5} />
              <p>Choose an image to upload</p>
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
          disabled={!selectedImage || loading}
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

      {/* RIGHT SIDE - Results */}
      <div className="prediction-wrapper">

        {prediction?.topPredictions?.length > 0 && (
          <div className="prediction-card">
            <h3 className="prediction-title">Top 3 Predictions</h3>

            {prediction.topPredictions.map((item, index) => (
              <div key={index} className="prediction-item">
                <div className="prediction-header">
                  <span className="rank-badge">#{index + 1}</span>
                  <span className="result-text">
                    {item.soil_type}
                  </span>
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

            {prediction.confidenceMessage && (
              <div className="confidence-warning">
                ⚠ {prediction.confidenceMessage}
              </div>
            )}

            {prediction.recommendedCrops?.length > 0 && (
              <div className="crops-container">
                <h4>Recommended Crops</h4>
                <div className="crops-grid">
                  {prediction.recommendedCrops.map((crop, index) => (
                    <div key={index} className="crop-chip">
                      🌱{crop}
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