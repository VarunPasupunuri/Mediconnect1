const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const DoctorProfile = require('../models/DoctorProfile');
const { protect, authorize } = require('../middleware/auth');

// Get reviews for a doctor
router.get('/:doctorId', async (req, res) => {
  try {
    const reviews = await Review.find({ doctor: req.params.doctorId })
      .populate('patient', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create or update review (patient only)
router.post('/', protect, authorize('patient'), async (req, res) => {
  try {
    const { doctorId, rating, comment, appointmentId } = req.body;
    const review = await Review.findOneAndUpdate(
      { patient: req.user._id, doctor: doctorId },
      { rating, comment, appointment: appointmentId },
      { new: true, upsert: true }
    );
    // Recalculate doctor's average rating
    const allReviews = await Review.find({ doctor: doctorId });
    const avgRating = allReviews.reduce((a, b) => a + b.rating, 0) / allReviews.length;
    await DoctorProfile.findOneAndUpdate(
      { user: doctorId },
      { rating: Math.round(avgRating * 10) / 10, totalReviews: allReviews.length }
    );
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
