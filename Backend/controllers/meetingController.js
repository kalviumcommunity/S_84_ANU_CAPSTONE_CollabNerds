const Meeting = require('../models/Meeting');

exports.createMeeting = async (req, res) => {
  try {
    const { title, description, projectId, participants, scheduledFor } = req.body;
    const meeting = await Meeting.create({
      title,
      description,
      projectId,
      participants,
      scheduledFor,
      createdBy: req.user._id
    });
    res.status(201).json(meeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUpcomingMeetings = async (req, res) => {
  try {
    const now = new Date();
    const future = new Date(now);
    future.setDate(now.getDate() + 7);

    const meetings = await Meeting.find({
      participants: req.user._id,
      scheduledFor: { $gte: now, $lte: future }
    });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMeeting = async (req, res) => {
  try {
    const { title, description, scheduledFor, participants } = req.body;
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    if (!meeting.createdBy.equals(req.user._id)) return res.status(403).json({ message: 'Unauthorized' });

    meeting.title = title || meeting.title;
    meeting.description = description || meeting.description;
    meeting.scheduledFor = scheduledFor || meeting.scheduledFor;
    meeting.participants = participants || meeting.participants;
    await meeting.save();

    res.json(meeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    if (!meeting.createdBy.equals(req.user._id)) return res.status(403).json({ message: 'Unauthorized' });
    await meeting.deleteOne();
    res.json({ message: 'Meeting deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};