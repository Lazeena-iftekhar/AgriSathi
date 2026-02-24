from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import base64
import io
import numpy as np
from PIL import Image
import tensorflow as tf
from huggingface_hub import hf_hub_download, login
import os


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# API Keys and Authentication
# PLANT_ID_API_KEY = ""


# Authenticate with Hugging Face
# login(token="")

# Load the soil classification model
model = None
try:
    model_path = hf_hub_download(repo_id="arpitsharrrma/soilnet-model", filename="SoilNet.keras")
    model = tf.keras.models.load_model(model_path)
    print("Soil classification model loaded successfully!")
except Exception as e:
    print(f"Error loading soil model: {e}")
    model = None

# Soil type labels and crop recommendations
soil_labels = ['Alluvial Soil', 'Black Soil', 'Clay Soil', 'Red Soil', 'Sandy Soil']

crop_recommendations = {
    'Alluvial Soil': ['Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton'],
    'Black Soil': ['Cotton', 'Wheat', 'Jowar', 'Linseed', 'Virginia tobacco'],
    'Clay Soil': ['Rice', 'Wheat', 'Gram', 'Mustard', 'Barley'],
    'Red Soil': ['Cotton', 'Wheat', 'Rice', 'Pulses', 'Millets'],
    'Sandy Soil': ['Bajra', 'Barley', 'Cotton', 'Maize', 'Castor']
}

def validate_image_file():
    """Common image validation function"""
    if 'image' not in request.files:
        return None, {"error": "No image file provided"}, 400
    
    file = request.files['image']
    if file.filename == '':
        return None, {"error": "No image file selected"}, 400
    
    return file, None, None

@app.route('/detect-disease', methods=['POST'])
def detect_disease():
    """Disease detection using Plant.id API"""
    try:
        # Validate image file
        file, error_response, status_code = validate_image_file()
        if error_response:
            return jsonify(error_response), status_code

        # Read and encode the image
        image_bytes = file.read()
        base64_image = base64.b64encode(image_bytes).decode('utf-8')
        
        # Make API request to Plant.id
        response = requests.post(
            "https://api.plant.id/v2/health_assessment",
            headers={"Content-Type": "application/json"},
            json={
                "api_key": PLANT_ID_API_KEY,
                "images": [base64_image],
                "modifiers": ["similar_images", "treatment"],
                "plant_language": "en",
                "plant_details": ["common_names", "url", "name_authority", "wiki_description", "taxonomy"]
            },
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return jsonify(result)
        else:
            error_msg = f"Plant.id API Error {response.status_code}"
            try:
                error_detail = response.json()
                error_msg += f" - {error_detail.get('message', response.text)}"
            except:
                error_msg += f" - {response.text}"
            
            return jsonify({"error": error_msg}), 500
            
    except requests.exceptions.Timeout:
        return jsonify({"error": "Request timeout - plant identification service is slow"}), 504
    except requests.exceptions.ConnectionError:
        return jsonify({"error": "Cannot connect to plant identification service"}), 503
    except Exception as e:
        print(f"Error processing disease detection: {str(e)}")
        return jsonify({"error": "Failed to process image for disease detection"}), 500

@app.route('/predict', methods=['POST'])
def predict_soil():
    """Soil type prediction and crop recommendations"""
    try:
        if model is None:
            return jsonify({"error": "Soil classification model not loaded"}), 500
        
        # Validate image file
        file, error_response, status_code = validate_image_file()
        if error_response:
            return jsonify(error_response), status_code

        # Read and process the image
        image_bytes = file.read()
        img = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if needed
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize and normalize the image
        img = img.resize((224, 224))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        # Make prediction
        prediction = model.predict(img_array)
        predicted_class_idx = np.argmax(prediction)
        predicted_soil = soil_labels[predicted_class_idx]
        confidence = float(np.max(prediction))
        
        # Get crop recommendations
        recommended_crops = crop_recommendations.get(predicted_soil, [])
        
        result = f"Soil Type: {predicted_soil} | Recommended Crops: {', '.join(recommended_crops[:3])}"
        
        return jsonify({
            "result": result,
            "soil_type": predicted_soil,
            "recommended_crops": recommended_crops,
            "confidence": round(confidence * 100, 2)
        })
        
    except Exception as e:
        print(f"Error in soil prediction: {e}")
        return jsonify({"error": "Failed to process image for soil prediction"}), 500

@app.route('/analyze-complete', methods=['POST'])
def analyze_complete():
    """Run both disease detection and soil analysis on the same image"""
    try:
        # Validate image file
        file, error_response, status_code = validate_image_file()
        if error_response:
            return jsonify(error_response), status_code

        # Read image once
        image_bytes = file.read()
        
        # Prepare results object
        results = {
            "disease_analysis": None,
            "soil_analysis": None,
            "errors": []
        }
        
        # Disease Detection
        try:
            base64_image = base64.b64encode(image_bytes).decode('utf-8')
            
            disease_response = requests.post(
                "https://api.plant.id/v2/health_assessment",
                headers={"Content-Type": "application/json"},
                json={
                    "api_key": PLANT_ID_API_KEY,
                    "images": [base64_image],
                    "modifiers": ["similar_images", "treatment"],
                    "plant_language": "en",
                    "plant_details": ["common_names", "url", "name_authority", "wiki_description", "taxonomy"]
                },
                timeout=30
            )
            
            if disease_response.status_code == 200:
                results["disease_analysis"] = disease_response.json()
            else:
                results["errors"].append(f"Disease detection failed: {disease_response.status_code}")
                
        except Exception as e:
            results["errors"].append(f"Disease detection error: {str(e)}")
        
        # Soil Analysis
        try:
            if model is not None:
                img = Image.open(io.BytesIO(image_bytes))
                
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                img = img.resize((224, 224))
                img_array = np.array(img) / 255.0
                img_array = np.expand_dims(img_array, axis=0)
                
                prediction = model.predict(img_array)
                predicted_class_idx = np.argmax(prediction)
                predicted_soil = soil_labels[predicted_class_idx]
                confidence = float(np.max(prediction))
                recommended_crops = crop_recommendations.get(predicted_soil, [])
                
                results["soil_analysis"] = {
                    "soil_type": predicted_soil,
                    "recommended_crops": recommended_crops,
                    "confidence": round(confidence * 100, 2)
                }
            else:
                results["errors"].append("Soil classification model not loaded")
                
        except Exception as e:
            results["errors"].append(f"Soil analysis error: {str(e)}")
        
        return jsonify(results)
        
    except Exception as e:
        print(f"Error in complete analysis: {e}")
        return jsonify({"error": "Failed to process complete analysis"}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy", 
        "services": {
            "disease_detection": "available",
            "soil_classification": "available" if model is not None else "unavailable"
        }
    })

if __name__ == "__main__":
    print("Starting Agricultural Analysis Server...")
    print(f"Disease Detection: Available")
    print(f"Soil Classification: {'Available' if model is not None else 'Unavailable'}")
    app.run(debug=True, host='0.0.0.0', port=5001)