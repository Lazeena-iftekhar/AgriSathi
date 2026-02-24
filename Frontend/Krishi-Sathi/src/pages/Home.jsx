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
        <h1>Welcome to Krishi Saathi</h1>
        {/* <div className="container-elements">
          <div className="element">
            <img src="https://cdn-icons-png.flaticon.com/128/14148/14148453.png"></img>
            <h3>Ai- Based</h3>
            <h4>Crop Sugesstion</h4>
          </div>
          <div className="element e2">
            <img src="https://cdn-icons-png.flaticon.com/128/12538/12538865.png"></img>
            <h3>disease</h3>
            <h4>detection</h4>
          </div>
          <div className="element">
            <img src="https://cdn-icons-png.flaticon.com/128/2769/2769441.png"></img>
            <h3>Regional language </h3>
            <h4>Chat bot</h4>
          </div>
          <div className="element e2">
            <img src="https://cdn-icons-png.flaticon.com/128/10831/10831334.png"></img>
            <h3>Ai- Based</h3>
            <h4>Crop Sugesstion</h4>
          </div>
          <div className="element">
            <img src="https://cdn-icons-png.flaticon.com/128/18525/18525350.png"></img>
            <h3>Ai- Based</h3>
            <h4>Crop Sugesstion</h4>
          </div>
          <div className="element e2">
            <img src="https://cdn-icons-png.flaticon.com/128/6815/6815546.png"></img>
            <h3>Ai- Based</h3>
            <h4>Crop Sugesstion</h4>
          </div>
        </div> */}
        <div className="slideshow-wrapper">
  <div className="slideshow-track">
    <div className="element">
      <img src="https://cdn-icons-png.flaticon.com/128/14148/14148453.png" />
      <h3>Ai-Based</h3>
      <h4>Crop Suggestion</h4>
    </div>
    <div className="element">
      <img src="https://cdn-icons-png.flaticon.com/128/12538/12538865.png" />
      <h3>Disease</h3>
      <h4>Detection</h4>
    </div>
    <div className="element">
      <img src="https://cdn-icons-png.flaticon.com/128/2769/2769441.png" />
      <h3>Regional Language</h3>
      <h4>Chat Bot</h4>
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

    {/* Duplicate for seamless infinite scroll */}
    <div className="element">
      <img src="https://cdn-icons-png.flaticon.com/128/14148/14148453.png" />
      <h3>Ai-Based</h3>
      <h4>Crop Suggestion</h4>
    </div>
    <div className="element">
      <img src="https://cdn-icons-png.flaticon.com/128/12538/12538865.png" />
      <h3>Disease</h3>
      <h4>Detection</h4>
    </div>
    <div className="element">
      <img src="https://cdn-icons-png.flaticon.com/128/2769/2769441.png" />
      <h3>Regional Language</h3>
      <h4>Chat Bot</h4>
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

        <h1>Our services</h1>
        <div className="Our-services">
          <div className="card mb-3 " style={{ maxWidth: "540px" }}>
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/14148/14148453.png"
                  className="img-fluid rounded-start"
                  alt="Icon"
                  width={100}
                  height={100}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  {<h5 className="card-title">Crop Disease detection</h5>}
                  <p className="card-text">
                    Identify plant desese from leaf image
                  </p>
                  <p className="card-text">
                    <small className="text-body-secondary"></small>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card mb-3" style={{ maxWidth: "540px" }}>
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/12538/12538865.png"
                  className="img-fluid rounded-start"
                  alt="Icon"
                  width={100}
                  height={100}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  {<h5 className="card-title">Crop Prediction </h5>}
                  <p className="card-text">Identify crop from the soil image</p>
                  <p className="card-text">
                    <small className="text-body-secondary"></small>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card mb-3" style={{ maxWidth: "540px" }}>
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/2769/2769441.png"
                  className="img-fluid rounded-start"
                  alt="Icon"
                  width={100}
                  height={100}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  {<h5 className="card-title">Predict Price</h5>}
                  <p className="card-text">
                    Predict the price of the crop based on the state and crop
                    name
                  </p>
                  <p className="card-text">
                    <small className="text-body-secondary"></small>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card mb-3" style={{ maxWidth: "540px" }}>
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/10831/10831334.png"
                  className="img-fluid rounded-start"
                  alt="Icon"
                  width={100}
                  height={100}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  {<h5 className="card-title">Market Place</h5>}
                  <p className="card-text">
                    One stop solution for farmers and buyers
                  </p>
                  <p className="card-text">
                    <small className="text-body-secondary"></small>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card mb-3" style={{ maxWidth: "540px" }}>
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/18525/18525350.png"
                  className="img-fluid rounded-start"
                  alt="Icon"
                  width={100}
                  height={100}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  {<h5 className="card-title">Chat Bot</h5>}
                  <p className="card-text">
                    Clear all the doubt related to farming and crops
                  </p>
                  <p className="card-text">
                    <small className="text-body-secondary"></small>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card mb-3" style={{ maxWidth: "540px" }}>
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/6815/6815546.png"
                  className="img-fluid rounded-start"
                  alt="Icon"
                  width={100}
                  height={100}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  {<h5 className="card-title">Government Scheme</h5>}
                  <p className="card-text">
                    Educate farmers about the government schemes and subsidies
                  </p>
                  <p className="card-text">
                    <small className="text-body-secondary"></small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Home;