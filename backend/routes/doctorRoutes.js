const express = require('express');
const router = express.Router();
const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');
const { protect, authorize } = require('../middleware/auth');

// @route GET /api/doctors - Get all approved doctors with optional search/filter
router.get('/', async (req, res) => {
  try {
    const { specialization, search, page = 1, limit = 12 } = req.query;
    let filter = { isApproved: true };
    if (specialization) filter.specialization = new RegExp(specialization, 'i');

    let doctorProfiles = await DoctorProfile.find(filter)
      .populate('user', 'name email avatar phone gender')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    if (search) {
      doctorProfiles = doctorProfiles.filter(
        (dp) =>
          dp.user.name.toLowerCase().includes(search.toLowerCase()) ||
          dp.specialization.toLowerCase().includes(search.toLowerCase()) ||
          dp.hospital.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = await DoctorProfile.countDocuments(filter);
    res.json({ success: true, doctors: doctorProfiles, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/doctors/:id - Get single doctor profile
router.get('/:id', async (req, res) => {
  try {
    const profile = await DoctorProfile.findById(req.params.id).populate(
      'user',
      'name email avatar phone gender address'
    );
    if (!profile) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, doctor: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/doctors/user/:userId - Get doctor profile by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const profile = await DoctorProfile.findOne({ user: req.params.userId }).populate(
      'user',
      'name email avatar phone gender address'
    );
    if (!profile) return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    res.json({ success: true, doctor: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/doctors/profile - Doctor updates their own profile
router.put('/profile', protect, authorize('doctor'), async (req, res) => {
  try {
    const updates = req.body;
    const profile = await DoctorProfile.findOneAndUpdate({ user: req.user._id }, updates, {
      new: true,
      upsert: true,
    }).populate('user', 'name email avatar');
    res.json({ success: true, doctor: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/doctors/availability - Doctor sets availability
router.put('/availability', protect, authorize('doctor'), async (req, res) => {
  try {
    const { availability } = req.body;
    const profile = await DoctorProfile.findOneAndUpdate(
      { user: req.user._id },
      { availability },
      { new: true }
    );
    res.json({ success: true, doctor: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/doctors/specializations/list - Get all unique specializations
router.get('/specializations/list', async (req, res) => {
  try {
    const specs = await DoctorProfile.distinct('specialization', { isApproved: true });
    res.json({ success: true, specializations: specs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
