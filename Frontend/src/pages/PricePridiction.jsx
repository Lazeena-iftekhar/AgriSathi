import React, { useState, useEffect } from "react";
import axios from "axios";
import { IndianRupee  } from "lucide-react";
import "../App.css";


const crops = ["Wheat", "Tomato", "Potato", "Onion", "Rice"];

const indianStates = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi(NCR)",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

function PricePrediction() {
  const [crop, setCrop] = useState("");
  const [state, setState] = useState("");
  const [entries, setEntries] = useState([]); // <-- Also missing from your current code
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [highlightedRow, setHighlightedRow] = useState(null);


 const handlePredict = async () => {
  if (!crop || !state) return;

  try {
    setLoading(true);

    const response = await axios.post(
      "http://localhost:5000/api/crops/add-price",
      { cropName: crop, state: state }
    );

    if (response.data.duplicate) {
  setPredictedPrice(response.data.existingData.price);
  setShowModal(true);

  setHighlightedRow({
    crop: response.data.existingData.crop_name,
    state: response.data.existingData.state,
  });

  await fetchEntries(); // 🔥 ADD THIS

  return;
}

    setPredictedPrice(response.data.predicted_price);
    setShowModal(true);

    await fetchEntries();

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const fetchEntries = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/crops/all-prices",
        {
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );
      const formatted = res.data.map((entry) => ({
        crop: entry.crop_name,
        price: entry.price,
        state: entry.state,
      }));
      setEntries(formatted);
    } catch (err) {
      console.error("❌ Failed to fetch entries:", err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="price-prediction-page">
      <div className="header-section">
      <h1 className="main-title">
        Price Prediction
        <IndianRupee size={34} className="title-icon" />
      </h1>
      <h3 className="subtitle">
        Select a crop and your state to predict price.
      </h3>
    </div>


      <div className="prediction-form" style={{ marginBottom: "20px" }}>
          <select value={crop} onChange={(e) => setCrop(e.target.value)}>
          <option  style={{backgroundColor: "#cafccc"}} value="">Select crop</option>
          {crops.map((c, index) => (
            <option key={index} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select value={state} onChange={(e) => setState(e.target.value)}>
          <option style={{backgroundColor: "#cafccc"}} value="">Select state</option>
          {indianStates.map((s, idx) => (
            <option key={idx} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button
          onClick={handlePredict}
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2e7d32",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {loading ? "Predicting..." : "Predict Price"}
        </button>
      </div>

      {/* 🔵 Show entries in a table */}
      {entries.length > 0 && (
        <div className="entries-table" style={{ marginTop: "30px" }}>
          <h2>📈 Price Prediction History</h2>
          <table
            className="table table-striped"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #ccc",
            }}
          >
            <thead style={{ backgroundColor: "#f2f2f2" }}>
              <tr>
                <th>#</th>
                <th>Crop</th>
                <th>Price (₹/Quintal)</th>
                <th>State</th>
                
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr
                  key={index}
                  style={
                    highlightedRow &&
                    entry.crop === highlightedRow.crop &&
                    entry.state === highlightedRow.state
                      ? {
                          background: "linear-gradient(135deg, #f7f0d2 0%, #e8f5e8 50%, #d4f1d4 100%)",
                          transition: "0.4s ease",
                        }
                      : {}
                  }
                >
                  <td style={{ textAlign: "center" }}>{index + 1}</td>
                  <td>{entry.crop}</td>
                  <td>₹ {entry.price}</td>
                  <td>{entry.state}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
  <div className="modal-overlay">
    <div className="modal-box modern">

      <h2 className="modal-title">🌾 Price Insight</h2>

      <div className="price-highlight">
        ₹ {predictedPrice}
      </div>

      <p className="price-subtext">
        Estimated market price for <b>{crop}</b> in <b>{state}</b>
      </p>

      <div className="price-tag">
        📈 Good Market Trend
      </div>

      <button onClick={() => setShowModal(false)}>
        Got it 👍
      </button>

    </div>
  </div>
)}
    </div>
  );
}

export default PricePrediction;