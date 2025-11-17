import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaVideo, FaArrowLeft } from "react-icons/fa";

function AdminCCTV() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/", { replace: true });
  }, [navigate]);

  // Hover-enabled NavButton
  const NavButton = ({ text, path, active }) => {
    const navigate = useNavigate();
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
    <div className="admin-cctv-page" style={{ padding: "30px", textAlign: "center" }}>
      {/* Navbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <FaVideo style={{ fontSize: "28px", marginRight: "10px", color: "#2b2b2b" }} />
          <h1 style={{ fontSize: "28px", margin: 0 }}>CCTV</h1>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <NavButton text="Dashboard" path="/admin-dashboard" />
          <NavButton text="CCTV" path="/adminCCTV" active />
          <NavButton text="Reports" path="/admin-reports" />
          <NavButton text="Layout" path="/admin-layout"  />
          <button onClick={handleLogout} style={logoutBtnStyle}>
            Logout
          </button>
        </div>
      </div>

      <h1 style={{ marginBottom: "20px" }}>
        <FaVideo /> CCTV Monitoring
      </h1>

      {/* Placeholder video box */}
      <div
        style={{
          width: "80%",
          maxWidth: "900px",
          height: "500px",
          margin: "0 auto",
          backgroundColor: "#000",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          borderRadius: "12px",
        }}
      >
        CCTV Feed Placeholder
      </div>

      <p style={{ marginTop: "15px", color: "#555" }}>
        The live CCTV feed will appear here once integrated.
      </p>

      {/* Back to Dashboard Button */}
      <button
        onClick={() => navigate("/admin-dashboard")}
        style={{
          marginTop: "30px",
          padding: "12px 25px",
          fontSize: "16px",
          fontWeight: "600",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#2b2b2b",
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <FaArrowLeft /> Back to Dashboard
      </button>
    </div>
  );
}

export default AdminCCTV;
