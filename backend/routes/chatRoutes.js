const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

// Get conversation between two users
router.get('/:otherId', protect, async (req, res) => {
  try {
    const ids = [req.user._id.toString(), req.params.otherId].sort();
    const conversationId = ids.join('_');
    const messages = await Message.find({ conversationId })
      .populate('sender', 'name avatar role')
      .sort({ createdAt: 1 });
    // Mark messages as read
    await Message.updateMany(
      { conversationId, receiver: req.user._id, isRead: false },
      { isRead: true }
    );
    res.json({ success: true, messages, conversationId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Send message
router.post('/', protect, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const ids = [req.user._id.toString(), receiverId].sort();
    const conversationId = ids.join('_');
    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content,
      conversationId,
    });
    const populated = await message.populate('sender', 'name avatar role');
    res.status(201).json({ success: true, message: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all conversations (list of people user has chatted with)
router.get('/conversations/list', protect, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate('sender', 'name avatar role')
      .populate('receiver', 'name avatar role')
      .sort({ createdAt: -1 });

    // Extract unique conversations
    const seen = new Set();
    const conversations = [];
    for (const msg of messages) {
      const other =
        msg.sender._id.toString() === userId ? msg.receiver : msg.sender;
      const key = other._id.toString();
      if (!seen.has(key)) {
        seen.add(key);
        conversations.push({ user: other, lastMessage: msg.content, time: msg.createdAt });
      }
    }
    res.json({ success: true, conversations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
