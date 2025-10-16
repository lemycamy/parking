// front-end/src/auth.js
import axios from "axios";

const API_URL = "http://localhost:5000/api"; // ✅ must include /api

export async function loginUser(email, password) {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    return res.data;
  } catch (err) {
    console.error("Login failed:", err);
    throw err;
  }
}
