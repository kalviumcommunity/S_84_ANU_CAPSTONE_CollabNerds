const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/request', authMiddleware, chatController.sendChatRequest);
router.get('/requests', authMiddleware, chatController.getChatRequests);
router.post('/respond', authMiddleware, chatController.respondToChatRequest);
router.get('/partners', authMiddleware, chatController.getChatPartners);
router.get('/messages/:partnerId', authMiddleware, chatController.getMessages);

module.exports = router;
