const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Make sure path is imported

const app = express();
const PORT = 5000; 

// --- Middleware ---
app.use(cors());
app.use(express.json()); 

// --- Database Connection ---
const MONGO_URI = "mongodb+srv://hackathonuser:hackathonpass123@cluster0.6msuoim.mongodb.net/hackathon_db?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// --- API Routes ---
app.use('/api/queries', require('./routes/Query')); 
app.use('/api/auth', require('./routes/auth')); 

// --------------------------------
// --- DEPLOYMENT CONFIGURATION ---
// --------------------------------
if (process.env.NODE_ENV === 'production') {
  // 1. Set static folder (FIXED: Capital 'F')
  app.use(express.static(path.join(__dirname, '../Frontend/build')));

  // 2. Catch-all GET route (FIXED: Capital 'F')
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../Frontend', 'build', 'index.html'));
  });
}


// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});