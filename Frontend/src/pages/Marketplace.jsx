import "../App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const states = [
  "Select state",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
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

function MarketPlace() {
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [state, setState] = useState(states[0]);
  const [entries, setEntries] = useState([]);
  const [filterState, setFilterState] = useState(states[0]);
  const [isBuyer, setIsBuyer] = useState(
    localStorage.getItem("isBuyer") === "true"
  );

  const fetchEntries = async (selectedState = states[0]) => {
    try {
      let url = "http://localhost:5000/api/marketplace/all-products";
      if (selectedState && selectedState !== "Select state") {
        url += `?state=${encodeURIComponent(selectedState)}`;
      }
      const res = await axios.get(url);
      setEntries(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("❌ Failed to fetch products.");
    }
  };

  useEffect(() => {
    fetchEntries(filterState);
  }, [filterState]);

  const handleAdd = async () => {
    if (!product || !price || state === "Select state") {
      toast.warn("⚠ Please fill all fields!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/marketplace/add-products", {
        product,
        price,
        state,
      });

      toast.success("✅ Product added successfully!");
      fetchEntries(filterState);
      setProduct("");
      setPrice("");
      setState(states[0]);
    } catch (err) {
      toast.error("❌ Failed to add product.");
    }
  };

  const handleBuy = (entry) => {
    toast.success(`🛒 Buying ${entry.product} from ${entry.state}`);
  };

  return (
    <div className="main_content1 marketplace">
      <h2>🧺 Farmer Product Listing</h2>

      <div className="form-container">
        <input
          type="text"
          placeholder="Product Name"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price (₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <select value={state} onChange={(e) => setState(e.target.value)}>
          {states.map((s, idx) => (
            <option key={idx} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button onClick={handleAdd}>List Product</button>

        {/* Buyer Login / Logout buttons BELOW the form */}
        {!isBuyer && (
          <button
            onClick={() => (window.location.href = "/buyer")}
            className="buyer-login-btn"
          >
            Go to Buyer Login
          </button>
        )}
        {isBuyer && (
          <button
            onClick={() => {
              localStorage.removeItem("isBuyer");
              setIsBuyer(false);
              toast.info("👋 Logged out successfully.");
            }}
            className="logout-btn"
          >
            Logout
          </button>
        )}
      </div>

      <div className="filter-container" style={{ margin: "1em 0" }}>
        <label htmlFor="state-filter">Filter by State: </label>
        <select
          id="state-filter"
          value={filterState}
          onChange={(e) => setFilterState(e.target.value)}
        >
          {states.map((s, idx) => (
            <option key={idx} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Sl. No.</th>
            <th>Product</th>
            <th>Price (₹)</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{entry.product}</td>
              <td>{entry.price}</td>
              <td className="state-cell">
                {entry.state}
                {isBuyer && (
                  <button className="buy-btn" onClick={() => handleBuy(entry)}>
                    Buy
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default MarketPlace;