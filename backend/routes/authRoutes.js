const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controller/authController');
const isLoggedIn = require('../middleware/isLoggedIn');

// Login route
router.post('/admin/login', loginAdmin);

// Example protected route
router.get('/admin/dashboard', isLoggedIn, (req, res) => {
  res.json({ message: `Welcome ${req.admin.username}`, data: "Secure data here" });
});

module.exports = router;
