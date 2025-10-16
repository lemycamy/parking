import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaVideo, FaThLarge, FaFileAlt, FaSignOutAlt } from "react-icons/fa";
import logo from "../images/ezpark.png"; // ✅ Import your logo
import "../css/Admin.css";

function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  return (
    <div className="ez-dashboard-page">
      {/* ✅ Reuse the same topbar from login */}
      <div className="ez-topbar">
        <div className="ez-topbar-inner">
          <img src={logo} alt="EZPark Logo" className="ez-logo" />
        </div>
      </div>

      <div className="dashboard-container">
  <div className="dashboard-card">
    <h1 className="dashboard-title">Welcome Back</h1>

    <div className="dashboard-grid">
      <button className="dashboard-btn">
        <FaVideo /> CCTV
      </button>

      <button className="dashboard-btn">
        <FaThLarge /> Layout
      </button>

      <button className="dashboard-btn">
        <FaFileAlt /> Report
      </button>

      <button className="dashboard-btn logout-btn" onClick={handleLogout}>
        <FaSignOutAlt /> Log out
      </button>
    </div>
  </div>
</div>
</div>
  );
}

export default AdminDashboard;
