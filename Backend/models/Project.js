const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Name of the project
  description: { type: String, required: true },  // Project description
  techStack: { type: String },  // Optional tech stack
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // User references
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Project creator
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
