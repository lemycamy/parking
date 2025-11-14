// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./auth.js";
import parkingRoutes from "./parkingRoutes.js";



// Load environment variables from .env file
dotenv.config();

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: [
      "https://parking-eight-umber.vercel.app", // your Vercel frontend URL
      "http://localhost:3000"                   // for local testing
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })

);

app.get("/test", (req, res) => res.send("Backend is working"));
           // Allow cross-origin requests
app.use(express.json());   // Parse incoming JSON bodies

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/parkingRecord", parkingRoutes);

// ✅ Base route for quick check
app.get("/", (req, res) => {
  res.send("🚀 Parking Backend API is running...");
});

// ✅ Error handling (optional but recommended)
app.use((err, req, res, next) => {
  console.error("⚠️ Server Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
