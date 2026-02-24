import { useEffect, useState } from "react";
import { CloudUpload, Loader2, Leaf, BarChart3 } from "lucide-react";
// import "../App.css";
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
        result: res.data.result,
        soilType: res.data.soil_type || null,
        recommendedCrops: res.data.recommended_crops || [],
        confidence: res.data.confidence || null,
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
    <div className="div main_content1" style={{
      background: 'linear-gradient(135deg, #f0f8f0 0%, #e8f5e8 100%)',
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{
          color: '#2d5a2d',
          fontSize: '2.5rem',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '10px',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <Leaf style={{ color: '#4caf50' }} />
          Crop Prediction
        </h1>
        <h3 style={{
          color: '#4a7c4a',
          fontSize: '1.2rem',
          fontWeight: '400',
          textAlign: 'center',
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.5'
        }}>Upload an image of the soil to identify the crops you can grow</h3>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '30px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Upload Section - Left Side */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          border: '2px solid #c8e6c9',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <label htmlFor="imageUpload" className="upload-box" style={{
            display: 'block',
            width: '100%',
            minHeight: '300px',
            border: '3px dashed #81c784',
            borderRadius: '15px',
            cursor: 'pointer',
            textAlign: 'center',
            padding: '20px',
            transition: 'all 0.3s ease',
            background: 'linear-gradient(145deg, #fafafa, #f5f5f5)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Preview"
                className="preview-image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}
              />
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#4caf50'
              }}>
                <CloudUpload size={48} strokeWidth={1.5} style={{
                  marginBottom: '15px',
                  color: '#66bb6a'
                }} />
                <p style={{
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  color: '#4caf50',
                  margin: '0'
                }}>Choose an image to upload</p>
                <p style={{
                  fontSize: '0.9rem',
                  color: '#81c784',
                  margin: '8px 0 0 0'
                }}>Drag and drop or click to browse</p>
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
            style={{
              width: '100%',
              padding: '15px 30px',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: 'white',
              background: selectedImage && !loading 
                ? 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)' 
                : '#c8e6c9',
              border: 'none',
              borderRadius: '12px',
              cursor: selectedImage && !loading ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              boxShadow: selectedImage && !loading 
                ? '0 4px 15px rgba(76, 175, 80, 0.3)' 
                : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              opacity: selectedImage && !loading ? 1 : 0.5,
              transform: selectedImage && !loading ? 'translateY(0)' : 'translateY(1px)'
            }}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} style={{
                  animation: 'spin 1s linear infinite'
                }} />
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
            <div className="error-message" style={{ 
              color: '#d32f2f', 
              marginTop: '10px',
              padding: '15px',
              backgroundColor: '#ffebee',
              borderRadius: '10px',
              border: '1px solid #ffcdd2',
              textAlign: 'center'
            }}>
              <p style={{
                margin: '0',
                fontSize: '1rem',
                fontWeight: '500'
              }}>❌ {error}</p>
            </div>
          )}
        </div>

        {/* Results Section - Right Side */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {prediction && (
            <div className="prediction-results" style={{ 
              padding: '25px',
              backgroundColor: '#e8f5e9',
              borderRadius: '15px',
              border: '2px solid #a5d6a7',
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.1)'
            }}>
              <h3 style={{
                color: '#2e7d32',
                fontSize: '1.4rem',
                fontWeight: '600',
                textAlign: 'center',
                marginBottom: '20px',
                margin: '0 0 20px 0'
              }}>✅ Analysis Complete!</h3>
              <div className="result-details" style={{
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{
                  margin: '0',
                  fontSize: '1rem',
                  color: '#2d5a2d',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '10px',
                  border: '1px solid #c8e6c9',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  <strong style={{ color: '#1b5e20', fontSize: '1.05rem' }}>Result:</strong>
                  <span style={{ marginLeft: '8px', fontWeight: '500' }}>{prediction.result}</span>
                </div>
                
                {prediction.confidence && (
                  <div style={{
                    margin: '0',
                    fontSize: '1rem',
                    color: '#2d5a2d',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '10px',
                    border: '1px solid #c8e6c9',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <strong style={{ color: '#1b5e20', fontSize: '1.05rem' }}>Confidence:</strong>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <div style={{
                        width: '100px',
                        height: '8px',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${prediction.confidence}%`,
                          height: '100%',
                          backgroundColor: '#4caf50',
                          borderRadius: '4px',
                          transition: 'width 0.5s ease'
                        }}></div>
                      </div>
                      <span style={{ fontWeight: '600', color: '#2e7d32' }}>{prediction.confidence}%</span>
                    </div>
                  </div>
                )}
                
                {prediction.soilType && (
                  <div style={{
                    margin: '0',
                    fontSize: '1rem',
                    color: '#2d5a2d',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '10px',
                    border: '1px solid #c8e6c9',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}>
                    <strong style={{ color: '#1b5e20', fontSize: '1.05rem' }}>Soil Type:</strong>
                    <span style={{ marginLeft: '8px', fontWeight: '500' }}>{prediction.soilType}</span>
                  </div>
                )}
                
                {prediction.recommendedCrops && prediction.recommendedCrops.length > 0 && (
                  <div style={{
                    margin: '0',
                    padding: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '10px',
                    border: '1px solid #c8e6c9',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}>
                    <p style={{
                      margin: '0 0 12px 0',
                      fontSize: '1.05rem',
                      color: '#2d5a2d',
                      fontWeight: '600'
                    }}>
                      <strong style={{ color: '#1b5e20' }}>Recommended Crops:</strong>
                    </p>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                      gap: '8px'
                    }}>
                      {prediction.recommendedCrops.map((crop, index) => (
                        <div key={index} style={{
                          padding: '8px 12px',
                          backgroundColor: '#f1f8e9',
                          borderRadius: '20px',
                          border: '1px solid #a5d6a7',
                          textAlign: 'center',
                          fontSize: '0.9rem',
                          color: '#2e7d32',
                          fontWeight: '500',
                          transition: 'all 0.2s ease',
                          cursor: 'default'
                        }}>
                          🌱 {crop}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!prediction && !loading && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#81c784',
              background: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '15px',
              border: '2px dashed #c8e6c9',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '300px'
            }}>
              <BarChart3 size={48} style={{
                margin: '0 auto 16px auto',
                opacity: '0.6',
                color: '#66bb6a'
              }} />
              <p style={{
                fontSize: '1.1rem',
                fontWeight: '500',
                margin: '0',
                color: '#4caf50'
              }}>Upload a soil image to see prediction results</p>
              <p style={{
                fontSize: '0.9rem',
                margin: '8px 0 0 0',
                opacity: '0.8'
              }}>Get soil type analysis and crop recommendations</p>
            </div>
          )}

          {loading && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#4caf50',
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '15px',
              border: '2px solid #c8e6c9',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '300px'
            }}>
              <Loader2 size={48} style={{
                margin: '0 auto 16px auto',
                color: '#66bb6a',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{
                fontSize: '1.1rem',
                fontWeight: '500',
                margin: '0',
                color: '#4caf50'
              }}>Analyzing soil image...</p>
              <p style={{
                fontSize: '0.9rem',
                margin: '8px 0 0 0',
                opacity: '0.8'
              }}>This may take a few moments</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default CropPrediction;