// backend/controller/registrationController.js
const db = require('../config/db');


exports.submitRegistration = (req, res) => {
    // Destructure all expected fields from the request body
    const {
        // Form Data
        hrmsId, name, fatherName, dob, doj, mobile, email,
        education, technical, zone, division,
        // Test Results
        dominant, scores, percentages, total
    } = req.body;

    // Basic validation to ensure required data is present
    if (!hrmsId || !name || !dominant) {
        return res.status(400).json({ "error": "Missing required fields." });
    }

    const sql = `INSERT INTO registrations (
        hrmsId, name, fatherName, dob, doj, mobile, email, education, technical, zone, division,
        disc_dominant, disc_d_score, disc_i_score, disc_s_score, disc_c_score,
        disc_d_percentage, disc_i_percentage, disc_s_percentage, disc_c_percentage,
        total_answered
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const params = [
        hrmsId, name, fatherName, dob, doj, mobile, email, education, technical, zone, division,
        dominant, scores.D, scores.I, scores.S, scores.C,
        percentages.D, percentages.I, percentages.S, percentages.C,
        total
    ];

    db.run(sql, params, function(err) {
        if (err) {
            // Check for unique constraint violation on hrmsId
            if (err.message.includes('UNIQUE constraint failed')) {
                 return res.status(409).json({ "error": "This HRMS ID has already been registered." });
            }
            console.error("Database insertion error:", err.message);
            return res.status(500).json({ "error": err.message });
        }
        res.status(201).json({
            "message": "success",
            "data": req.body,
            "id": this.lastID
        });
    });
};