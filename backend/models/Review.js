const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: '' },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  },
  { timestamps: true }
);

// Unique review per patient-doctor pair
reviewSchema.index({ patient: 1, doctor: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
