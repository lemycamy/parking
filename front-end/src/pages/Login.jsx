import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/App.css";
import logo from "../images/ezpark.png";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://parking-zlmz.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      // Backend sends "✅ Login successful" + token + user object
      if (response.ok) {
        setMessage("✅ Login Successful!");
        setShowModal(true);

        // Save token and user in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect after 1 second based on role
        setTimeout(() => {
          const role = data.user.role;
          if (role === "admin") navigate("/admin-dashboard");
          else if (role === "staff") navigate("/staff-dashboard");
          else navigate("/user-dashboard");
        }, 1000);
      } else {
        setMessage(data.message || "❌ Invalid Credentials");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("⚠️ Server Error. Try again later.");
      setShowModal(true);
    }
  };
  return (
    <div className="ez-login-page">
      <div className="ez-topbar">
        <div className="ez-topbar-inner">
          <img src={logo} alt="EZPark Logo" className="ez-logo" />
        </div>
      </div>

      <div className="ez-main">
        <div className="ez-lefttext">
          <h1>Welcome to <br /> EZ Park System</h1>
        </div>

        <div className="ez-card">
          <form className="ez-form" onSubmit={handleLogin}>
            <label className="ez-label">Username</label>
            <input
              type="text"
              className="ez-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label className="ez-label">Password</label>
            <input
              type="password"
              className="ez-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="forgot-btn"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>

            <button type="submit" className="ez-login-btn">LOGIN</button>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="ez-modal-overlay">
          <div className="ez-modal">
            <p>{message}</p>
            <button onClick={() => setShowModal(false)} className="ez-close">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
