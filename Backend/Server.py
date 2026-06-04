from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import requests
import base64
import io
import numpy as np
from PIL import Image
import tensorflow as tf
from huggingface_hub import hf_hub_download
import os
import pickle
from datetime import datetime
from dotenv import load_dotenv
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input, decode_predictions
import tensorflow as tf
import keras

load_dotenv()

app = Flask(__name__)
CORS(app)

PLANT_ID_API_KEY = os.getenv("PLANT_ID_API_KEY")

model = None

imagenet_model = MobileNetV2(weights="imagenet")

try:
    model_path = hf_hub_download(
        repo_id="arpitsharrrma/soilnet-model",
        filename="SoilNet.keras"
    )

    model = tf.keras.models.load_model(model_path)
    print("✅ Soil model loaded")
    print(tf.__version__)
    print(keras.__version__)
except Exception as e:
    print("❌ Soil model error:", e)

try:
    price_model = pickle.load(open("price_prediction_ml_model/price_model.pkl", "rb"))

    state_encoder = pickle.load(open("price_prediction_ml_model/state_encoder.pkl", "rb"))
    district_encoder = pickle.load(open("price_prediction_ml_model/district_encoder.pkl", "rb"))
    market_encoder = pickle.load(open("price_prediction_ml_model/market_encoder.pkl", "rb"))
    commodity_encoder = pickle.load(open("price_prediction_ml_model/commodity_encoder.pkl", "rb"))

    print("✅ Price model loaded")

except Exception as e:
    print("❌ Price model error:", e)

soil_labels = [
    'Alluvial Soil',
    'Black Soil',
    'Clay Soil',
    'Red Soil',
    'Sandy Soil'
]

crop_recommendations = {
    'Alluvial Soil': ['Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton'],
    'Black Soil': ['Cotton', 'Wheat', 'Jowar', 'Linseed', 'Virginia tobacco'],
    'Clay Soil': ['Rice', 'Wheat', 'Gram', 'Mustard', 'Barley'],
    'Red Soil': ['Cotton', 'Wheat', 'Rice', 'Pulses', 'Millets'],
    'Sandy Soil': ['Bajra', 'Barley', 'Cotton', 'Maize', 'Castor']
}

ALLOWED_MAGIC = {
    b'\xff\xd8\xff': 'jpg',
    b'\x89PNG': 'png',
    b'GIF8': 'gif',
    b'RIFF': 'webp'
}

def validate_image_magic(file_bytes):
    header = file_bytes[:4]

    for magic, file_type in ALLOWED_MAGIC.items():
        if header.startswith(magic):
            return True

    return False

def validate_image_file():
    if 'image' not in request.files:
        return None, {"error": "No image uploaded"}, 400

    file = request.files['image']

    if file.filename == '':
        return None, {"error": "No image selected"}, 400

    return file, None, None


def clean(value):
    return str(value).strip().title()



def safe_encode(encoder, value):
    value = clean(value)

    if value in encoder.classes_:
        return encoder.transform([value])[0]

    return encoder.transform([encoder.classes_[0]])[0]

def check_image_quality(image_bytes):
    img_array = np.frombuffer(image_bytes, dtype=np.uint8)

    gray = cv2.imdecode(img_array, cv2.IMREAD_GRAYSCALE)

    if gray is None:
        return False, "Unable to read image"

    laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()

    if laplacian_var < 100:
        return False, "Image is blurry. Please upload a clearer soil image."

    return True, None

def is_probably_soil(img):
    img224 = img.resize((224, 224))

    arr = np.array(img224)
    arr = np.expand_dims(arr, axis=0)

    arr = preprocess_input(arr)

    preds = imagenet_model.predict(arr, verbose=0)

    decoded = decode_predictions(preds, top=5)[0]

    forbidden_keywords = [
        "person",
        "face",
        "dog",
        "cat",
        "car",
        "truck",
        "bus",
        "phone",
        "laptop",
        "keyboard",
        "television",
        "pizza",
        "burger",
        "sandwich",
        "bicycle",
        "motorcycle"
    ]

    for _, label, confidence in decoded:
        label = label.lower()

        for keyword in forbidden_keywords:
            if keyword in label and confidence > 0.30:
                return False

    return True


