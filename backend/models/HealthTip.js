const mongoose = require('mongoose');

const healthTipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['fitness', 'nutrition', 'mental-health', 'general', 'disease-prevention'],
      default: 'general',
    },
    imageUrl: { type: String, default: '' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isPublished: { type: Boolean, default: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('HealthTip', healthTipSchema);
