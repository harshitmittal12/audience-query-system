const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // 👈 NEW: Import JWT
const User = require('../Models/User');

// NOTE: For a real app, define your JWT Secret in a .env file!
const JWT_SECRET = 'your_super_secret_jwt_key'; 

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, password });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Respond with a simple success message
    res.status(201).json({ msg: 'User registered successfully.' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error during registration.');
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find the user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 2. Compare the plain password with the hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 3. Create the JWT payload (the identity information stored in the token)
    const payload = {
      user: {
        id: user.id,
        role: user.role // Important for permission checking later
      }
    };

    // 4. Sign the token and send it back to the client
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' }, // Token expires after 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Sends { token: 'asdhfiasdfasd...' }
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error during login.');
  }
});

module.exports = router;