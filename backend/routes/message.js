// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const messageController = require('../controllers/messageController');
const { uploadMessageAttachment, handleUploadError } = require('../middleware/upload'); // For file uploads

// All routes require authentication
router.use(protect);

// Conversation routes
router.get('/conversations', messageController.getConversations);
router.get('/conversations/:conversationId', messageController.getConversation);
router.post('/conversations', messageController.createConversation);
router.delete('/conversations/:conversationId', messageController.deleteConversation);
router.patch('/support-tickets/:conversationId/status', messageController.updateSupportTicketStatus);

// Conversation management
router.patch('/conversations/:conversationId/mute', messageController.muteConversation);
router.patch('/conversations/:conversationId/unmute', messageController.unmuteConversation);
router.patch('/conversations/:conversationId/pin', messageController.pinConversation);
router.patch('/conversations/:conversationId/unpin', messageController.unpinConversation);
router.patch('/conversations/:conversationId/archive', messageController.archiveConversation);
router.patch('/conversations/:conversationId/unarchive', messageController.unarchiveConversation);

// Message routes
router.get('/conversations/:conversationId/messages', messageController.getMessages);
router.post('/conversations/:conversationId/messages', messageController.sendMessage);
router.post(
    '/conversations/:conversationId/messages/file',
    uploadMessageAttachment,
    handleUploadError,          
    messageController.sendFileMessage
  );
// Message actions
router.patch('/messages/:messageId', messageController.editMessage);
router.delete('/messages/:messageId', messageController.deleteMessage);
router.patch('/messages/:messageId/read', messageController.markAsRead);
router.patch('/conversations/:conversationId/read-all', messageController.markAllAsRead);

// Search messages
router.get('/search', messageController.searchMessages);

// Get unread count
router.get('/unread-count', messageController.getUnreadCount);

module.exports = router;
