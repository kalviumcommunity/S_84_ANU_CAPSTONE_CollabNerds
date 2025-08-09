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

const deletee = async (req, res) => {
  try {
    const { projectId } = req.params;

    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully', project: deletedProject });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
  .populate('createdBy', 'name email')
  .populate('collaborators', 'name email')
  .populate('pendingRequests', 'name email'); 

    res.status(200).json(projects);
  } catch (err) {
    console.error('❌ Error fetching all projects:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id })
      .populate('createdBy', 'name email')
      .populate('collaborators', 'name email')
      .populate('pendingRequests', 'name email'); // 🧠 VERY IMPORTANT!

    // console.log("✅ Fetched project with populated pendingRequests:", projects[0].pendingRequests);

    res.status(200).json(projects);
  } catch (err) {
    console.error('❌ Error in getMyProjects:', err.message);
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

    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.createdBy.toString() === req.user._id.toString())
      return res.status(400).json({ message: 'You are the owner of this project' });

    if (project.collaborators.includes(req.user._id))
      return res.status(400).json({ message: 'Already a collaborator' });

    if (project.pendingRequests.includes(req.user._id))
      return res.status(400).json({ message: 'Already requested' });

     project.pendingRequests.push(req.user._id);

    await project.save();

    res.status(200).json({ message: 'Join request sent' });
  } catch (err) {
    console.error('❌ Error sending join request:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};



const acceptCollabRequest = async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;

  try {
    const project = await Project.findById(projectId);
    const userIdStr = userId.toString();

    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    if (project.collaborators.some(user => user.toString() === userIdStr)) {
      return res.status(400).json({ message: 'Already a collaborator' });
    }

    if (!project.pendingRequests.some(id => id.toString() === userIdStr)) {
      return res.status(400).json({ message: 'User has not requested to join' });
    }

    // Add to collaborators
    project.collaborators.push(userId);
    // Remove from pending
    project.pendingRequests = project.pendingRequests.filter(id => id.toString() !== userIdStr);

    await project.save();

    const updatedProject = await Project.findById(projectId)
      .populate('createdBy', 'name email')
      .populate('collaborators', 'name email')
      .populate('pendingRequests', 'name email');

    res.status(200).json({ message: 'Accepted', project: updatedProject });

  } catch (err) {
    console.error('❌ Error accepting request:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

const rejectCollabRequest = async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    // Remove user from pending
    project.pendingRequests = project.pendingRequests.filter(
      id => id.toString() !== userId.toString()
    );

    await project.save();

    const updatedProject = await Project.findById(projectId)
      .populate('createdBy', 'name email')
      .populate('collaborators', 'name email')
      .populate('pendingRequests', 'name email');

    res.status(200).json({ message: 'Rejected', project: updatedProject });

  } catch (err) {
    console.error('❌ Error rejecting request:', err.message);
    res.status(500).json({ message: 'Server Error' });
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
  getMyProjects, // <- this one
  updateProject,
  deleteProject,
  requestToJoinProject,
  acceptCollabRequest,
  getAllProjects,
  rejectCollabRequest,
  deletee
};
