// =============================================================
// server.js
// Main entry point: connects to MongoDB, sets up Express,
// serves the client folder, and mounts the /api/projects routes.
// =============================================================

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const projectRoutes = require("./routes/projectRoutes");

const app = express();

// ---------- Middleware ----------
app.use(cors());
app.use(express.json()); // parse incoming JSON request bodies

// ---------- Serve the frontend (client folder) as static files ----------
// This lets you open http://localhost:5000/home.html directly
app.use(express.static(path.join(__dirname, "../client")));

// ---------- API routes ----------
app.use("/api/projects", projectRoutes);

// ---------- Connect to MongoDB ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// ---------- Start server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/api/projects`);
});
