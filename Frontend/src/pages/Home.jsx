

import farmerImg from "../assets/farmerImg.jpg";
import aboutusImg from "../assets/aboutusImg.jpg";
import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

function Home() {
  const [response, setResponse] = useState("");

  const handleClick = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/test");
      setResponse(res.data.message);
    } catch (err) {
      setResponse("Error calling API");
      console.error(err);
    }
  };

  return (
    <>
      <div className="div main_content1">

        {/* TOP BACKGROUND */}
        <div className="top-bg"></div>

        <h1>Welcome to AgriSathi</h1>

        {/* FEATURE CARDS */}
        <div className="slideshow-wrapper">
          <div className="slideshow-track">

            <div className="element">
              <img src="https://cdn-icons-png.flaticon.com/128/14148/14148453.png" />
              <h3>AI Crop Suggestion</h3>
            </div>

            <div className="element">
              <img src="https://cdn-icons-png.flaticon.com/128/12538/12538865.png" />
              <h3>Disease</h3>
              <h4>Detection</h4>
            </div>

            <div className="element">
              <img src="https://cdn-icons-png.flaticon.com/128/2769/2769441.png" />
              <h3>Regional Language</h3>
            </div>

            <div className="element">
              <img src={farmerImg} alt="Farmer" />
            </div>

            <div className="element">
              <img src="https://cdn-icons-png.flaticon.com/128/10831/10831334.png" />
              <h3>Crop Price</h3>
              <h4>Prediction</h4>
            </div>

            <div className="element">
              <img src="https://cdn-icons-png.flaticon.com/128/18525/18525350.png" />
              <h3>Govt</h3>
              <h4>Subsidies</h4>
            </div>

            <div className="element">
              <img src="https://cdn-icons-png.flaticon.com/128/6815/6815546.png" />
              <h3>Marketplace</h3>
              <h4>for Farmers</h4>
            </div>

          </div>
        </div>


        {/* ABOUT AGRISATHI SECTION */}
        <h1>About AgriSathi</h1>

        <div className="about-agrisathi">

          {/* LEFT IMAGE */}
          <div className="about-image">
            <img src={aboutusImg} alt="Farmer working in field" />
          </div>

          {/* RIGHT TEXT BOX */}
          <div className="about-box">

            <h2>Empowering Farmers with Technology</h2>

            <p>
              AgriSathi is an AI-powered digital platform designed to assist
              farmers in making smarter agricultural decisions. The platform
              combines modern technology with farming knowledge to help farmers
              improve productivity and profitability.
            </p>

            <p>
              With AgriSathi, farmers can detect crop diseases using AI,
              receive crop recommendations based on soil conditions, predict
              crop prices in advance, and access government schemes and
              subsidies easily.
            </p>

            <p>
              The platform also includes a regional language chatbot that helps
              farmers get answers to their farming queries quickly. Our goal is
              to make farming more efficient, informed, and accessible for
              every farmer.
            </p>

          </div>

        </div>


        {/* BOTTOM BACKGROUND */}
        <div className="bottom-bg"></div>

      </div>
    </>
  );
}

export default Home;








