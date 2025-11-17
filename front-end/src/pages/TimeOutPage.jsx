import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import "../css/TimeOutPage.css";

// ✅ Rate configuration (easy to change)
const RATES = {
  Car: { normal: 50, customer: 30 },
  Motorcycle: { normal: 40, customer: 30 },
};

const ADDITIONAL_AFTER_2_HOURS = 10; // added if parking > 2 hours

// ✅ Helper function to calculate fee
const calculateFee = (vehicleType, hours, isCustomer) => {
  const rateType = isCustomer ? "customer" : "normal";
  let ratePerHour = RATES[vehicleType]?.[rateType] || 0;

  if (hours > 2) ratePerHour += ADDITIONAL_AFTER_2_HOURS;

  const totalFee = hours * ratePerHour;
  return { totalFee, ratePerHour };
};

const TimeOutPage = () => {
  const navigate = useNavigate();
  const [plateNumber, setPlateNumber] = useState("");
  const [record, setRecord] = useState(null);
  const [step, setStep] = useState(1);
  const [isCustomer, setIsCustomer] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Step 1: Search
  const handleSearch = async () => {
    if (!plateNumber) return setMessage("Please enter a plate number.");
    setLoading(true); setMessage("");

    try {
      const res = await axios.get("https://parking-zlmz.onrender.com/api/parkingRecord");
      const found = res.data.find(
        (r) => r.plateNumber === plateNumber.toUpperCase() && !r.timeOut
      );
      if (!found) {
        setMessage("No active Time In record found.");
        setRecord(null);
      } else {
        setRecord(found);
        setStep(2);
      }
    } catch (error) {
      console.error(error);
      setMessage("Error fetching records.");
    } finally { setLoading(false); }
  };

  useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/", { replace: true });
      }
    }, [navigate]);

  // Step 2: Proceed after customer selection
  const handleProceed = async () => {
    if (isCustomer === null) return setMessage("Select if customer or not.");
    setLoading(true); setMessage("");

    try {
      const timeIn = new Date(record.timeIn);
      const timeOut = new Date();
      const hours = Math.ceil((timeOut - timeIn) / (1000 * 60 * 60));

      const { totalFee, ratePerHour } = calculateFee(record.vehicleType, hours, isCustomer);

      const res = await axios.put(
        `https://parking-zlmz.onrender.com/api/parkingRecord/timeout/${record._id}`,
        { isCustomer, totalFee, ratePerHour, timeOut, totalHours: hours }
      );

      setRecord(res.data);
      setStep(3);
    } catch (error) {
      console.error(error);
      setMessage("Error processing Time Out.");
    } finally { setLoading(false); }
  };

  // Step 3: Show confirmation modal
  const handleComplete = () => setShowModal(true);
  const confirmComplete = () => {
    console.log("Printing receipt:", record); // replace with POS printer API
    alert("✅ Receipt printed to POS.");
    setShowModal(false);
    navigate("/staff-dashboard");
  };

  const totalHours = record
    ? Math.ceil((new Date(record.timeOut || new Date()) - new Date(record.timeIn)) / (1000 * 60 * 60))
    : 0;

  return (
    <div className="timeout-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft className="icon" /> Back
      </button>

      <div className="timeout-card">
        {message && <div className="message">{message}</div>}

        {step === 1 && (
          <>
            <h2>Vehicle Time Out</h2>
            <input
              type="text"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
              placeholder="Enter plate number"
              className="input-field"
            />
            <button onClick={handleSearch} className="submit-button" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </>
        )}

        {step === 2 && record && (
          <>
            <h2>Confirm Customer</h2>
            <p>Plate: {record.plateNumber}</p>
            <p>Owner: {record.ownerName}</p>
            <p>Total Time Parked: {totalHours} hours</p>

            <div className="radio-group">
              <label><input type="radio" name="customer" onChange={() => setIsCustomer(true)} /> Customer</label>
              <label><input type="radio" name="customer" onChange={() => setIsCustomer(false)} /> Non-Customer</label>
            </div>

            <button onClick={handleProceed} className="submit-button" disabled={loading}>
              {loading ? "Processing..." : "Proceed"}
            </button>
          </>
        )}

        {step === 3 && record && (
  <>
    <div className="receipt-card">
      <div className="receipt-header">
        <span className="logo">Ez<span className="highlight">park</span></span>
        <h2>PARKING RECEIPT</h2>
      </div>

      <div className="receipt-info">
        <div><span className="label">Name</span> <span>{record.ownerName}</span></div>
        <div><span className="label">Plate</span> <span>{record.plateNumber}</span></div>
        <div><span className="label">Slot</span> <span>{record.slot || "N/A"}</span></div>
      </div>

      <hr />

      <div className="receipt-info">
        <div><span className="label">Date</span> <span>{new Date(record.timeIn).toLocaleDateString()}</span></div>
        <div><span className="label">Time-In</span> <span>{new Date(record.timeIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></div>
        <div><span className="label">Time-Out</span> <span>{new Date(record.timeOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></div>
        <div>
          <span className="label">Duration</span> 
          <span>
            {Math.floor(record.totalHours)}h {Math.round((record.totalHours - Math.floor(record.totalHours)) * 60)}m
          </span>
        </div>
      </div>

      <hr />

      <div className="receipt-price">
        <span className="label">Price</span> 
        <span className="price">₱{record.totalFee}</span>
      </div>

      <p className="thank-you">THANK YOU AND DRIVE SAFELY</p>

      <button onClick={handleComplete} className="checkout-button">
        Check Out
      </button>
    </div>
  </>
)}

      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Completion</h3>
            <p>Are you sure you want to complete this transaction and print the receipt?</p>
            <div className="modal-buttons">
              <button onClick={confirmComplete} className="submit-button complete-button">
                Yes, Complete
              </button>
              <button onClick={() => setShowModal(false)} className="submit-button cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeOutPage;
