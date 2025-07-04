const express = require('express');
const ExcelJS = require('exceljs');
const router = express.Router();
const db = require('../config/db');
const isLoggedIn = require('../middleware/isLoggedIn');

router.get('/export-excel', isLoggedIn, async (req, res) => {
  try {
    const sql = `SELECT * FROM registrations`;

    db.all(sql, [], async (err, rows) => {
      if (err) {
        console.error("DB error while exporting:", err);
        return res.status(500).json({ error: 'Failed to fetch data from database' });
      }

      if (!rows || rows.length === 0) {
        return res.status(404).json({ error: 'No registration data found' });
      }

      // Create workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Registrations');

      // Add header row
      const headers = Object.keys(rows[0]);
      worksheet.addRow(headers);

      // Add data rows
      rows.forEach((row) => {
        worksheet.addRow(Object.values(row));
      });

      // Set response headers
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=registrations_export.xlsx'
      );

      await workbook.xlsx.write(res);
      res.end();
    });
  } catch (err) {
    console.error("Excel export error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
