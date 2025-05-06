const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createMeeting,
  getUpcomingMeetings,
  updateMeeting,
  deleteMeeting
} = require('../controllers/meetingController');

router.post('/', protect, createMeeting);
router.get('/upcoming', protect, getUpcomingMeetings);
router.put('/:id', protect, updateMeeting);
router.delete('/:id', protect, deleteMeeting);

module.exports = router;