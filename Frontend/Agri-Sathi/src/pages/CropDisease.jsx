import { useEffect, useState } from "react";
import { CloudUpload, AlertTriangle, CheckCircle, Info, Leaf, Camera } from "lucide-react";

function CropDisease() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setPrediction(null); // Reset previous results
    }
  };

  const handleDetectClick = async () => {
    const fileInput = document.getElementById("imageUpload");
    const imageFile = fileInput?.files[0];

    if (!imageFile) {
      alert("Please upload an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/detect-disease", {
        method: "POST",
        body: formData,
      });
      
      const result = await res.json();
      setPrediction(result);
    } catch (error) {
      console.error("Error uploading image:", error);
      setPrediction({
        status: "error",
        message: "Failed to detect disease. Please try again.",
        diseases: [],
        is_healthy: false,
        confidence: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="text-green-500" size={24} />;
      case "disease_detected":
        return <AlertTriangle className="text-red-500" size={24} />;
      case "error":
        return <AlertTriangle className="text-gray-500" size={24} />;
      default:
        return <Info className="text-blue-500" size={24} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "healthy":
        return "bg-green-50 border-green-200 text-green-800";
      case "disease_detected":
        return "bg-red-50 border-red-200 text-red-800";
      case "error":
        return "bg-gray-50 border-gray-200 text-gray-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen" style={{
      background: 'linear-gradient(135deg, #f0f8f0 0%, #e8f5e8 100%)',
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div className="text-center mb-8" style={{
        marginBottom: '40px'
      }}>
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2" style={{
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
          <Leaf className="text-green-600" style={{ color: '#4caf50' }} />
          Crop Disease Detection
        </h1>
        <h3 className="text-lg text-gray-600" style={{
          color: '#4a7c4a',
          fontSize: '1.2rem',
          fontWeight: '400',
          textAlign: 'center',
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.5'
        }}>Upload an image of the leaf to identify diseases</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '30px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Upload Section */}
        <div className="space-y-4" style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          border: '2px solid #c8e6c9',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-gray-400 transition-colors" style={{
            border: '3px dashed #81c784',
            borderRadius: '15px',
            padding: '30px',
            transition: 'all 0.3s ease',
            background: 'linear-gradient(145deg, #fafafa, #f5f5f5)',
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <label htmlFor="imageUpload" className="cursor-pointer block" style={{
              cursor: 'pointer',
              display: 'block',
              width: '100%',
              height: '100%'
            }}>
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg mx-auto"
                  style={{
                    width: '100%',
                    height: '250px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                  }}
                />
              ) : (
                <div className="text-center" style={{
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: '#4caf50'
                }}>
                  <CloudUpload size={48} className="mx-auto text-gray-400 mb-4" style={{
                    marginBottom: '15px',
                    color: '#66bb6a'
                  }} />
                  <p className="text-gray-600" style={{
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    color: '#4caf50',
                    margin: '0'
                  }}>Choose an image to upload</p>
                  <p className="text-sm text-gray-400 mt-2" style={{
                    fontSize: '0.9rem',
                    color: '#81c784',
                    margin: '8px 0 0 0'
                  }}>PNG, JPG up to 10MB</p>
                </div>
              )}
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <button
            onClick={handleDetectClick}
            disabled={!selectedImage || isLoading}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
              selectedImage && !isLoading
                ? "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            style={{
              width: '100%',
              padding: '15px 30px',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: 'white',
              background: selectedImage && !isLoading 
                ? 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)' 
                : '#c8e6c9',
              border: 'none',
              borderRadius: '12px',
              cursor: selectedImage && !isLoading ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              boxShadow: selectedImage && !isLoading 
                ? '0 4px 15px rgba(76, 175, 80, 0.3)' 
                : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Analyzing Image...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}>
                <Camera size={20} />
                Detect Disease
              </div>
            )}
          </button>
        </div>

        {/* Results Section */}
        <div className="space-y-4" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {prediction && (
            <div className="space-y-4" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {/* Status Summary */}
              <div className={`p-4 rounded-lg border ${getStatusColor(prediction.status)}`} style={{
                padding: '20px',
                borderRadius: '15px',
                border: '2px solid #c8e6c9',
                background: prediction.status === 'healthy' 
                  ? 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)'
                  : prediction.status === 'disease_detected'
                  ? 'linear-gradient(135deg, #ffebee 0%, #fce4ec 100%)'
                  : 'linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}>
                <div className="flex items-center gap-3 mb-2" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px'
                }}>
                  {getStatusIcon(prediction.status)}
                  <div>
                    <h3 className="font-semibold text-lg" style={{
                      fontWeight: '600',
                      fontSize: '1.2rem',
                      color: prediction.status === 'healthy' ? '#2e7d32' : '#d32f2f',
                      margin: '0 0 4px 0'
                    }}>{prediction.message}</h3>
                    <p className="text-sm opacity-75" style={{
                      fontSize: '0.9rem',
                      opacity: '0.8',
                      color: prediction.status === 'healthy' ? '#388e3c' : '#c62828',
                      margin: '0'
                    }}>
                      Confidence: {prediction.confidence}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Disease Details */}
              {prediction.diseases && prediction.diseases.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4" style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '2px solid #ffcdd2',
                  borderRadius: '15px',
                  padding: '20px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}>
                  <h4 className="font-semibold text-lg mb-3 text-gray-800" style={{
                    fontWeight: '600',
                    fontSize: '1.3rem',
                    marginBottom: '15px',
                    color: '#d32f2f'
                  }}>Disease Details</h4>
                  <div className="space-y-3" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                  }}>
                    {prediction.diseases.slice(0, 3).map((disease, index) => (
                      <div key={index} className="border-l-4 border-red-400 pl-4 py-2" style={{
                        borderLeft: '4px solid #ef5350',
                        paddingLeft: '16px',
                        paddingTop: '12px',
                        paddingBottom: '12px',
                        background: 'rgba(255, 245, 245, 0.5)',
                        borderRadius: '0 8px 8px 0'
                      }}>
                        <div className="flex justify-between items-start mb-2" style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '8px'
                        }}>
                          <h5 className="font-medium text-gray-800" style={{
                            fontWeight: '500',
                            color: '#d32f2f',
                            fontSize: '1.1rem'
                          }}>{disease.name}</h5>
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm" style={{
                            background: '#ffcdd2',
                            color: '#d32f2f',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: '500'
                          }}>
                            {disease.probability}%
                          </span>
                        </div>
                        {disease.description && (
                          <p className="text-gray-600 text-sm mb-2" style={{
                            color: '#666',
                            fontSize: '0.9rem',
                            marginBottom: '8px',
                            lineHeight: '1.4'
                          }}>{disease.description}</p>
                        )}
                        {disease.treatment && disease.treatment.description && (
                          <div className="bg-blue-50 p-3 rounded mt-2" style={{
                            background: 'linear-gradient(135deg, #e3f2fd 0%, #e8f5e9 100%)',
                            padding: '12px',
                            borderRadius: '8px',
                            marginTop: '8px',
                            border: '1px solid #c8e6c9'
                          }}>
                            <h6 className="font-medium text-blue-800 mb-1" style={{
                              fontWeight: '500',
                              color: '#2e7d32',
                              marginBottom: '4px',
                              fontSize: '0.95rem'
                            }}>Treatment:</h6>
                            <p className="text-blue-700 text-sm" style={{
                              color: '#388e3c',
                              fontSize: '0.85rem',
                              lineHeight: '1.4',
                              margin: '0'
                            }}>{disease.treatment.description}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Plant Information */}
              {prediction.plant_info && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4" style={{
                  background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
                  border: '2px solid #a5d6a7',
                  borderRadius: '15px',
                  padding: '20px',
                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.1)'
                }}>
                  <h4 className="font-semibold text-lg mb-3 text-green-800 flex items-center gap-2" style={{
                    fontWeight: '600',
                    fontSize: '1.3rem',
                    marginBottom: '15px',
                    color: '#2e7d32',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Leaf size={20} />
                    Plant Information
                  </h4>
                  <div className="space-y-2" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    {prediction.plant_info.common_names && prediction.plant_info.common_names.length > 0 && (
                      <p className="text-green-700" style={{
                        color: '#388e3c',
                        fontSize: '0.95rem',
                        lineHeight: '1.4',
                        margin: '0',
                        padding: '8px 12px',
                        background: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '8px',
                        border: '1px solid #c8e6c9'
                      }}>
                        <span className="font-medium" style={{ fontWeight: '500', color: '#2e7d32' }}>Common Names:</span>{" "}
                        {prediction.plant_info.common_names.slice(0, 3).join(", ")}
                      </p>
                    )}
                    {prediction.plant_info.name_authority && (
                      <p className="text-green-700" style={{
                        color: '#388e3c',
                        fontSize: '0.95rem',
                        lineHeight: '1.4',
                        margin: '0',
                        padding: '8px 12px',
                        background: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '8px',
                        border: '1px solid #c8e6c9'
                      }}>
                        <span className="font-medium" style={{ fontWeight: '500', color: '#2e7d32' }}>Scientific Name:</span>{" "}
                        {prediction.plant_info.name_authority}
                      </p>
                    )}
                    {prediction.plant_info.wiki_description && (
                      <p className="text-green-600 text-sm mt-2" style={{
                        color: '#4caf50',
                        fontSize: '0.9rem',
                        marginTop: '8px',
                        lineHeight: '1.4',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '8px',
                        border: '1px solid #c8e6c9'
                      }}>
                        {prediction.plant_info.wiki_description.value.slice(0, 300)}...
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Health Status */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4" style={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '2px solid #c8e6c9',
                borderRadius: '15px',
                padding: '20px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}>
                <h4 className="font-semibold text-lg mb-2 text-gray-800" style={{
                  fontWeight: '600',
                  fontSize: '1.2rem',
                  marginBottom: '12px',
                  color: '#2d5a2d'
                }}>Health Assessment</h4>
                <div className="flex items-center gap-2" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  {prediction.is_healthy ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <AlertTriangle className="text-red-500" size={20} />
                  )}
                  <span className={prediction.is_healthy ? "text-green-700" : "text-red-700"} style={{
                    color: prediction.is_healthy ? '#2e7d32' : '#d32f2f',
                    fontWeight: '500',
                    fontSize: '1rem'
                  }}>
                    Plant is {prediction.is_healthy ? "healthy" : "showing signs of disease"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {!prediction && !isLoading && (
            <div className="text-center py-12 text-gray-500" style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#81c784',
              background: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '15px',
              border: '2px dashed #c8e6c9'
            }}>
              <Camera size={48} className="mx-auto mb-4 opacity-50" style={{
                margin: '0 auto 16px auto',
                opacity: '0.6',
                color: '#66bb6a'
              }} />
              <p style={{
                fontSize: '1.1rem',
                fontWeight: '500',
                margin: '0'
              }}>Upload an image to see detailed analysis results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CropDisease;