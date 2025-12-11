const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const { emitToConversation, emitToUser } = require('../config/socket');
const asyncHandler = require('express-async-handler');

// @desc    Get all conversations for current user
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
  const { type, archived } = req.query;
  
  const filters = {};
  if (type) filters.type = type;
  if (archived === 'true') filters.archived = true;

  const conversations = await Conversation.getUserConversations(req.user._id, filters);

  // Get unread count for each conversation
  const conversationsWithUnread = await Promise.all(
    conversations.map(async (conv) => {
      const unreadCount = await Message.getUnreadCount(conv._id, req.user._id);
      return {
        ...conv,
        unreadCount
      };
    })
  );

  res.json({
    success: true,
    count: conversationsWithUnread.length,
    data: conversationsWithUnread
  });
});

// @desc    Get single conversation
// @route   GET /api/messages/conversations/:conversationId
// @access  Private
const getConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.conversationId)
    .populate('participants', 'firstName lastName email role profilePicture')
    .populate('lastMessage')
    .populate('course', 'title thumbnail');

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  // Check if user is participant
  if (!conversation.isParticipant(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to access this conversation');
  }

  const unreadCount = await Message.getUnreadCount(conversation._id, req.user._id);

  res.json({
    success: true,
    data: {
      ...conversation.toObject(),
      unreadCount
    }
  });
});

// @desc    Create new conversation (direct or group)
// @route   POST /api/messages/conversations
// @access  Private
const createConversation = asyncHandler(async (req, res) => {
  const { type, participantIds, name, courseId } = req.body;

  // Validate input
  if (!type || !participantIds || participantIds.length === 0) {
    res.status(400);
    throw new Error('Type and participants are required');
  }

  // Add current user to participants if not included
  const participants = [...new Set([...participantIds, req.user._id.toString()])];

  // For direct conversations, check if already exists
  if (type === 'direct') {
    if (participants.length !== 2) {
      res.status(400);
      throw new Error('Direct conversation must have exactly 2 participants');
    }

    const existingConv = await Conversation.findOrCreateDirect(
      participants[0],
      participants[1]
    );

    return res.status(200).json({
      success: true,
      data: existingConv
    });
  }

  // Create group or support conversation
  const conversationData = {
    type,
    participants,
    name,
    course: courseId || null
  };

  if (type === 'group') {
    conversationData.groupAdmin = req.user._id;
  }

  const conversation = await Conversation.create(conversationData);

  const populatedConversation = await Conversation.findById(conversation._id)
    .populate('participants', 'firstName lastName email role profilePicture')
    .populate('course', 'title thumbnail');

  // Notify all participants
  participants.forEach(participantId => {
    if (participantId !== req.user._id.toString()) {
      emitToUser(participantId, 'new-conversation', {
        conversation: populatedConversation
      });
    }
  });

  res.status(201).json({
    success: true,
    data: populatedConversation
  });
});

// @desc    Delete conversation
// @route   DELETE /api/messages/conversations/:conversationId
// @access  Private
const deleteConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.conversationId);

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  if (!conversation.isParticipant(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized');
  }

  // For group conversations, only admin can delete
  if (conversation.type === 'group' && 
      conversation.groupAdmin.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only group admin can delete conversation');
  }

  await conversation.deleteOne();

  // Notify all participants
  conversation.participants.forEach(participantId => {
    emitToUser(participantId.toString(), 'conversation-deleted', {
      conversationId: conversation._id
    });
  });

  res.json({
    success: true,
    message: 'Conversation deleted'
  });
});

