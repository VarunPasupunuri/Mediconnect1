const express = require('express');
const router = express.Router();
const HealthTip = require('../models/HealthTip');
const { protect, authorize } = require('../middleware/auth');

// Get all health tips (public)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    const tips = await HealthTip.find(query)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, tips });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create health tip (admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const tip = await HealthTip.create({ ...req.body, author: req.user._id });
    res.status(201).json({ success: true, tip });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update health tip (admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const tip = await HealthTip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, tip });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete health tip (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await HealthTip.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Health tip deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
