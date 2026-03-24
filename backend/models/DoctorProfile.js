const mongoose = require('mongoose');

const doctorProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    specialization: { type: String, required: true },
    qualifications: [{ type: String }],
    experience: { type: Number, default: 0 }, // years
    consultationFee: { type: Number, default: 500 },
    hospital: { type: String, default: '' },
    about: { type: String, default: '' },
    languages: [{ type: String }],
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false },
    // Weekly availability slots
    availability: [
      {
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
        slots: [
          {
            time: String,     // e.g. "09:00 AM"
            isBooked: { type: Boolean, default: false },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('DoctorProfile', doctorProfileSchema);
