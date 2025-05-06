// backend/controllers/projectController.js
const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const project = await Project.create({
      title,
      description,
      tags,
      createdBy: req.user._id,
      collaborators: [],
      requests: []
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyContributions = async (req, res) => {
  try {
    const projects = await Project.find({ collaborators: req.user._id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.requestToJoinProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.requests.includes(req.user._id)) {
      project.requests.push(req.user._id);
      await project.save();
    }
    res.json({ message: 'Request sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.acceptCollabRequest = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const { userId } = req.body;
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.createdBy.equals(req.user._id)) return res.status(403).json({ message: 'Unauthorized' });
    if (project.requests.includes(userId)) {
      project.requests = project.requests.filter(id => id.toString() !== userId);
      project.collaborators.push(userId);
      await project.save();
    }
    res.json({ message: 'User added as collaborator' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.createdBy.equals(req.user._id)) return res.status(403).json({ message: 'Unauthorized' });
    await project.deleteOne();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};