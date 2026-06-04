import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import "./App.css";

import Chatbot from "./pages/Chatbot.jsx";
import CropPrediction from "./pages/CropPrediction.jsx";
import Government from "./pages/Government.jsx";
import PricePridiction from "./pages/PricePridiction.jsx";
import CropDisease from "./pages/CropDisease.jsx";
import Contact from "./pages/Contact.jsx";
import Home from "./pages/Home.jsx";
import AccessGuard from "./components/AccessGuard.jsx";
import NotAuthorized from "./pages/NotAuthorized.jsx";
import ShopFinder from "./pages/ShopFinder.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">

        {/* SIDEBAR */}
        <div className="sidebar">

          <h3 className="logo">🌾 AgriSathi</h3>

          <div className="nav-links">
            <NavLink className="side-link" to="/">🏠 Home</NavLink>
            <NavLink className="side-link" to="/CropPrediction">📊 Crop Prediction</NavLink>
            <NavLink className="side-link" to="/PricePridiction">💰 Price Prediction</NavLink>
            <NavLink className="side-link" to="/CropDisease">🦠 Disease Detection</NavLink>
            <NavLink className="side-link" to="/Chatbot">🤖 AI Assistant</NavLink>
            <NavLink className="side-link" to="/ShopFinder">🏪 Shop Finder</NavLink>
            <NavLink className="side-link" to="/Government">🏛 Government Subsidy</NavLink>
          </div>

          <NavLink className="side-link contact-link" to="/Contact">
            📞 Contact
          </NavLink>

        </div>

        {/* MAIN */}
        <div className="main_content">
          <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/PricePridiction" element={<AccessGuard><PricePridiction /></AccessGuard>} />
            <Route path="/Chatbot" element={<AccessGuard><Chatbot /></AccessGuard>} />
            <Route path="/CropPrediction" element={<AccessGuard><CropPrediction /></AccessGuard>} />
            <Route path="/CropDisease" element={<AccessGuard><CropDisease /></AccessGuard>} />
            <Route path="/ShopFinder" element={<AccessGuard><ShopFinder /></AccessGuard>} />

            <Route path="/Government" element={<Government />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/not-authorized" element={<NotAuthorized />} />

          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;