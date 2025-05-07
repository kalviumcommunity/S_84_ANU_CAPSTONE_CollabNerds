// Simplified version of meetingRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');  // Ensure authentication middleware is correct
const {
  createMeeting,
  getUpcomingMeetings
} = require('../controllers/meetingController');

// Define routes
router.post('/', protect, createMeeting);  // POST to create a meeting
router.get('/upcoming', protect, getUpcomingMeetings);  // GET to get upcoming meetings

module.exports = router;
