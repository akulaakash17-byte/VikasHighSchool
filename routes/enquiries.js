const express = require("express");
const router = express.Router();
const pool = require("../db");
const requireAuth = require("../middleware/auth");

// POST /api/enquiries  — public
router.post("/", async (req, res) => {
  try {
    const { parent_name, phone, student_name, class: cls, email, message } = req.body;

    if (!parent_name || !phone || !student_name) {
      return res.status(400).json({ error: "parent_name, phone, and student_name are required" });
    }

    const result = await pool.query(
      `INSERT INTO enquiries(parent_name, phone, student_name, class, email, message)
       VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [parent_name.trim(), phone.trim(), student_name.trim(), cls || null, email || null, message || null]
    );

    res.status(201).json({ success: true, enquiry: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/enquiries  — admin only, supports ?page=1&limit=20&search=
router.get("/", requireAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    let query, countQuery, params, countParams;

    if (search) {
      query = `SELECT * FROM enquiries
               WHERE parent_name ILIKE $1 OR phone ILIKE $1 OR student_name ILIKE $1
               ORDER BY created_at DESC LIMIT $2 OFFSET $3`;
      countQuery = `SELECT COUNT(*) FROM enquiries
                    WHERE parent_name ILIKE $1 OR phone ILIKE $1 OR student_name ILIKE $1`;
      params = [`%${search}%`, limit, offset];
      countParams = [`%${search}%`];
    } else {
      query = `SELECT * FROM enquiries ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
      countQuery = `SELECT COUNT(*) FROM enquiries`;
      params = [limit, offset];
      countParams = [];
    }

    const [data, count] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, countParams),
    ]);

    res.json({
      enquiries: data.rows,
      total: parseInt(count.rows[0].count),
      page,
      limit,
      totalPages: Math.ceil(parseInt(count.rows[0].count) / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/enquiries/:id  — admin only
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const result = await pool.query(
      "DELETE FROM enquiries WHERE id=$1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Enquiry not found" });
    }

    res.json({ success: true, deleted_id: parseInt(id) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;