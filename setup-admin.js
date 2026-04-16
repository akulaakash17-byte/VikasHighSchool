/**
 * Run ONCE to create your admin account in the database.
 * Usage: node setup-admin.js
 * Then delete or disable this file.
 */

require("dotenv").config();
const bcrypt = require("bcrypt");
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
});

// ─── CHANGE THESE BEFORE RUNNING ─────────────────────────────────
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "VikasAdmin@2025";   // ← change this!
// ─────────────────────────────────────────────────────────────────

async function setup() {
  try {
    console.log("Connecting to database...");

    const existing = await pool.query(
      "SELECT id FROM admins WHERE username = $1",
      [ADMIN_USERNAME]
    );

    if (existing.rows.length > 0) {
      console.log(`⚠️  Admin '${ADMIN_USERNAME}' already exists. Skipping.`);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await pool.query(
      "INSERT INTO admins (username, password) VALUES ($1, $2)",
      [ADMIN_USERNAME, hashed]
    );

    console.log(`✅ Admin '${ADMIN_USERNAME}' created successfully.`);
    console.log(`🔐 Password: ${ADMIN_PASSWORD}`);
    console.log(`\n⚠️  IMPORTANT: Delete this file now for security!`);
  } catch (err) {
    console.error("❌ Setup failed:", err.message);
  } finally {
    await pool.end();
  }
}

setup();