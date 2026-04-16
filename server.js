const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// DB connection (use .env in real projects)
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "Lucky_@#10",
    port: 5432,
});

// =========================
// 📢 ANNOUNCEMENTS
// =========================

// Add announcement
app.post("/announcements", async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.trim() === "") {
            return res.status(400).json({ error: "Text required" });
        }

        await pool.query(
            "INSERT INTO announcements(text) VALUES($1)",
            [text]
        );

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Get announcements
app.get("/announcements", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM announcements ORDER BY created_at DESC"
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Delete announcement
app.delete("/announcements/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query("DELETE FROM announcements WHERE id=$1", [id]);

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// =========================
// 📥 ENQUIRIES
// =========================

// Save enquiry
app.post("/enquiries", async (req, res) => {
    try {
        const { parent_name, phone, student_name, class: cls, email, message } = req.body;

        if (!parent_name || !phone || !student_name) {
            return res.status(400).json({ error: "Missing fields" });
        }

        await pool.query(
            "INSERT INTO enquiries(parent_name, phone, student_name, class, email, message) VALUES($1,$2,$3,$4,$5,$6)",
            [parent_name, phone, student_name, cls, email, message]
        );

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Get enquiries
app.get("/enquiries", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM enquiries ORDER BY created_at DESC"
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// =========================
// SERVER
// =========================
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});