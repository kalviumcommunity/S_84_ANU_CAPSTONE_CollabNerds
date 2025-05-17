const express = require('express');
const router = express.Router();
const User = require('../models/User');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');

// GET user profile
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/', protect, async (req, res) => {
  const { name, bio, skills, socialLinks, dob, location, role } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          name,
          bio,
          skills,
          socialLinks,
          dob,
          location,
          role,
        },
      },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
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