// @desc    Get messages in a conversation
// @route   GET /api/messages/conversations/:conversationId/messages
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const conversationId = req.params.conversationId;

  // Check if conversation exists and user is participant
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  if (!conversation.isParticipant(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to access these messages');
  }

  const skip = (page - 1) * limit;

  const messages = await Message.find({
    conversation: conversationId,
    isDeleted: false
  })
    .populate('sender', 'firstName lastName profilePicture role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Message.countDocuments({
    conversation: conversationId,
    isDeleted: false
  });

  res.json({
    success: true,
    data: messages.reverse(), // Reverse to show oldest first
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Send a message
// @route   POST /api/messages/conversations/:conversationId/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { content, type = 'text' } = req.body;
  const conversationId = req.params.conversationId;

  if (!content || content.trim() === '') {
    res.status(400);
    throw new Error('Message content is required');
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  if (!conversation.isParticipant(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to send messages in this conversation');
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: req.user._id,
    content,
    type
  });

  // Update conversation's last message
  conversation.lastMessage = message._id;
  conversation.lastMessageAt = new Date();
  await conversation.save();

  const populatedMessage = await Message.findById(message._id)
    .populate('sender', 'firstName lastName profilePicture role');

  // Emit to all participants in conversation
  emitToConversation(conversationId, 'new-message', {
    message: populatedMessage
  });

  // Send notifications to other participants
  conversation.participants.forEach(participantId => {
    if (participantId.toString() !== req.user._id.toString()) {
      emitToUser(participantId.toString(), 'new-notification', {
        type: 'message',
        conversationId,
        senderId: req.user._id,
        senderName: `${req.user.firstName} ${req.user.lastName}`,
        content: content.substring(0, 100)
      });
    }
  });

  res.status(201).json({
    success: true,
    data: populatedMessage
  });
});

// @desc    Send a file message
// @route   POST /api/messages/conversations/:conversationId/messages/file
// @access  Private
const sendFileMessage = asyncHandler(async (req, res) => {
  const conversationId = req.params.conversationId;
  const { caption = '' } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  if (!conversation.isParticipant(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized');
  }

  // Determine message type based on file mimetype
  let messageType = 'file';
  if (req.file.mimetype.startsWith('image/')) {
    messageType = 'image';
  } else if (req.file.mimetype.startsWith('video/')) {
    messageType = 'video';
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: req.user._id,
    content: caption,
    type: messageType,
    fileUrl: req.file.path, // URL from cloudinary or local storage
    fileName: req.file.originalname,
    fileSize: req.file.size
  });

  conversation.lastMessage = message._id;
  conversation.lastMessageAt = new Date();
  await conversation.save();

  const populatedMessage = await Message.findById(message._id)
    .populate('sender', 'firstName lastName profilePicture role');

  emitToConversation(conversationId, 'new-message', {
    message: populatedMessage
  });

  res.status(201).json({
    success: true,
    data: populatedMessage
  });
});

// @desc    Edit a message
// @route   PATCH /api/messages/:messageId
// @access  Private
const editMessage = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim() === '') {
    res.status(400);
    throw new Error('Message content is required');
  }

  const message = await Message.findById(req.params.messageId);

  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  if (message.sender.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to edit this message');
  }

  if (message.isDeleted) {
    res.status(400);
    throw new Error('Cannot edit deleted message');
  }

  message.content = content;
  await message.save();

  const populatedMessage = await Message.findById(message._id)
    .populate('sender', 'firstName lastName profilePicture role');

  emitToConversation(message.conversation.toString(), 'message-edited', {
    message: populatedMessage
  });

  res.json({
    success: true,
    data: populatedMessage
  });
});

// @desc    Delete a message
// @route   DELETE /api/messages/:messageId
// @access  Private
const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.messageId);

  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  if (message.sender.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this message');
  }

  message.isDeleted = true;
  message.deletedAt = new Date();
  message.content = 'This message has been deleted';
  await message.save();

  emitToConversation(message.conversation.toString(), 'message-deleted', {
    messageId: message._id,
    conversationId: message.conversation
  });

  res.json({
    success: true,
    message: 'Message deleted'
  });
});

// @desc    Mark message as read
// @route   PATCH /api/messages/:messageId/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.messageId);

  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  await message.markAsRead(req.user._id);

  emitToConversation(message.conversation.toString(), 'message-read', {
    messageId: message._id,
    userId: req.user._id
  });

  res.json({
    success: true,
    message: 'Message marked as read'
  });
});

// @desc    Mark all messages in conversation as read
// @route   PATCH /api/messages/conversations/:conversationId/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  const conversationId = req.params.conversationId;

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  if (!conversation.isParticipant(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized');
  }

  await Message.updateMany(
    {
      conversation: conversationId,
      sender: { $ne: req.user._id },
      'readBy.user': { $ne: req.user._id }
    },
    {
      $push: {
        readBy: {
          user: req.user._id,
          readAt: new Date()
        }
      }
    }
  );

  emitToConversation(conversationId, 'messages-read-all', {
    userId: req.user._id,
    conversationId
  });

  res.json({
    success: true,
    message: 'All messages marked as read'
  });
});

