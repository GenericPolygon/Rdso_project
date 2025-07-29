const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const isProd = process.env.NODE_ENV === 'production';

const dbPath =
  process.env.DB_PATH ||
  (isProd
    ? path.join(__dirname, '..', 'railway_reg.db')  // Packaged
    : path.resolve(__dirname, '../../railway_reg.db')); // Dev

console.log('DB path:', dbPath);

// Ensure DB file exists
if (!fs.existsSync(dbPath)) {
  console.log('⚠️ DB file not found. Creating new DB...');
  fs.closeSync(fs.openSync(dbPath, 'w'));
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Could not connect to database:', err.message);
    throw err;
  } else {
    console.log(`✅ Connected to SQLite DB at ${dbPath}`);
  }
});

module.exports = db;
module.exports.dbPath = dbPath;
