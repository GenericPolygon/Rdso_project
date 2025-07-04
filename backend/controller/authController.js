const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const loginAdmin = (req, res) => {
  const { username, password } = req.body;

  const sql = `SELECT * FROM admins WHERE username = ?`;
  db.get(sql, [username], async (err, admin) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    // ✅ Hardcoded JWT secret and expiry
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      "railway",       
      { expiresIn: "15m" }      
    );

    res.status(200).json({
      message: 'Login successful',
      token,
    });
  });
};

module.exports = { loginAdmin };
