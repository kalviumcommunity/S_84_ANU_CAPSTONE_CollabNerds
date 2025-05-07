// controllers/meetingController.js
const Meeting = require('../models/Meeting');

exports.createMeeting = async (req, res) => {
  try {
    const { title, description, scheduledFor } = req.body;

    // Create the meeting (no projectId required anymore)
    const meeting = await Meeting.create({
      title,
      description,
      scheduledFor,
      createdBy: req.user._id,  // assuming the user is logged in and we have a valid user object
    });

    res.status(201).json(meeting);
  } catch (err) {
    console.error("❌ Error in createMeeting:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getUpcomingMeetings = async (req, res) => {
  try {
    const now = new Date();
    const upcomingMeetings = await Meeting.find({
      scheduledFor: { $gte: now },
    }).sort({ scheduledFor: 1 });

    res.status(200).json(upcomingMeetings);
  } catch (err) {
    console.error("❌ Error in getUpcomingMeetings:", err);
    res.status(500).json({ error: err.message });
  }
};
