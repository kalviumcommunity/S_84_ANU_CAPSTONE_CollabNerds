const express = require('express');
const router = express.Router();
const User = require('../models/User');
const upload = require('../middleware/upload');
const {protect} = require('../middleware/authMiddleware'); // if using JWT auth

// GET user profile
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE user profile
router.put('/', protect, async (req, res) => {
  const { name, bio, skills, socialLinks } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          name,
          bio,
          skills,
          socialLinks,
        },
      },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// UPLOAD profile image
router.post('/upload-photo', protect, upload.single('image'), async (req, res) => {
  try {
    const imagePath = `/uploads/profile_images/${req.file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: imagePath },
      { new: true }
    ).select('-password');

    res.json({ message: 'Image uploaded', profileImage: imagePath, user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
