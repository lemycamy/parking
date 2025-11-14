// parkingRecords.js
import mongoose from "mongoose";

const parkingSchema = new mongoose.Schema({
  plateNumber: { type: String, required: true },
  ownerName: { type: String, required: true },
  vehicleType: { type: String, default: "Car" },
  timeIn: { type: Date, required: true },
  timeOut: { type: Date, default: null },
  totalHours: { type: Number, default: 0 },
  ratePerHour: { type: Number, default: 50 },
  totalFee: { type: Number, default: 0 },
  status: { type: String, default: "pending" },
  isCustomer: { type: Boolean, default: false },
  date: { type: String },
  createdBy: { type: String },
}, { collection: "parkingRecords" });

const parkingRecord = mongoose.model("parkingRecord", parkingSchema);

export default parkingRecord;
