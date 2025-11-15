const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // <-- NEW: Import path module for file paths

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
// This block ensures Express serves the static React files in a production environment.
if (process.env.NODE_ENV === 'production') {
  // 1. Set static folder: Express looks for files inside frontend/build
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // 2. Catch-all GET route: For any request not matching an API route, serve index.html
  // This allows React Router to handle client-side navigation (like /query/:id)
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}


// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});