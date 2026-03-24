const express = require('express');
const router = express.Router();
const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');
const Appointment = require('../models/Appointment');
const HealthTip = require('../models/HealthTip');
const { protect, authorize } = require('../middleware/auth');

const adminOnly = [protect, authorize('admin')];

// @route GET /api/admin/stats - System analytics
router.get('/stats', ...adminOnly, async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalAppointments = await Appointment.countDocuments();
    const pendingDoctors = await DoctorProfile.countDocuments({ isApproved: false });
    const recentAppointments = await Appointment.find()
      .populate('patient', 'name')
      .populate('doctor', 'name')
      .sort({ createdAt: -1 })
      .limit(5);
    res.json({
      success: true,
      stats: { totalPatients, totalDoctors, totalAppointments, pendingDoctors },
      recentAppointments,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/admin/users - List all users
router.get('/users', ...adminOnly, async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role) query.role = role;
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await User.countDocuments(query);
    res.json({ success: true, users, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/admin/users/:id - Update user (activate/deactivate)
router.put('/users/:id', ...adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', ...adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/admin/doctors/:id/approve - Approve doctor
router.put('/doctors/:id/approve', ...adminOnly, async (req, res) => {
  try {
    const profile = await DoctorProfile.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).populate('user', 'name email');
    await User.findByIdAndUpdate(profile.user._id, { isApproved: true });
    res.json({ success: true, doctor: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/admin/doctors/pending - Get unapproved doctors
router.get('/doctors/pending', ...adminOnly, async (req, res) => {
  try {
    const doctors = await DoctorProfile.find({ isApproved: false }).populate(
      'user',
      'name email avatar createdAt'
    );
    res.json({ success: true, doctors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
