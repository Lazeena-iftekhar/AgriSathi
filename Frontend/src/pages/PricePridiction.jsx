import React, { useState, useEffect } from "react";
import axios from "axios";
import { IndianRupee } from "lucide-react";
import "../App.css";
import PriceComparisonChart from "./PriceComparisonChart";

function PricePrediction() {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [market, setMarket] = useState("");
  const [crop, setCrop] = useState("");

  const [states, setStates] = useState([]);
  const [districtsMap, setDistrictsMap] = useState({});
  const [marketsMap, setMarketsMap] = useState({});
  const [stateCropMap, setStateCropMap] = useState({});

  const [districts, setDistricts] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [crops, setCrops] = useState([]);

  const [loading, setLoading] = useState(false);
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const cached = localStorage.getItem("agri-options");
    if (cached) {
      const data = JSON.parse(cached);
      setStates(data.states || []);
      setDistrictsMap(data.districts || {});
      setMarketsMap(data.markets || {});
      setStateCropMap(data.stateCropMap || {});
      return;
    }

    axios.get("http://localhost:5001/get-options")
      .then(res => {
        const data = res.data;
        localStorage.setItem("agri-options", JSON.stringify(data));
        setStates(data.states || []);
        setDistrictsMap(data.districts || {});
        setMarketsMap(data.markets || {});
        setStateCropMap(data.stateCropMap || {});
      })
      .catch(err => console.error("Error loading options:", err));
  }, []);

  useEffect(() => {
    if (state) {
      setDistricts(districtsMap[state] || []);
      setCrops(stateCropMap[state] || []);
    } else {
      setDistricts([]);
      setCrops([]);
    }
    setDistrict("");
    setMarket("");
    setCrop("");
  }, [state, districtsMap, stateCropMap]);

  useEffect(() => {
    if (district) {
      setMarkets(marketsMap[district] || []);
    } else {
      setMarkets([]);
    }
    setMarket("");
  }, [district, marketsMap]);

  const handlePredict = async () => {
    if (!state || !crop) {
      setError("Please select state and crop parameters context.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/crops/add-price", {
        cropName: crop,
        state,
        district: district || "",
        market: market || "",
      });

      setPredictedPrice(res.data.predicted_price);
      setShowModal(true);
      fetchHistory();
    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Price engine inference failure.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/crops/history");
      setHistory(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const handleClearHistory = async () => {
    const confirmDelete = window.confirm("Clear all prediction history?");
    if (!confirmDelete) return;

    try {
      await axios.delete("http://localhost:5000/api/crops/history");
      setHistory([]);
    } catch (err) {
      console.error("Error clearing history:", err);
    }
  };

  return (
    <div className="price-prediction-page">
      <div className="header-section">
        <h1 className="main-title">Price Prediction <IndianRupee size={34} className="title-icon" /></h1>
        <h3 className="subtitle">Select State → District → Market → Crop</h3>
      </div>

      <div className="prediction-form">
        <select value={state} onChange={(e) => setState(e.target.value)}>
          <option value="">Select State</option>
          {states.map((s, i) => <option key={i} value={s}>{s}</option>)}
        </select>

        <select value={district} onChange={(e) => setDistrict(e.target.value)} disabled={!state}>
          <option value="">Select District (optional)</option>
          {districts.map((d, i) => <option key={i} value={d}>{d}</option>)}
        </select>

        <select value={market} onChange={(e) => setMarket(e.target.value)} disabled={!district}>
          <option value="">Select Market (optional)</option>
          {markets.map((m, i) => <option key={i} value={m}>{m}</option>)}
        </select>

        <select value={crop} onChange={(e) => setCrop(e.target.value)} disabled={!state}>
          <option value="">Select Crop</option>
          {crops.map((c, i) => <option key={i} value={c}>{c}</option>)}
        </select>

        <button onClick={handlePredict} disabled={loading || !state || !crop}>
          {loading ? "Predicting..." : "Predict Price"}
        </button>
      </div>

      {error && <div className="error-message" style={{color: "red", textAlign:"center", margin:"10px"}} >❌ {error}</div>}

      <div className="bottom-section">
        <div className="history-card-box">
          <div className="history-header">
            <h2>📜 Prediction History</h2>
            <button className="clear-btn" onClick={handleClearHistory} disabled={history.length === 0}>Clear</button>
          </div>

          <div className="table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Crop</th>
                  <th>State</th>
                  <th>District</th>
                  <th>Market</th>
                  <th>Price (₹)</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={index}>
                    <td>{item.crop_name}</td>
                    <td>{item.state}</td>
                    <td>{item.district === "Unknown" ? "N/A" : item.district || "-"}</td>
                    <td>{item.market === "Unknown" ? "N/A" : item.market || "-"}</td>
                    <td>₹ {item.price}</td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr><td colSpan="5" style={{textAlign:"center"}}>No execution history logs tracked.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="graph-card-box">
          <h3>📊 AgriSathi vs Other Models Comparison</h3>
          <PriceComparisonChart />
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box modern">
            <h2>🌾 Price Insight</h2>
            <div className="price-highlight">₹ {predictedPrice}/Quintal</div>
            <p>
              Estimated price for <b>{crop}</b> in{" "}
              <b>{market || ""}, {district || ""}, {state}</b>
            </p>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PricePrediction;