const express = require('express');
const router = express.Router();
const registrationController = require('../controller/registrationController');

// Define the POST route for submission
router.post('/submit', registrationController.submitRegistration);


module.exports = router;