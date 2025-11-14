const jwt = require('jsonwebtoken');

// NOTE: Use the same secret key you defined in auth.js
const JWT_SECRET = 'your_super_secret_jwt_key';

module.exports = function (req, res, next) {
  // Get token from the header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    // jwt.verify decodes the token using the secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach the user information (id, role) from the payload to the request object
    req.user = decoded.user;
    
    // Continue to the next piece of middleware or the route handler
    next();
  } catch (err) {
    // This runs if the token is invalid, expired, or corrupted
    res.status(401).json({ msg: 'Token is not valid' });
  }
};