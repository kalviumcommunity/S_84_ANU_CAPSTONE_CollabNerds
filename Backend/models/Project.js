const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true }, // ✅ Changed from name to title
  description: { type: String, required: true },
  techStack: { type: String },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
