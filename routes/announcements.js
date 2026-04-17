const express = require("express");
const router = express.Router();
const pool = require("../db");
const requireAuth = require("../middleware/auth");

// GET /api/announcements  — public
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM announcements ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/announcements  — admin only
router.post("/", requireAuth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Text is required" });
    }

    const result = await pool.query(
      "INSERT INTO announcements(text) VALUES($1) RETURNING *",
      [text.trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/announcements/:id  — admin only
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const result = await pool.query(
      "DELETE FROM announcements WHERE id=$1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    res.json({ success: true, deleted_id: parseInt(id) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router; 