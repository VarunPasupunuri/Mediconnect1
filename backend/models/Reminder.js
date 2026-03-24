const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['medicine', 'appointment', 'checkup', 'custom'],
      default: 'medicine',
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    time: { type: String, required: true }, // "08:00 AM"
    days: [{ type: String }], // ["Monday", "Wednesday"] or ["Daily"]
    isActive: { type: Boolean, default: true },
    nextReminder: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reminder', reminderSchema);
