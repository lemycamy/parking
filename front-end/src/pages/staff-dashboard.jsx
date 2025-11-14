import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaClock, FaArrowRight, FaSignOutAlt } from "react-icons/fa";
import logo from "../images/ezpark.png";
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
    <div className="staff-ez-dashboard-page">
      {/* Topbar */}
      <div className="staff-ez-topbar">
        <div className="staff-ez-topbar-inner">
          <img src={logo} alt="EZPark Logo" className="staff-ez-logo" />
        </div>
      </div>

      <div className="staff-dashboard-container">
        <h1 className="staff-dashboard-title">Welcome Back</h1>

        <div className="staff-dashboard-grid">
          <button className="staff-dashboard-btn">
            <FaClock /> Time - In
          </button>

          <button className="staff-dashboard-btn">
            <FaArrowRight /> Check - Out
          </button>

          <button className="staff-dashboard-btn staff-logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Log out
          </button>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;
