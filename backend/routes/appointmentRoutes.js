const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const DoctorProfile = require('../models/DoctorProfile');
const { protect, authorize } = require('../middleware/auth');

// @route POST /api/appointments - Book appointment
router.post('/', protect, authorize('patient'), async (req, res) => {
  try {
    const { doctorId, date, timeSlot, reason } = req.body;
    // Check for double booking
    const existing = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      status: { $in: ['pending', 'confirmed'] },
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'This time slot is already booked' });
    }
    const doctorProfile = await DoctorProfile.findOne({ user: doctorId });
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      doctorProfile: doctorProfile?._id,
      date: new Date(date),
      timeSlot,
      reason,
      paymentAmount: doctorProfile?.consultationFee || 500,
    });
    const populated = await appointment.populate([
      { path: 'doctor', select: 'name email avatar' },
      { path: 'patient', select: 'name email avatar' },
    ]);
    res.status(201).json({ success: true, appointment: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/appointments/my - Get my appointments (patient/doctor)
router.get('/my', protect, async (req, res) => {
  try {
    const query =
      req.user.role === 'patient' ? { patient: req.user._id } : { doctor: req.user._id };
    const { status, page = 1, limit = 10 } = req.query;
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('doctor', 'name email avatar')
      .populate('patient', 'name email avatar phone')
      .populate('doctorProfile', 'specialization consultationFee')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Appointment.countDocuments(query);
    res.json({ success: true, appointments, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/appointments/:id - Get single appointment
router.get('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctor', 'name email avatar phone')
      .populate('patient', 'name email avatar phone bloodGroup allergies')
      .populate('doctorProfile', 'specialization hospital consultationFee');
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/appointments/:id - Update appointment (reschedule/cancel/confirm)
router.put('/:id', protect, async (req, res) => {
  try {
    const { status, date, timeSlot, notes, prescription } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Not found' });

    // Only patient or doctor can update
    const isPatient = appointment.patient.toString() === req.user._id.toString();
    const isDoctor = appointment.doctor.toString() === req.user._id.toString();
    if (!isPatient && !isDoctor && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (status) appointment.status = status;
    if (date) appointment.date = new Date(date);
    if (timeSlot) appointment.timeSlot = timeSlot;
    if (notes) appointment.notes = notes;
    if (prescription) appointment.prescription = prescription;

    await appointment.save();
    res.json({ success: true, appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/appointments/:id/payment - Mark as paid (dummy)
router.put('/:id/payment', protect, authorize('patient'), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: 'paid', status: 'confirmed' },
      { new: true }
    );
    res.json({ success: true, appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/appointments/stats/summary - Admin appointment stats
router.get('/stats/summary', protect, authorize('admin'), async (req, res) => {
  try {
    const total = await Appointment.countDocuments();
    const pending = await Appointment.countDocuments({ status: 'pending' });
    const confirmed = await Appointment.countDocuments({ status: 'confirmed' });
    const completed = await Appointment.countDocuments({ status: 'completed' });
    const cancelled = await Appointment.countDocuments({ status: 'cancelled' });
    res.json({ success: true, stats: { total, pending, confirmed, completed, cancelled } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
