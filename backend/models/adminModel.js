const db = require('../config/db');
const bcrypt = require('bcryptjs');

const DEFAULT_ADMIN = { username: 'admin', password: 'Red@rat' };

function createAdminTable(callback) {
  db.run(
    `CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )`,
    (err) => {
      if (err) {
        console.error("Error creating 'admins' table:", err.message);
      } else {
        console.log("Table 'admins' is ready.");
        if (callback) callback();
      }
    }
  );
}

async function ensureDefaultAdmin() {
  db.get('SELECT * FROM admins LIMIT 1', async (err, row) => {
    if (err) {
      console.error("Error checking admin:", err.message);
      return;
    }
    if (!row) {
      console.log("⚠️ No admin found. Creating default admin...");
      const hashed = await bcrypt.hash(DEFAULT_ADMIN.password, 12);
      db.run(
        'INSERT INTO admins (username, password) VALUES (?, ?)',
        [DEFAULT_ADMIN.username, hashed],
        (e) => {
          if (e) console.error("Error inserting default admin:", e.message);
          else console.log(`✅ Default admin inserted: ${DEFAULT_ADMIN.username}`);
        }
      );
    }
  });
}

function initAdmins() {
  createAdminTable(ensureDefaultAdmin);
}

module.exports = { initAdmins };
