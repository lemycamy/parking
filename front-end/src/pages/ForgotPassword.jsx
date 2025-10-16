import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/App.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    // Simulate backend request
    if (email) {
      setMessage("📩 Password reset link has been sent to your email!");
    } else {
      setMessage("⚠️ Please enter a valid email.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2>Reset Password</h2>
        <p className="subtitle">Enter your email to reset your password</p>

        <form className="login-form" onSubmit={handleReset}>
          <input
            type="email"
            placeholder="Enter Registered Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">Request Reset Link</button>

          <button
            type="button"
            className="forgot-btn"
            onClick={() => navigate("/")}
          >
            ← Back to Login
          </button>
        </form>

        {message && <div className="response-tab success">{message}</div>}
      </div>
    </div>
  );
}

export default ForgotPassword;
