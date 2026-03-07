import { useState } from "react";
import axios from "axios";
import "./ShopFinder.css";
function ShopFinder() {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [shops, setShops] = useState([]);

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

//   return (
//  <div className="bg-white ">
// <div className="rounded-lg shadow-md w-full min-h-[calc(100vh-60px)]">

//       {/* <h2>Nearby Agricultural Shop Finder</h2> */}
//  <div className="bg-green-500 text-black px-5 py-3 rounded-md font-semibold text-lg mb-6">
//   🌾 Nearby Agricultural Shop Finder
// </div>
  

//       {/* <input
//         type="text"
//         placeholder="Enter Location"
//         value={location}
//         onChange={(e) => setLocation(e.target.value)}
//       />

//       <select onChange={(e) => setType(e.target.value)}>
//         <option>Select Shop Type</option>
//         <option value="seed">Seed Shop</option>
//         <option value="fertilizer">Fertilizer Shop</option>
//         <option value="pesticide">Pesticide Shop</option>
//         <option value="agriculture">Agriculture Shop</option>
//       </select> */}


//       {/* <button onClick={searchShops}>Search</button> */}

//       <div className="flex gap-3 mb-6">

// <input
//   type="text"
//   placeholder="Enter Location"
//   value={location}
//   onChange={(e) => setLocation(e.target.value)}
//   className="border border-gray-300 rounded-md px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-green-500"
// />

// <select
//   onChange={(e) => setType(e.target.value)}
//   className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
// >
//   <option>Select Shop Type</option>
//   <option value="seed">Seed Shop</option>
//   <option value="fertilizer">Fertilizer Shop</option>
//   <option value="pesticide">Pesticide Shop</option>
//   <option value="agriculture">Agriculture Shop</option>
// </select>

// <button
//   onClick={searchShops}
//   className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md transition"
// >
//   Search
// </button>

// </div>

//       {/* <div className="shop-grid"> */}
// <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {shops.map((shop, index) => (
//           // <div className="shop-card" key={index}>
// <div
//   key={index}
//   className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
// >
//             {/* <h3>{shop.name}</h3>

//             <p>{shop.formatted_address}</p>

//             <p>⭐ Rating: {shop.rating || "N/A"}</p>

//             <p>Status: {shop.business_status}</p> */}

// <h3 className="text-lg font-semibold text-gray-800 mb-2">
//   {shop.name}
// </h3>

// <p className="text-sm text-gray-600 mb-1">
//   📍 {shop.formatted_address}
// </p>

// <p className="text-sm text-yellow-600 mb-1">
//   ⭐ Rating: {shop.rating || "N/A"}
// </p>

// <p className="text-sm text-gray-500">
//   Status: {shop.business_status || "Unknown"}
// </p>
//           </div>
//         ))}

//       </div>
//     </div>
   

//     </div>
//   );


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
            placeholder="Enter Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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

              <p>📍 {shop.formatted_address}</p>

              <p>⭐ Rating: {shop.rating || "N/A"}</p>

              <p>Status: {shop.business_status || "Unknown"}</p>

              <a
  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    shop.name + " " + shop.formatted_address
  )}`}
  target="_blank"
  rel="noopener noreferrer"
  className="map-btn"
>
   view in Google Maps
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