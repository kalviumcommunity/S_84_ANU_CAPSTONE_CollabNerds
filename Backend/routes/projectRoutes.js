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

router.post('/', protect, createProject);
router.get('/mine', protect, getMyProjects);
router.get('/contributions', protect, getMyContributions);
router.post('/:id/request', protect, requestToJoinProject);
router.post('/:id/accept', protect, acceptCollabRequest);
router.delete('/:id', protect, deleteProject);

module.exports = router;