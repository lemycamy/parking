import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import "../css/TimeInPage.css"; // import the CSS file

const TimeInPage = ({ currentUser }) => {
  const navigate = useNavigate();
  const [plateNumber, setPlateNumber] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [vehicleType, setVehicleType] = useState("Car");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleTimeIn = async (e) => {
    e.preventDefault();

    if (!plateNumber || !ownerName) {
      setMessage("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await axios.post("https://parking-zlmz.onrender.com/api/parkingRecord/timein", {
        plateNumber,
        ownerName,
        vehicleType,
        createdBy: currentUser || "Admin",
      });

      setMessage(`✅ Time In registered successfully for ${plateNumber}`);
      setPlateNumber("");
      setOwnerName("");
      setVehicleType("Car");
    } catch (error) {
      console.error(error);
      setMessage("❌ Error registering Time In. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/", { replace: true });
      }
    }, [navigate]);

  return (
    <div className="timein-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft className="icon" /> Back
      </button>

      <div className="timein-card">
        <h2>Vehicle Time In</h2>

        {message && <div className="message">{message}</div>}

        <form onSubmit={handleTimeIn}>
          <div className="form-group">
            <label>Plate Number *</label>
            <input
              type="text"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
              placeholder="Enter plate number"
              required
            />
          </div>

          <div className="form-group">
            <label>Owner Name *</label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Enter owner's name"
              required
            />
          </div>

          <div className="form-group">
            <label>Vehicle Type</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="Car">Car</option>
              <option value="Motorcycle">Motorcycle</option>

            </select>
          </div>

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? "Registering..." : "Time In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TimeInPage;
