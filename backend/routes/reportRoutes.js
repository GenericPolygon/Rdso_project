const express = require('express');
const router = express.Router();
const db = require('../config/db');
const isLoggedIn = require('../middleware/isLoggedIn');

router.get('/:hrmsId', isLoggedIn, (req, res) => {
  const { hrmsId } = req.params;

  const sql = `
    SELECT 
      name,
      fatherName,
      dob,
      doj,
      mobile,
      email,
      education,
      technical,
      zone,
      division,
      total_answered,
      submittedAt,
      disc_dominant,
      disc_d_score, disc_i_score, disc_s_score, disc_c_score,
      disc_d_percentage, disc_i_percentage, disc_s_percentage, disc_c_percentage
    FROM registrations 
    WHERE hrmsId = ?
  `;

  db.get(sql, [hrmsId], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'HRMS ID not found' });

    res.json({
      name: row.name,
      hrmsId,
      fatherName: row.fatherName,
      dob: row.dob,
      doj: row.doj,
      mobile: row.mobile,
      email: row.email,
      education: row.education,
      technical: row.technical,
      zone: row.zone,
      division: row.division,
      total_answered: row.total_answered,
      submittedAt: row.submittedAt,
      disc_dominant: row.disc_dominant,
      disc_d_score: row.disc_d_score,
      disc_i_score: row.disc_i_score,
      disc_s_score: row.disc_s_score,
      disc_c_score: row.disc_c_score,
      disc_d_percentage: row.disc_d_percentage,
      disc_i_percentage: row.disc_i_percentage,
      disc_s_percentage: row.disc_s_percentage,
      disc_c_percentage: row.disc_c_percentage
    });
  });
});

module.exports = router;
