const path = require('path');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config(); 

const DBSOURCE = path.resolve(__dirname, '../../', process.env.DB_PATH || 'railway_reg.db');

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error("Could not connect to database:", err.message);
    throw err;
  } else {
    console.log(`Connected to the SQLite database at ${DBSOURCE}`);
  }
});

module.exports = db;
