import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Chatbot from "./pages/Chatbot.jsx";
import CropPrediction from "./pages/CropPrediction.jsx";
import Government from "./pages/Government.jsx";
import ShopFinder from "./pages/ShopFinder.jsx";
import PricePridiction from "./pages/PricePridiction.jsx";
import CropDisease from "./pages/CropDisease.jsx";
import Contact from "./pages/Contact.jsx";
import Home from "./pages/Home.jsx";
import BuyerLogin from "./pages/BuyerLogin.jsx";
import AccessGuard from "./components/AccessGuard.jsx";
import NotAuthorized from "./pages/NotAuthorized.jsx";
// import { useLocation } from "react-router-dom";

function App() {
  //   useEffect(() => {
  //   const buyerFlag = localStorage.getItem("isBuyer");
  //   setIsBuyer(buyerFlag === "true");
  // }, []);
  const [isBuyer, setIsBuyer] = useState(() => {
    return localStorage.getItem("isBuyer") === "true";
  });
  // const location = useLocation();

  return (
    <>
      <BrowserRouter>
        <div className="home_page">
          <div className="nav_bar">
            <div
              className="d-flex flex-column flex-shrink-0 p-3 text-white"
              style={{
                width: "250px",
                height: "100vh",
                backgroundColor: "#1a4d3a",
              }}
            >
              <a
                href="/"
                className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
              >
                <span className="fs-4">🌾AgriSathi</span>
              </a>
              <hr />

              <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                  <div
                    style={{
                      backgroundColor:
                        location.pathname === "/" ? "#2d6b4f" : "transparent",
                      borderRadius: "8px",
                      margin: "2px 0",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (location.pathname !== "/") {
                        e.target.style.backgroundColor = "#25a463";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (location.pathname !== "/") {
                        e.target.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <a
                      href="/"
                      className="nav-link text-white"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 15px",
                      }}
                    >
                      🏠 Home
                    </a>
                  </div>
                </li>

                <li>
                  <div
                    style={{
                      backgroundColor:
                        location.pathname === "/CropPrediction"
                          ? "#2d6b4f"
                          : "transparent",
                      borderRadius: "8px",
                      margin: "2px 0",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (location.pathname !== "/CropPrediction") {
                        e.target.style.backgroundColor = "#25a463";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (location.pathname !== "/CropPrediction") {
                        e.target.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <a
                      href="/CropPrediction"
                      className="nav-link text-white"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 15px",
                      }}
                    >
                      📊 Crop Prediction
                    </a>
                  </div>
                </li>

              

                <li>
                  <div
                    style={{
                      backgroundColor:
                        location.pathname === "/PricePridiction"
                          ? "#2d6b4f"
                          : "transparent",
                      borderRadius: "8px",
                      margin: "2px 0",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (location.pathname !== "/PricePridiction") {
                        e.target.style.backgroundColor = "#25a463";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (location.pathname !== "/PricePridiction") {
                        e.target.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <a
                      href="/PricePridiction"
                      className="nav-link text-white"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 15px",
                      }}
                    >
                      💰 Price Prediction
                    </a>
                  </div>
                </li>

                 <li>
                  <div
                    style={{
                      backgroundColor:
                        location.pathname === "/CropDisease"
                          ? "#2d6b4f"
                          : "transparent",
                      borderRadius: "8px",
                      margin: "2px 0",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (location.pathname !== "/CropDisease") {
                        e.target.style.backgroundColor = "#25a463";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (location.pathname !== "/CropDisease") {
                        e.target.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <a
                      href="/CropDisease"
                      className="nav-link text-white"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 15px",
                      }}
                    >
                      🦠 Disease Detection
                    </a>
                  </div>
                </li>

                <li>
                  <div
                    style={{
                      backgroundColor:
                        location.pathname === "/ShopFinder"
                          ? "#2d6b4f"
                          : "transparent",
                      borderRadius: "8px",
                      margin: "2px 0",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (location.pathname !== "/ShopFinder") {
                        e.target.style.backgroundColor = "#25a463";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (location.pathname !== "/ShopFinder") {
                        e.target.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <a
                      href="/ShopFinder"
                      className="nav-link text-white"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 15px",
                      }}
                    >
                    🏪 
                    
                   Nearby ShopFinder
                    </a>
                  </div>
                </li>

              

                <li>
                  <div
                    style={{
                      backgroundColor:
                        location.pathname === "/Chatbot"
                          ? "#2d6b4f"
                          : "transparent",
                      borderRadius: "8px",
                      margin: "2px 0",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (location.pathname !== "/Chatbot") {
                        e.target.style.backgroundColor = "#25a463";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (location.pathname !== "/Chatbot") {
                        e.target.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <a
                      href="/Chatbot"
                      className="nav-link text-white"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 15px",
                      }}
                    >
                      🤖 AgriSathi AI Assistant
                    </a>
                  </div>
                </li>

                <li>
                  <div
                    style={{
                      backgroundColor:
                        location.pathname === "/Government"
                          ? "#2d6b4f"
                          : "transparent",
                      borderRadius: "8px",
                      margin: "2px 0",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (location.pathname !== "/Government") {
                        e.target.style.backgroundColor = "#25a463";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (location.pathname !== "/Government") {
                        e.target.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <a
                      href="/Government"
                      className="nav-link text-white"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 15px",
                      }}
                    >
                      🏛 Government Subsidies
                    </a>
                  </div>
                </li>
              </ul>

              <hr />
              <div></div>

              <div
                style={{
                  backgroundColor:
                    location.pathname === "/Contact"
                      ? "#2d6b4f"
                      : "transparent",
                  borderRadius: "8px",
                  margin: "2px 0",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== "/Contact") {
                    e.target.style.backgroundColor = "#25a463";
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== "/Contact") {
                    e.target.style.backgroundColor = "transparent";
                  }
                }}
              >
                <a
                  href="/Contact"
                  className="nav-link text-white"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 15px",
                  }}
                >
                  📞 Contact Us
                </a>
              </div>
            </div>
          </div>

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
               <Route path="/ShopFinder" element={<ShopFinder />} />
              <Route path="/Government" element={<Government />} />
              <Route path="/Contact" element={<Contact />} />
              <Route path="/" element={<Home />} />
              <Route path="/buyer" element={<BuyerLogin />}></Route>
              <Route path="/not-authorized" element={<NotAuthorized />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;