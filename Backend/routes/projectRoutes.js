const express = require('express'); // ✅ FIXED
const router = express.Router();    // ✅ FIXED

const {
  createProject,
  getMyProjects,
  updateProject,
  deleteProject,
  requestToJoinProject,
  acceptCollabRequest,
  getAllProjects,
  deletee ,
  rejectCollabRequest  

} = require('../controllers/projectController');

const { protect } = require('../middleware/authMiddleware');

router.post('/:projectId/accept', protect, acceptCollabRequest);
router.delete('/:projectId' , deletee) 
router.get('/',  getAllProjects);
router.post('/', protect, createProject);
router.get('/my-projects', protect, getMyProjects);
router.put('/:projectId', protect, updateProject);
router.delete('/:projectId', protect, deleteProject);
router.post('/:projectId/join', protect, requestToJoinProject);
router.post('/:projectId/reject', protect, rejectCollabRequest);
// router.post('/:projectId/accept', protect, acceptCollabRequest);

module.exports = router;
