import { useState } from "react";
import { useNavigate } from "react-router-dom";

function BuyerLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (username === "buyer123@gmail.com" && password === "123") {
      localStorage.setItem("isBuyer", "true");
      navigate("/marketplace");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f0fdf4, #e8f5e9)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1
        style={{
          color: "#2d5a2d",
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: "30px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        🛒 Buyer's Login
      </h1>

      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "35px 30px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          border: "1.5px solid #cde9cd",
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "14px 18px",
            fontSize: "1rem",
            border: "2px solid #d6e9d6",
            borderRadius: "10px",
            backgroundColor: "#f9fdf9",
            color: "#2d5a2d",
            transition: "0.25s ease",
            fontFamily: "inherit",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#66bb6a";
            e.target.style.backgroundColor = "#ffffff";
            e.target.style.boxShadow = "0 0 0 3px rgba(102, 187, 106, 0.2)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#d6e9d6";
            e.target.style.backgroundColor = "#f9fdf9";
            e.target.style.boxShadow = "none";
          }}
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "14px 18px",
            fontSize: "1rem",
            border: "2px solid #d6e9d6",
            borderRadius: "10px",
            backgroundColor: "#f9fdf9",
            color: "#2d5a2d",
            transition: "0.25s ease",
            fontFamily: "inherit",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#66bb6a";
            e.target.style.backgroundColor = "#ffffff";
            e.target.style.boxShadow = "0 0 0 3px rgba(102, 187, 106, 0.2)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#d6e9d6";
            e.target.style.backgroundColor = "#f9fdf9";
            e.target.style.boxShadow = "none";
          }}
        />

        {/* Login Button */}
        <button
          onClick={handleSubmit}
          style={{
            padding: "14px",
            fontSize: "1rem",
            fontWeight: "600",
            background: "linear-gradient(to right, #4caf50, #66bb6a)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            transition: "all 0.25s ease",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 18px rgba(76, 175, 80, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          Login
        </button>

        {/* Credentials Info */}
        <div
          style={{
            backgroundColor: "#e8f5e9",
            border: "1px solid #c8e6c9",
            padding: "15px",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              margin: "0 0 10px 0",
              fontSize: "1rem",
              fontWeight: "600",
              color: "#2e7d32",
            }}
          >
            Login Credentials
          </h3>
          <p
            style={{
              fontFamily: "monospace",
              color: "#388e3c",
              background: "#ffffffa6",
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #c8e6c9",
              margin: "0",
            }}
          >
            buyer123@gmail.com / 123
          </p>
        </div>
      </div>
    </div>
  );
}

export default BuyerLogin;
