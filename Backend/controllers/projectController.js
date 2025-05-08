const Project = require('../models/Project');
const User = require('../models/User');
const mongoose = require('mongoose');

const createProject = async (req, res) => {
  try {
    const { name, description, techStack } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'Name and Description are required.' });
    }

    const newProject = new Project({
      name,
      description,
      techStack,
      createdBy: req.user._id,
      collaborators: [req.user._id],
    });

    await newProject.save();

    res.status(201).json(newProject);
  } catch (err) {
    console.error('❌ Error creating project:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};


// Get all projects created by the logged-in user
const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id });

    res.status(200).json(projects);
  } catch (err) {
    console.error('❌ Error fetching user projects:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Get all projects where the user is a collaborator
const getMyContributions = async (req, res) => {
  try {
    const projects = await Project.find({ 
      collaborators: req.user._id,
      createdBy: { $ne: req.user._id } // Only show contributions, not self-created
    });

    res.status(200).json(projects);
  } catch (err) {
    console.error('❌ Error fetching contributions:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Request to join a project (adds to pending requests)
const requestToJoinProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.createdBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You are the owner of this project' });
    }

    if (project.collaborators.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are already a collaborator on this project.' });
    }

    // You can extend this with a proper joinRequests array instead
    return res.status(200).json({ message: 'Join request noted. Please wait for approval.' });
  } catch (err) {
    console.error('❌ Error sending join request:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Accept a collaboration request (project owner action)
const acceptCollabRequest = async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to accept collaborators on this project.' });
    }

    if (project.collaborators.includes(userId)) {
      return res.status(400).json({ message: 'User is already a collaborator.' });
    }

    project.collaborators.push(userId);
    await project.save();

    res.status(200).json({ message: 'Collaboration request accepted.' });
  } catch (err) {
    console.error('❌ Error accepting collaborator:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await project.deleteOne();

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting project:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Update a project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    project.name = req.body.name || project.name;
    project.description = req.body.description || project.description;
    project.techStack = req.body.techStack || project.techStack;

    const updatedProject = await project.save();
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createProject,
  getMyProjects,
  getMyContributions,
  requestToJoinProject,
  acceptCollabRequest,
  deleteProject,
  updateProject,
};
