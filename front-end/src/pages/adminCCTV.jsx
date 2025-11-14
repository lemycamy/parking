import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaVideo, FaArrowLeft } from "react-icons/fa"; // ✅ import FaArrowLeft

function AdminCCTV() {

  const navigate = useNavigate();
  
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/", { replace: true });
      }
    }, [navigate]);
  


  return (
    <div className="admin-cctv-page" style={{ padding: "40px", textAlign: "center" }}>
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
