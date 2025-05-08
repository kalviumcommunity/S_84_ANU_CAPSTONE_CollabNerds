const Project = require('../models/Project');
const User = require('../models/User');  // Ensure you have User model imported
const mongoose = require('mongoose');

// Create a new project
const createProject = async (req, res) => {
  try {
    const { title, description, techStack } = req.body;

    // Check if the required fields are present
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and Description are required.' });
    }

    // Create a new project
    const newProject = new Project({
      name: title,
      description,
      techStack,
      createdBy: req.user._id,  // The user from the JWT token
      collaborators: [req.user._id],  // Add creator as the first collaborator
    });

    // Save the new project to the database
    await newProject.save();

    // Respond with the created project
    res.status(201).json(newProject);
  } catch (err) {
    console.error('❌ Error creating project:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Get all the projects created by the logged-in user
const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id });

    if (!projects) {
      return res.status(404).json({ message: 'No projects found for this user.' });
    }

    res.status(200).json(projects);
  } catch (err) {
    console.error('❌ Error fetching projects:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Get all projects that the logged-in user is a collaborator on
const getMyContributions = async (req, res) => {
  try {
    const projects = await Project.find({ collaborators: req.user._id });

    if (!projects) {
      return res.status(404).json({ message: 'No contributions found for this user.' });
    }

    res.status(200).json(projects);
  } catch (err) {
    console.error('❌ Error fetching contributions:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Request to join a project
const requestToJoinProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the user is already a collaborator
    if (project.collaborators.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are already a collaborator on this project.' });
    }

    // Add the user's request to join
    project.collaborators.push(req.user._id);
    await project.save();

    res.status(200).json({ message: 'Join request sent successfully' });
  } catch (err) {
    console.error('❌ Error requesting to join project:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Accept a collaboration request and add a user to the project
const acceptCollabRequest = async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Ensure the project owner is accepting the request
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not the owner of this project' });
    }

    // Add the collaborator to the project
    if (!project.collaborators.includes(userId)) {
      project.collaborators.push(userId);
      await project.save();
      res.status(200).json({ message: 'Collaboration request accepted' });
    } else {
      res.status(400).json({ message: 'User is already a collaborator' });
    }
  } catch (err) {
    console.error('❌ Error accepting collaboration request:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await project.deleteOne();  // ✅ Correct way to delete in Mongoose

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createProject,
  getMyProjects,
  getMyContributions,
  requestToJoinProject,
  acceptCollabRequest,
  deleteProject,
};
