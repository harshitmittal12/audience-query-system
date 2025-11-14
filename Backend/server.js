const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000; 

// --- Middleware ---
app.use(cors());
app.use(express.json()); // Essential for parsing JSON bodies (like user credentials)

// --- Database Connection ---
const MONGO_URI = "mongodb+srv://hackathonuser:hackathonpass123@cluster0.6msuoim.mongodb.net/hackathon_db?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// --- API Routes ---
// 1. Queries (Your main dashboard data)
app.use('/api/queries', require('./routes/Query')); 

// 2. Authentication (New: Register, Login)
app.use('/api/auth', require('./routes/auth')); // <-- ADDED THIS LINE

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});