// @desc    Mute conversation
// @route   PATCH /api/messages/conversations/:conversationId/mute
// @access  Private
const muteConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.conversationId);

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  if (!conversation.mutedBy.includes(req.user._id)) {
    conversation.mutedBy.push(req.user._id);
    await conversation.save();
  }

  res.json({
    success: true,
    message: 'Conversation muted'
  });
});

// @desc    Unmute conversation
// @route   PATCH /api/messages/conversations/:conversationId/unmute
// @access  Private
const unmuteConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.conversationId);

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  conversation.mutedBy = conversation.mutedBy.filter(
    id => id.toString() !== req.user._id.toString()
  );
  await conversation.save();

  res.json({
    success: true,
    message: 'Conversation unmuted'
  });
});

// @desc    Pin conversation
// @route   PATCH /api/messages/conversations/:conversationId/pin
// @access  Private
const pinConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.conversationId);

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  if (!conversation.pinnedBy.includes(req.user._id)) {
    conversation.pinnedBy.push(req.user._id);
    await conversation.save();
  }

  res.json({
    success: true,
    message: 'Conversation pinned'
  });
});

// @desc    Unpin conversation
// @route   PATCH /api/messages/conversations/:conversationId/unpin
// @access  Private
const unpinConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.conversationId);

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  conversation.pinnedBy = conversation.pinnedBy.filter(
    id => id.toString() !== req.user._id.toString()
  );
  await conversation.save();

  res.json({
    success: true,
    message: 'Conversation unpinned'
  });
});

// @desc    Archive conversation
// @route   PATCH /api/messages/conversations/:conversationId/archive
// @access  Private
const archiveConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.conversationId);

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  if (!conversation.archivedBy.includes(req.user._id)) {
    conversation.archivedBy.push(req.user._id);
    await conversation.save();
  }

  res.json({
    success: true,
    message: 'Conversation archived'
  });
});

// @desc    Unarchive conversation
// @route   PATCH /api/messages/conversations/:conversationId/unarchive
// @access  Private
const unarchiveConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.conversationId);

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  conversation.archivedBy = conversation.archivedBy.filter(
    id => id.toString() !== req.user._id.toString()
  );
  await conversation.save();

  res.json({
    success: true,
    message: 'Conversation unarchived'
  });
});

// @desc    Search messages
// @route   GET /api/messages/search
// @access  Private
const searchMessages = asyncHandler(async (req, res) => {
  const { query, conversationId } = req.query;

  if (!query) {
    res.status(400);
    throw new Error('Search query is required');
  }

  const searchQuery = {
    content: { $regex: query, $options: 'i' },
    isDeleted: false
  };

  if (conversationId) {
    searchQuery.conversation = conversationId;
  } else {
    // Search only in user's conversations
    const userConversations = await Conversation.find({
      participants: req.user._id
    }).select('_id');
    
    searchQuery.conversation = {
      $in: userConversations.map(c => c._id)
    };
  }

  const messages = await Message.find(searchQuery)
    .populate('sender', 'firstName lastName profilePicture')
    .populate('conversation')
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({
    success: true,
    count: messages.length,
    data: messages
  });
});

// @desc    Get total unread count
// @route   GET /api/messages/unread-count
// @access  Private
const getUnreadCount = asyncHandler(async (req, res) => {
  const userConversations = await Conversation.find({
    participants: req.user._id,
    archivedBy: { $ne: req.user._id }
  }).select('_id');

  const conversationIds = userConversations.map(c => c._id);

  const unreadCount = await Message.countDocuments({
    conversation: { $in: conversationIds },
    sender: { $ne: req.user._id },
    'readBy.user': { $ne: req.user._id },
    isDeleted: false
  });

  res.json({
    success: true,
    data: { unreadCount }
  });
});

module.exports = {
  getConversations,
  getConversation,
  createConversation,
  deleteConversation,
  getMessages,
  sendMessage,
  sendFileMessage,
  editMessage,
  deleteMessage,
  markAsRead,
  markAllAsRead,
  muteConversation,
  unmuteConversation,
  pinConversation,
  unpinConversation,
  archiveConversation,
  unarchiveConversation,
  searchMessages,
  getUnreadCount
};