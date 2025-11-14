const mongoose = require('mongoose');

// This is the schema
const querySchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
    enum: ['Email', 'Social', 'Chat', 'WebForm']
  },
  content: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    default: 'N/A'
  },
  customerEmail: {
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: ['New', 'Open', 'Pending', 'Resolved', 'Closed'],
    default: 'New'
  },
  priority: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Low'
  },
  tags: {
    type: [String],
    default: []
  },
  assignedTo: {
    type: String,
    default: 'Unassigned'
  },
  history: [
    {
      timestamp: { type: Date, default: Date.now },
      action: String,
      notes: String
    }
  ]
}, {
  timestamps: true
});

// We name the model 'Message' to match your file name
const Message = mongoose.model('Message', querySchema);

module.exports = Message;