@app.route('/detect-disease', methods=['POST'])
def detect_disease():
    try:
        file, err, code = validate_image_file()

        if err:
            return jsonify(err), code

        image_bytes = file.read()

        if len(image_bytes) == 0:
            return jsonify({"error": "Empty image file"}), 400

        if not validate_image_magic(image_bytes):
            return jsonify({
                "error": "Invalid file type. Only JPG, PNG, GIF and WebP images are allowed."
            }), 415

        base64_image = base64.b64encode(image_bytes).decode("utf-8")

        identify_response = requests.post(
            "https://plant.id/api/v3/identification",
            headers={
                "Api-Key": PLANT_ID_API_KEY
            },
            files={
                "images": image_bytes
            },
            data={},  
            timeout=30
        )

        print("STATUS:", identify_response.status_code)
        print("TEXT:", identify_response.text)

        identify_data = identify_response.json()

        is_plant = (
            identify_data
            .get("result", {})
            .get("is_plant", {})
        )

        if not is_plant.get("binary", False):
            return jsonify({
                "error": "Invalid Input Object",
                "message": "Uploaded image does not contain a plant."
            }), 422

        if is_plant.get("probability", 0) < 0.60:
            return jsonify({
                "error": "Invalid Input Object",
                "message": "Please upload a clear plant leaf image."
            }), 422

        is_valid, message = check_image_quality(image_bytes)

        if not is_valid:
            return jsonify({
                "error": "Low quality image",
                "message": "Plant image is blurry. Please upload a clearer leaf image."
            }), 422

        disease_response = requests.post(
            "https://api.plant.id/v2/health_assessment",
            json={
                "api_key": PLANT_ID_API_KEY,
                "images": [base64_image],
                "modifiers": ["similar_images", "treatment"]
            },
            timeout=30
        )

        return jsonify(disease_response.json()), disease_response.status_code

    except Exception as e:
        print("Disease Detection Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/predict', methods=['POST'])
def predict_soil():
    try:
        if model is None:
            return jsonify({"error": "Soil model not loaded"}), 500

        file, err, code = validate_image_file()

        if err:
            return jsonify(err), code

        state = request.form.get("state")

        if not state:
            return jsonify({"error": "State required"}), 400

        image_bytes = file.read()

        if len(image_bytes) == 0:
            return jsonify({"error": "Empty image file"}), 400

        if not validate_image_magic(image_bytes):
            return jsonify({
                "error": "Invalid file type. Only JPG, PNG, GIF and WebP images are allowed."
            }), 415

        is_valid, message = check_image_quality(image_bytes)

        if not is_valid:
            return jsonify({
                "error": "Low quality image",
                "message": message
            }), 422

        try:
            img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            if not is_probably_soil(img):
                return jsonify({
                    "error": "Invalid Input Object",
                    "message": "Uploaded image does not appears to be clear. Please upload a soil image."
                }), 422
        except Exception:
            return jsonify({
                "error": "Invalid image file"
            }), 422

        



        img = img.resize((224, 224))

        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        prediction = model.predict(img_array)[0]

        highest_confidence = float(np.max(prediction))

        if highest_confidence < 0.75:
            return jsonify({
                "error": "Invalid Input Object",
                "message": f"Uploaded image does not appears to be soil. Please upload a soil image."
            }), 422

        top_indices = prediction.argsort()[-3:][::-1]

        top_predictions = [
            {
                "soil_type": soil_labels[i],
                "confidence": round(float(prediction[i] * 100), 2)
            }
            for i in top_indices
        ]

        predicted_soil = top_predictions[0]["soil_type"]

        recommended_crops = crop_recommendations.get(predicted_soil, [])

        crop_price_data = []

        for crop in recommended_crops:
            try:
                state_enc = safe_encode(state_encoder, state)
                district_enc = safe_encode(district_encoder, "Unknown")
                market_enc = safe_encode(market_encoder, "Unknown")
                crop_enc = safe_encode(commodity_encoder, crop)

                now = datetime.now()

                input_data = np.array([[
                    state_enc,
                    district_enc,
                    market_enc,
                    crop_enc,
                    now.month,
                    now.year
                ]])

                price = price_model.predict(input_data)[0]

                final_price = max(0.0, round(float(price), 2))

                crop_price_data.append({
                    "crop": crop,
                    "price": final_price
                })

            except Exception:
                crop_price_data.append({
                    "crop": crop,
                    "price": None
                })

        return jsonify({
            "top_predictions": top_predictions,
            "crop_price_data": crop_price_data
        })

    except Exception as e:
        print("Prediction Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/predict-price', methods=['POST'])
def predict_price():
    try:
        data = request.json

        state = data.get("state")
        crop = data.get("cropName")
        district = data.get("district") or "Unknown"
        market = data.get("market") or "Unknown"

        if not state or not crop:
            return jsonify({"error": "State & crop required"}), 400

        state_enc = safe_encode(state_encoder, state)
        district_enc = safe_encode(district_encoder, district)
        market_enc = safe_encode(market_encoder, market)
        crop_enc = safe_encode(commodity_encoder, crop)

        now = datetime.now()

        input_data = np.array([[
            state_enc,
            district_enc,
            market_enc,
            crop_enc,
            now.month,
            now.year
        ]])

        price = price_model.predict(input_data)[0]

        return jsonify({
            "predicted_price": round(float(price), 2)
        })

    except Exception as e:
        print("PRICE ERROR:", e)
        return jsonify({
            "error": str(e)
        }), 500
    try:
        if price_model is None:
            return jsonify({"error": "Price model not loaded"}), 500

        data = request.json

        state = data.get("state")
        commodity = data.get("cropName")

        if not state or not commodity:
            return jsonify({"error": "State and cropName required"}), 400

        state_encoded = state_encoder.transform([state])[0]
        commodity_encoded = commodity_encoder.transform([commodity])[0]

        input_data = np.array([[state_encoded, commodity_encoded]])

        prediction = price_model.predict(input_data)[0]

        return jsonify({
            "predicted_price": round(float(prediction), 2)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "running"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    print(f"🚀 Server running on port {port}")
    app.run(host="0.0.0.0", port=port)