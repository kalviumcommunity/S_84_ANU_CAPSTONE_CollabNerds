const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const User = require('../models/User');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');

// ✅ GET profile
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// ✅ UPDATE profile
router.put('/', protect, async (req, res) => {
  try {
    const {
      name,
      email,
      role,
      location,
      dob,
      bio,
      skills,
      socialLinks
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        email,
        role,
        location,
        dob: dob ? new Date(dob) : null,
        bio,
        skills,
        socialLinks: {
          github: socialLinks.github || '',
          linkedin: socialLinks.linkedin || '',
          twitter: socialLinks.twitter || '',
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

// ✅ Upload photo
router.post('/upload-photo', protect, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const imagePath = `/uploads/profile_images/${req.file.filename}`;

  try {
    const user = await User.findById(req.user.id);

    // Remove old image from disk
    if (user.profileImage) {
      const oldPath = path.join(__dirname, '..', user.profileImage);
      fs.unlink(oldPath, err => {
        if (err) console.warn('⚠️ Failed to delete old image:', err.message);
      });
    }

    user.profileImage = imagePath;
    await user.save();

    res.json({ message: 'Image uploaded', profileImage: imagePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// ✅ Delete photo
router.delete('/delete-photo', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.profileImage) {
      return res.status(404).json({ error: 'No image to delete' });
    }

    const fullPath = path.join(__dirname, '..', user.profileImage);
    fs.unlink(fullPath, (err) => {
      if (err) console.warn('⚠️ File might already be deleted:', err.message);
    });

    user.profileImage = '';
    await user.save();

    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
