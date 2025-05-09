const User = require('../models/User');
const Message = require('../models/Message');

exports.sendChatRequest = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const fromUser = req.user._id;

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return res.status(404).json({ error: 'User not found' });

    targetUser.chatRequests.push({ from: fromUser });
    await targetUser.save();

    res.status(200).json({ message: 'Chat request sent' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getChatRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('chatRequests.from', 'name email');
    res.status(200).json(user.chatRequests);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.respondToChatRequest = async (req, res) => {
  try {
    const { requesterId, action } = req.body;
    const user = await User.findById(req.user._id);

    const request = user.chatRequests.find(r => r.from.toString() === requesterId);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    request.status = action;

    if (action === 'accepted') {
      user.chatPartners.push(requesterId);
      const requester = await User.findById(requesterId);
      requester.chatPartners.push(req.user._id);
      await requester.save();
    }

    await user.save();
    res.status(200).json({ message: `Request ${action}` });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getChatPartners = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('chatPartners', 'name email');
    res.status(200).json(user.chatPartners);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: partnerId },
        { sender: partnerId, receiver: userId }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
