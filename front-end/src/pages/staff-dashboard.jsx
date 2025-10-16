import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaClock, FaArrowRight, FaSignOutAlt } from "react-icons/fa";
import logo from "../images/ezpark.png"; // ✅ Import your logo
import "../css/Staff.css";

function StaffDashboard() {
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
      {/* ✅ Topbar reused here */}
      <div className="ez-topbar">
        <div className="ez-topbar-inner">
          <img src={logo} alt="EZPark Logo" className="ez-logo" />
        </div>
      </div>

      <div className="dashboard-container">
        <h1 className="dashboard-title">Welcome Back</h1>

        <div className="dashboard-grid">
          <button className="dashboard-btn">
            <FaClock /> Time - In
          </button>

          <button className="dashboard-btn">
            <FaArrowRight /> Check - Out
          </button>

          <button className="dashboard-btn logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Log out
          </button>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;
