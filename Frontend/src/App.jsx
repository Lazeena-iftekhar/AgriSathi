import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

import Chatbot from "./pages/Chatbot.jsx";
import CropPrediction from "./pages/CropPrediction.jsx";
import Government from "./pages/Government.jsx";
import PricePridiction from "./pages/PricePridiction.jsx";
import CropDisease from "./pages/CropDisease.jsx";
import Contact from "./pages/Contact.jsx";
import Home from "./pages/Home.jsx";
import BuyerLogin from "./pages/BuyerLogin.jsx";
import AccessGuard from "./components/AccessGuard.jsx";
import NotAuthorized from "./pages/NotAuthorized.jsx";

function App() {
const [isBuyer, setIsBuyer] = useState(() => {
return localStorage.getItem("isBuyer") === "true";
});

return ( <BrowserRouter>

  {/* TOP NAVBAR */}
  <nav
    className="navbar navbar-expand-lg fixed-top"
    
    style={{ backgroundColor: "#1a4d3a" }}
  >
    <div className="container-fluid">

      <Link className="navbar-brand text-white fw-bold" to="/">
        🌾 AgriSathi
      </Link>

      <button
        className="navbar-toggler bg-light"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">

          <li className="nav-item">
            <Link className="nav-link text-white" to="/">
              🏠 Home
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link text-white" to="/CropPrediction">
              📊 Crop Prediction
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link text-white" to="/PricePridiction">
              💰 Price Prediction
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link text-white" to="/CropDisease">
              🦠 Disease Detection
            </Link>
          </li>


          <li className="nav-item">
            <Link className="nav-link text-white" to="/Chatbot">
              🤖 AI Assistant
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link text-white" to="/Government">
              🏛 Government Subsidy
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link text-white" to="/Contact">
              📞 Contact
            </Link>
          </li>

        </ul>
      </div>
    </div>
  </nav>

  {/* MAIN CONTENT */}
  <div className="main_content">

    <Routes>


      <Route
        path="/PricePridiction"
        element={
          <AccessGuard>
            <PricePridiction />
          </AccessGuard>
        }
      />

      <Route
        path="/Chatbot"
        element={
          <AccessGuard>
            <Chatbot />
          </AccessGuard>
        }
      />

      <Route
        path="/CropPrediction"
        element={
          <AccessGuard>
            <CropPrediction />
          </AccessGuard>
        }
      />

      <Route
        path="/CropDisease"
        element={
          <AccessGuard>
            <CropDisease />
          </AccessGuard>
        }
      />

      <Route path="/Government" element={<Government />} />

      <Route path="/Contact" element={<Contact />} />

      <Route path="/" element={<Home />} />

      <Route path="/buyer" element={<BuyerLogin />} />

      <Route path="/not-authorized" element={<NotAuthorized />} />

    </Routes>

  </div>

</BrowserRouter>

);
}

export default App;