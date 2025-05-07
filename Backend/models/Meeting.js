// models/Meeting.js
const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // Remove projectId field or make it optional
  projectId: {
    type: mongoose.Schema.Types.ObjectId,  // Remove this if you don't need it
    ref: 'Project',
    required: false,  // Make this optional if it's not required
  },
  scheduledFor: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;
