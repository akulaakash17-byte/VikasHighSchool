require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const announcementsRoutes = require("./routes/announcements");
const enquiriesRoutes = require("./routes/enquiries");

const app = express();

// ─── Middleware ───────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ─── API Routes ───────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/announcements", announcementsRoutes);
app.use("/api/enquiries", enquiriesRoutes);

// ─── Serve HTML pages ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// FIX: handle both /admin and /admin/ so the page always loads
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin", "index.html"));
});
app.get("/admin/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin", "index.html"));
});

// ─── 404 fallback ─────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Global error handler ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ─── Start Server ─────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Vikas High School server running on http://localhost:${PORT}`);
  console.log(`📋 Admin panel: http://localhost:${PORT}/admin`);
}); 