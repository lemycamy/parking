import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import StaffDashboard from "./pages/staff-dashboard";
import AdminDashboard from "./pages/admin-dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/staff-dashboard" element={<StaffDashboard/>} />
        <Route path="/admin-dashboard" element={<AdminDashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;
