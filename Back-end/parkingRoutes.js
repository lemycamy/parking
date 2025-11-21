// parkingRoutes.js
import express from "express";
import ParkingRecord from "./parkingRecord.js";

const router = express.Router();

// GET all parking records
router.get("/", async (req, res) => {
  try {
    const records = await ParkingRecord.find().sort({ timeIn: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const rateMap = {
  Motorcycle: 40,
  Car: 50,

};

// POST Time In
router.post("/timein", async (req, res) => {
  try {
    const { plateNumber, ownerName, vehicleType = "Car", createdBy } = req.body;
    const date = new Date().toISOString().split("T")[0];

    // Set rate per hour based on vehicle type
    const ratePerHour = rateMap[vehicleType] || 50;

    const record = new ParkingRecord({
      plateNumber,
      ownerName,
      vehicleType,
      timeIn: new Date(),
      date,
      createdBy,
      ratePerHour, // store in MongoDB
    });

    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT Time Out
router.put("/timeout/:id", async (req, res) => {
  try {
    const { isCustomer } = req.body;
    const record = await ParkingRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ error: "Record not found" });

    record.timeOut = new Date();
    record.isCustomer = isCustomer;

    // Calculate hours
    const hours = Math.ceil((record.timeOut - record.timeIn) / (1000 * 60 * 60));
    record.totalHours = hours;

    // Get rate per vehicle type
    const baseRate = rateMap[record.vehicleType] || 50;
    record.ratePerHour = baseRate;

    // Calculate total fee with discount for customers
    record.totalFee = isCustomer ? hours * baseRate * 0.8 : hours * baseRate;

    record.status = "paid";

    await record.save();
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
