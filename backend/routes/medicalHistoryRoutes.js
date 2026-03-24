const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/MedicalRecord');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route GET /api/medical-history - Get patient's medical records
router.get('/', protect, async (req, res) => {
  try {
    const patientId = req.user.role === 'patient' ? req.user._id : req.query.patientId;
    const { type } = req.query;
    const query = { patient: patientId };
    if (type) query.type = type;
    const records = await MedicalRecord.find(query)
      .populate('doctor', 'name avatar')
      .sort({ date: -1 });
    res.json({ success: true, records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/medical-history - Add medical record
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    const { type, title, description, date, doctorId, tags } = req.body;
    const patientId = req.user.role === 'patient' ? req.user._id : req.body.patientId;
    const record = await MedicalRecord.create({
      patient: patientId,
      type,
      title,
      description,
      date: date || Date.now(),
      doctor: doctorId || req.user._id,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : '',
      fileName: req.file ? req.file.originalname : '',
      tags: tags ? JSON.parse(tags) : [],
    });
    res.status(201).json({ success: true, record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route DELETE /api/medical-history/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    if (record.patient.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    await record.deleteOne();
    res.json({ success: true, message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
