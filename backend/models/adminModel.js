const db = require('../config/db');

const createAdminTable = () => {
  db.run(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`, (err) => {
    if (err) {
      console.error("Error creating 'admins' table:", err.message);
    } else {
      console.log("Table 'admins' is ready.");
    }
  });
};

module.exports = createAdminTable;
