// auth.js
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

//
// ✅ User Schema (with role support)
//
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
  role: {
    type: String,
    enum: ["admin", "staff", "user"],
    default: "user",
  },
});

// ✅ Prevent model overwrite when hot-reloading
const User = mongoose.models.User || mongoose.model("User", userSchema);

//
// ✅ REGISTER route
//
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  console.log("📩 Registration request received:", req.body); // debug line

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "❌ Username already taken" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({
      message: "✅ User registered successfully",
      user: {
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({ message: "⚠️ Server error. Try again later." });
  }
});

//
// ✅ LOGIN route
//
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "❌ Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "❌ Invalid credentials" });
    }

    // ✅ Create JWT including role
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "✅ Login successful",
      token,
      user: { username: user.username, role: user.role },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "⚠️ Server error. Try again later." });
  }
});

//
// ✅ UPDATE ROLE route (Admin-only, optional)
//
router.patch("/update-role", async (req, res) => {
  const { username, role } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { username },
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "❌ User not found" });
    }

    res.json({
      message: `✅ ${username}'s role updated to ${role}`,
      user: { username: user.username, role: user.role },
    });
  } catch (err) {
    console.error("❌ Role Update Error:", err);
    res.status(500).json({ message: "⚠️ Server error" });
  }
});

//
// ✅ Middleware for auth + role checking
//
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.user = user;
    next();
  });
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access forbidden: insufficient privileges",
      });
    }
    next();
  };
}

//
// ✅ Role-based dashboard routes
//
router.get("/admin-dashboard", authenticateToken, authorizeRoles("admin"), (req, res) => {
  res.json({
    message: `Welcome Admin ${req.user.username}!`,
    role: req.user.role,
  });
});

router.get("/staff-dashboard", authenticateToken, authorizeRoles("staff"), (req, res) => {
  res.json({
    message: `Welcome Staff ${req.user.username}!`,
    role: req.user.role,
  });
});

router.get("/user-dashboard", authenticateToken, (req, res) => {
  res.json({
    message: `Hello ${req.user.username}!`,
    role: req.user.role,
  });
});

//
// ✅ Test routes
//
router.get("/register", (req, res) => res.send("Register endpoint reachable"));
router.get("/login", (req, res) => res.send("Login endpoint reachable"));

export default router;
