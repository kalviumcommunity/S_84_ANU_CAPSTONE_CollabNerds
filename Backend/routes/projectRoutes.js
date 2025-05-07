// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createProject,
  getMyProjects,
  getMyContributions,
  requestToJoinProject,
  acceptCollabRequest,
  deleteProject
} = require('../controllers/projectController');

// Define routes
router.post('/', protect, createProject);
router.get('/my-projects', protect, getMyProjects);
router.get('/my-contributions', protect, getMyContributions);
router.post('/:projectId/request', protect, requestToJoinProject);
router.post('/:projectId/accept', protect, acceptCollabRequest);
router.delete('/:projectId', protect, deleteProject);

module.exports = router;
