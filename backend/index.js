const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('dotenv').config();

// Import schema definitions
const createRegistrationTable = require('./models/registrationModel');
const createAdminTable = require('./models/adminModel');

// Routes
const registrationRoutes = require('./routes/registrationRoutes');
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const exportRoute = require('./routes/exportRoute');



const app = express();
const PORT = process.env.PORT || 5000;
const DBSOURCE = process.env.DB_PATH || './railway_reg.db';
// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/registrations', registrationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/report', reportRoutes);
app.use('/api', exportRoute);



// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Railway Registration API" });
});

// Initialize tables
createRegistrationTable();
createAdminTable();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
