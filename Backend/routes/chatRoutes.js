const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ChatRequest = require('../models/ChatRequest');
const { protect } = require('../middleware/authMiddleware');
const Message = require('../models/Message');

// Send a chat request
router.post('/request', protect, async (req, res) => {
  try {
    const { targetUserId } = req.body;
    if (!targetUserId) return res.status(400).json({ message: "Target user ID is required" });

    const exists = await ChatRequest.findOne({ from: req.user._id, to: targetUserId });
    if (exists) return res.status(400).json({ message: "Request already sent" });

    const newRequest = new ChatRequest({ from: req.user._id, to: targetUserId });
    await newRequest.save();
    res.status(201).json({ message: "Request sent" });
  } catch (err) {
    console.error('Error sending chat request:', err);
    res.status(500).json({ message: 'Failed to send chat request' });
  }
});

// View incoming requests
router.get('/requests', protect, async (req, res) => {
  try {
    const requests = await ChatRequest.find({ to: req.user._id, status: 'pending' }).populate('from', 'name email');
    res.json(requests);
  } catch (err) {
    console.error('Error fetching chat requests:', err);
    res.status(500).json({ message: 'Failed to fetch incoming chat requests' });
  }
});

// Respond to a request
router.post('/respond', protect, async (req, res) => {
  try {
    const { requesterId, action } = req.body;
    const validActions = ['accepted', 'rejected'];
    if (!validActions.includes(action)) return res.status(400).json({ message: "Invalid action" });

    const request = await ChatRequest.findOneAndUpdate(
      { from: requesterId, to: req.user._id },
      { status: action },
      { new: true }
    );

    if (!request) return res.status(404).json({ message: "Request not found" });

    res.json({ message: `Request ${action}` });
  } catch (err) {
    console.error('Error responding to chat request:', err);
    res.status(500).json({ message: 'Failed to respond to chat request' });
  }
});

// Get messages between users
// Get messages between users
router.get('/messages/:partnerId', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const partnerId = req.params.partnerId;

    // Fetch messages between the user and partner
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: partnerId },
        { sender: partnerId, receiver: userId }
      ]
    }).sort({ timestamp: 1 }).populate([
      { path: 'sender', select: 'name email' },
      { path: 'receiver', select: 'name email' }
    ]);

    // Format the messages with sender details
    const formatted = messages.map(msg => ({
      content: msg.content,
      sender: {
        _id: msg.sender._id,
        name: msg.sender.name,
        email: msg.sender.email
      },
      receiver: {
        _id: msg.receiver._id,
        name: msg.receiver.name,
        email: msg.receiver.email
      },
      timestamp: msg.timestamp
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});


// Get chat partners
router.get('/partners', protect, async (req, res) => {
  try {
    const acceptedRequests = await ChatRequest.find({
      $or: [
        { from: req.user._id, status: 'accepted' },
        { to: req.user._id, status: 'accepted' }
      ]
    }).populate([
      { path: 'from', select: 'name email' },
      { path: 'to', select: 'name email' }
    ]);

    const partners = acceptedRequests
      .map(request => {
        if (!request.from || !request.to) return null;

        const isSender = request.from._id.toString() === req.user._id.toString();
        const partner = isSender ? request.to : request.from;

        if (!partner || !partner._id || !partner.name || !partner.email) return null;

        return {
          _id: partner._id,
          name: partner.name,
          email: partner.email
        };
      })
      .filter(Boolean); // remove nulls

    res.json(partners);
  } catch (err) {
    console.error('Error fetching chat partners:', err);
    res.status(500).json({ message: 'Failed to fetch chat partners' });
  }
});

module.exports = router ;
