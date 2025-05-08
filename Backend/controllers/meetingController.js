const Meeting = require('../models/Meeting');

// Create Meeting
exports.createMeeting = async (req, res) => {
  try {
    const { title, description, scheduledFor } = req.body;
    const meeting = await Meeting.create({
      title,
      description,
      scheduledFor,
      createdBy: req.user._id, // assuming user is authenticated
    });
    res.status(201).json(meeting);
  } catch (err) {
    console.error("❌ Error in createMeeting:", err);
    res.status(500).json({ error: "Failed to create meeting" });
  }
};

// Get Upcoming Meetings
exports.getUpcomingMeetings = async (req, res) => {
  try {
    const now = new Date();
    const upcomingMeetings = await Meeting.find({
      scheduledFor: { $gte: now },
    }).sort({ scheduledFor: 1 });
    res.status(200).json(upcomingMeetings);
  } catch (err) {
    console.error("❌ Error in getUpcomingMeetings:", err);
    res.status(500).json({ error: "Failed to fetch meetings" });
  }
};

// Delete Meeting by ID
exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }
    if (meeting.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized to delete this meeting" });
    }
    await meeting.deleteOne();
    res.status(200).json({ message: "Meeting deleted successfully" });
  } catch (err) {
    console.error("❌ Error in deleteMeeting:", err);
    res.status(500).json({ error: "Failed to delete meeting" });
  }
};
