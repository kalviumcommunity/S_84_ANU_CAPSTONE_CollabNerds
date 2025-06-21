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

router.post('/upload-photo', protect, upload.single('image'), async (req, res) => {
  console.log("📦 Incoming file:", req.file);  // <--- ADD THIS
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    user.profileImage = base64Image;

    await user.save();

    res.json({ message: 'Image uploaded successfully', profileImage: base64Image });
  } catch (err) {
    console.error('Upload error:', err);  // FULL ERROR
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});



// ✅ Delete photo
router.delete('/delete-photo', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.profileImage) {
      return res.status(404).json({ error: 'No image to delete' });
    }

    user.profileImage = ''; // Just clear the field in MongoDB
    await user.save();

    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;