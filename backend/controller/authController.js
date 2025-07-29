const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const loginAdmin = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const sql = `SELECT * FROM admins WHERE username = ? COLLATE NOCASE LIMIT 1`;

  db.get(sql, [username], async (err, admin) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

    try {
      const isValid = await bcrypt.compare(password, admin.password);
      if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });
    } catch (e) {
      return res.status(500).json({ error: 'Password verification failed' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      'railway',
      { expiresIn: '15m' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
    });
  });
};

module.exports = { loginAdmin };
