// AdminLayout.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();

  // Hover-enabled NavButton
  const NavButton = ({ text, path, active }) => {
    const [hover, setHover] = useState(false);

    const style = {
      padding: "8px 15px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      backgroundColor: active || hover ? "#2b2b2b" : "#e0e0e0",
      color: active || hover ? "#fff" : "#333",
      fontWeight: active ? "bold" : "normal",
      transition: "0.2s",
      whiteSpace: "nowrap",
    };

    return (
      <button
        onClick={() => navigate(path)}
        style={style}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {text}
      </button>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  const logoutBtnStyle = {
    padding: "8px 15px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#e0e0e0",
    color: "#333",
    fontWeight: "normal",
  };

  return (
    <div style={{ padding: "30px", minHeight: "100vh", backgroundColor: "#f9f9f9", fontFamily: "Arial, sans-serif" }}>
      {/* Navbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
        <h1 style={{ fontSize: "28px", margin: 0 }}>Layout</h1>
        <div style={{ display: "flex", gap: "15px" }}>
          <NavButton text="Dashboard" path="/admin-dashboard" />
          <NavButton text="CCTV" path="/adminCCTV" />
          <NavButton text="Reports" path="/admin-reports" />
          <NavButton text="Layout" path="/admin-layout" active />
          <button onClick={handleLogout} style={logoutBtnStyle}>
            Logout
          </button>
        </div>
      </div>

      {/* Work in Progress Content */}
      <div
        style={{
          width: "100%",
          height: "400px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          color: "#555",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        Work in Progress
      </div>
    </div>
  );
};

export default AdminLayout;
