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

// POST Time In
router.post("/timein", async (req, res) => {
  try {
    const { plateNumber, ownerName, vehicleType, createdBy } = req.body;
    const date = new Date().toISOString().split("T")[0];
    const record = new ParkingRecord({
      plateNumber,
      ownerName,
      vehicleType,
      timeIn: new Date(),
      date,
      createdBy
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
    const hours = Math.ceil((record.timeOut - record.timeIn) / (1000 * 60 * 60));
    record.totalHours = hours;

    record.ratePerHour = 50;
    record.totalFee = isCustomer ? hours * record.ratePerHour * 0.8 : hours * record.ratePerHour;
    record.status = "paid";

    await record.save();
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
