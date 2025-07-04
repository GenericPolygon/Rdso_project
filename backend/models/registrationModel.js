const db = require('../config/db');

const createRegistrationTable = () => {
  db.run(`CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hrmsId TEXT UNIQUE,
    name TEXT,
    fatherName TEXT,
    dob TEXT,
    doj TEXT,
    mobile TEXT,
    email TEXT,
    education TEXT,
    technical TEXT,
    zone TEXT,
    division TEXT,
    disc_dominant TEXT,
    disc_d_score INTEGER,
    disc_i_score INTEGER,
    disc_s_score INTEGER,
    disc_c_score INTEGER,
    disc_d_percentage INTEGER,
    disc_i_percentage INTEGER,
    disc_s_percentage INTEGER,
    disc_c_percentage INTEGER,
    total_answered INTEGER,
    submittedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error("Error creating 'registrations' table:", err.message);
    } else {
      console.log("Table 'registrations' is ready.");
    }
  });
};

module.exports = createRegistrationTable;
