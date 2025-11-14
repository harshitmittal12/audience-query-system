const express = require('express');
const router = express.Router();
const Query = require('../Models/Message'); // Correctly imports your 'Message' model

// --- This is our new helper function for analysis ---
const analyzeQuery = (content) => {
  let newPriority = 'Low';
  const newTags = [];
  const lowerContent = content.toLowerCase();

  // 1. Priority Detection Logic
  if (lowerContent.includes('urgent') || lowerContent.includes('asap') || lowerContent.includes('immediately')) {
    newPriority = 'Urgent';
  } else if (lowerContent.includes('angry') || lowerContent.includes('terrible') || lowerContent.includes('unacceptable')) {
    newPriority = 'High';
  } else if (lowerContent.includes('slow') || lowerContent.includes('confused')) {
    newPriority = 'Medium';
  }

  // 2. Auto-Tagging Logic
  if (lowerContent.includes('billing') || lowerContent.includes('invoice') || lowerContent.includes('charge')) {
    newTags.push('Billing');
  }
  if (lowerContent.includes('refund') || lowerContent.includes('money back')) {
    newTags.push('Refund');
  }
  if (lowerContent.includes('bug') || lowerContent.includes('error') || lowerContent.includes('not working')) {
    newTags.push('Bug');
  }
  if (lowerContent.includes('feature') || lowerContent.includes('idea') || lowerContent.includes('suggest')) {
    newTags.push('Feature Request');
  }

  return { newPriority, newTags };
};

// @route   GET /api/queries
// @desc    Get all queries
router.get('/', async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 🚨 MISSING ROUTE ADDED HERE 🚨
// @route   GET /api/queries/:id
// @desc    Get a single query by ID
router.get('/:id', async (req, res) => {
  try {
    // We use the imported Query model (which refers to the Message schema)
    const query = await Query.findById(req.params.id); 

    if (!query) {
      return res.status(404).json({ msg: 'Query not found' });
    }

    res.json(query);
  } catch (err) {
    console.error(err.message);
    // Handle case where the ID format is invalid
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Query not found due to invalid ID format' });
    }
    res.status(500).send('Server Error');
  }
});
// 🚨 END OF MISSING ROUTE 🚨

// @route   POST /api/queries
// @desc    Create a new query
router.post('/', async (req, res) => {
  try {
    const { source, content, customerName, customerEmail } = req.body;

    const { newPriority, newTags } = analyzeQuery(content);

    const newQuery = new Query({
      source,
      content,
      customerName,
      customerEmail,
      priority: newPriority,
      tags: newTags
    });

    const query = await newQuery.save();
    res.json(query);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   PUT /api/queries/:id
// @desc    Update a query
router.put('/:id', async (req, res) => {
  try {
    const { status, priority, assignedTo } = req.body;
    const updateFields = {};
    if (status) updateFields.status = status;
    if (priority) updateFields.priority = priority;
    if (assignedTo) updateFields.assignedTo = assignedTo;

    let query = await Query.findById(req.params.id);
    if (!query) {
      return res.status(404).json({ msg: 'Query not found' });
    }
    query = await Query.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );
    res.json(query);
  } catch (err) {
    console.error(err.message);
    // Changed status code back to 500 for internal errors
    res.status(500).send('Server Error'); 
  }
});

module.exports = router;