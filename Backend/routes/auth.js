const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const JWT_SECRET = "SeCrEt_KeY";
const {
  createProject,
  getMyProjects,
  deleteProject
} = require('../controllers/projectController');

// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const newUser = await User.create({ name, email, password });
    // const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({user: { id: newUser._id, name: newUser.name } });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User must signup first.' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// Profile (Protected Route)
router.get('/profile', protect, (req, res) => {
  res.json({ message: 'This is a protected profile route', user: req.user });
});

router.post('/', protect, createProject);
router.get('/my-projects', protect, getMyProjects);
router.delete('/:projectId', protect, deleteProject);

module.exports = router;
