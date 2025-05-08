const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const meetingController = require('../controllers/meetingController');

// These should be functions!
router.post('/', protect, meetingController.createMeeting);
router.get('/upcoming', protect, meetingController.getUpcomingMeetings);
router.delete('/:id', protect, meetingController.deleteMeeting);

module.exports = router;