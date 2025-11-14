const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures no two users have the same email
  },
  password: {
    type: String,
    required: true,
  },
  // We can add roles for future escalation logic
  role: {
    type: String,
    enum: ['Admin', 'Support', 'Viewer'],
    default: 'Support'
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;