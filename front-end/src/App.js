import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import StaffDashboard from "./pages/staff-dashboard";
import AdminDashboard from "./pages/admin-dashboard";
import AdminCCTV from "./pages/adminCCTV";
import AdminReports from "./pages/admin-reports";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/staff-dashboard" element={<StaffDashboard/>} />
        <Route path="/admin-dashboard" element={<AdminDashboard/>} />
        <Route path="/adminCCTV" element={<AdminCCTV/>} />
        <Route path="/admin-reports" element={<AdminReports/>} />
      </Routes>
    </Router>
  );
}

export default App;
