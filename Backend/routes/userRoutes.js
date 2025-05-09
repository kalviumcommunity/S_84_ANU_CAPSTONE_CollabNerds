// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {protect} = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select('name email');
  res.json(users);
});

module.exports = router;
