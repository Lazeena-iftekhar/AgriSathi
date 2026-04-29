import { useState } from "react";
import axios from "axios";
import "./ShopFinder.css";
import { useLoadScript } from "@react-google-maps/api";
import { useRef,useEffect } from "react";
import { TiLocation } from "react-icons/ti";
import { GiPathDistance } from "react-icons/gi";
import { FaMapLocationDot } from "react-icons/fa6";
function ShopFinder() {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [shops, setShops] = useState([]);
  //aouto complete
 const { isLoaded } = useLoadScript({
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  libraries: ["places"],
});
const inputRef = useRef(null);

  const searchShops = async () => {
    if (!location || !type) {
      alert("Enter location and shop type");
      return;
    }

    // const API_KEY =process.env.GOOGLE_API_KEY;
    const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${type}+shop+in+${location}&key=${API_KEY}`;

    try {
      // const res = await axios.get(url);
      // setShops(res.data.results);
      const res = await axios.get(
              "http://localhost:5000/api/shops",
     {
   params: {
    location,
    type
  }
}
);

setShops(res.data);
    } catch (err) {
      console.log(err);
    }
  };

useEffect(() => {
  if (!isLoaded || !inputRef.current) return;

  const autocomplete = new window.google.maps.places.Autocomplete(
    inputRef.current,
    {
      componentRestrictions: { country: "in" }, // optional: restrict to India
    }
  );

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (place.formatted_address) {
      setLocation(place.formatted_address);
    }
  });

}, [isLoaded]);

return (
  <div className="shopfinder-wrapper">

    <div className="shopfinder-card">

      <div className="shopfinder-header">
        🌾 Nearby Agricultural Shop Finder
      </div>

      <div className="shopfinder-body">

        <div className="shopfinder-search">

          <input
            type="text"
             ref={inputRef}
            placeholder="Enter Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
           defaultValue={location}
            className="shopfinder-input"
          />

          <select
            onChange={(e) => setType(e.target.value)}
            className="shopfinder-select"
          >
            <option>Select Shop Type</option>
            <option value="seed">Seed Shop</option>
            <option value="fertilizer">Fertilizer Shop</option>
            <option value="pesticide">Pesticide Shop</option>
            <option value="agriculture">Agriculture Shop</option>
          </select>

          <button
            onClick={searchShops}
            className="shopfinder-button"
          >
            Search
          </button>

        </div>

        <div className="shop-grid">

          {shops.map((shop, index) => (
            <div key={index} className="shop-card">

              <h3>{shop.name}</h3>

              <p><TiLocation color="red" size={20}/> Address: {shop.formatted_address}</p>

              <p>⭐ Rating: {shop.rating || "N/A"}</p>

              <p>⚠️Status: {shop.business_status || "Unknown"}</p>
              <p><GiPathDistance color="red" size={24}/>Distance: {shop.distance ? shop.distance.toFixed(1) + " km away" : ""}</p>

              <a
  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    shop.name + " " + shop.formatted_address
  )}`}
  target="_blank"
  rel="noopener noreferrer"
  className="map-btn"
>
  <FaMapLocationDot color="white" size={20}/>
    View in Google Maps
</a>

            </div>
          ))}

        </div>

      </div>

    </div>

  </div>
);
}

export default ShopFinder;