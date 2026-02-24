import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

const indianStates = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
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
  // const [predictedPrice, setPredictedPrice] = useState(null);
  // const [predictionDate, setPredictionDate] = useState("");

  const handlePredict = async () => {
    if (!crop || !state) {
      alert("⚠️ Please enter crop name and select a state.");
      return;
    }

    try {
     const fakePrice = Math.floor(Math.random() * 300 + 2800);
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/crops/add-price",
        {
          cropName: crop,
          price: fakePrice,
          state: state,
        }
      );
      console.log("✅ POST Success:", response.data);
      window.location.reload(); // ✅ This will reload the component and table

      // Clear form inputs
      setCrop("");
      setState("");

      // Fetch updated list from DB
      await fetchEntries();
    } catch (err) {
      console.error("❌ Error saving prediction:", err);
      alert("Prediction failed.");
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
        date: new Date(entry.created_at).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
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
    <div className="price-prediction-page" style={{ padding: "20px" }}>
      <h1>🌾 Price Prediction</h1>

      <div className="prediction-form" style={{ marginBottom: "20px" }}>
        <input
          className="crop-input"
          type="text"
          placeholder="Enter crop name (e.g., Wheat)"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
        />

        <select value={state} onChange={(e) => setState(e.target.value)}>
          <option value="">Select state</option>
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
            backgroundColor: "#4169e1",
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
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index}>
                  <td style={{ textAlign: "center" }}>{index + 1}</td>
                  <td>{entry.crop}</td>
                  <td>₹ {entry.price}</td>
                  <td>{entry.state}</td>
                  <td>{entry.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PricePrediction;