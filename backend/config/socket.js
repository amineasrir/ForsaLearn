// config/socket.js
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

let io;

// INITIALIZE SOCKET.IO

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
  });

  // AUTHENTICATION MIDDLEWARE
  
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: Token required'));
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      // Attach user to socket
      socket.userId = user._id.toString();
      socket.userRole = user.role;
      socket.userName = user.fullName;
      
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  // CONNECTION HANDLER
  
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userName} (${socket.userId})`);

    // Join user's personal room
    socket.join(socket.userId);

    // Emit online status
    socket.broadcast.emit('user-online', {
      userId: socket.userId,
      userName: socket.userName
    });

    
    // CHAT EVENTS
    
    // Join a conversation
    socket.on('join-conversation', async (conversationId) => {
      try {
        socket.join(conversationId);
        console.log(`User ${socket.userName} joined conversation ${conversationId}`);
        
        // Notify others in the conversation
        socket.to(conversationId).emit('user-joined', {
          userId: socket.userId,
          userName: socket.userName,
          conversationId
        });
      } catch (error) {
        console.error('Join conversation error:', error);
        socket.emit('error', { message: 'Failed to join conversation' });
      }
    });

    // Leave a conversation
    socket.on('leave-conversation', (conversationId) => {
      socket.leave(conversationId);
      console.log(`User ${socket.userName} left conversation ${conversationId}`);
      
      socket.to(conversationId).emit('user-left', {
        userId: socket.userId,
        userName: socket.userName,
        conversationId
      });
    });

    // Send message
    socket.on('send-message', async (data) => {
      try {
        const { conversationId, content, type } = data;
        
        // Message will be saved to DB in the route handler
        // Here we just broadcast it in real-time
        const message = {
          conversationId,
          sender: socket.userId,
          senderName: socket.userName,
          content,
          type: type || 'text',
          timestamp: new Date(),
          tempId: data.tempId // For optimistic UI updates
        };

        // Send to all users in the conversation except sender
        socket.to(conversationId).emit('new-message', message);
        
        // Send back to sender for confirmation
        socket.emit('message-sent', {
          tempId: data.tempId,
          message
        });
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('message-error', {
          tempId: data.tempId,
          error: 'Failed to send message'
        });
      }
    });

    // Typing indicator
    socket.on('typing-start', ({ conversationId }) => {
      socket.to(conversationId).emit('user-typing', {
        userId: socket.userId,
        userName: socket.userName,
        conversationId
      });
    });

    socket.on('typing-stop', ({ conversationId }) => {
      socket.to(conversationId).emit('user-stop-typing', {
        userId: socket.userId,
        conversationId
      });
    });

    // Mark messages as read
    socket.on('mark-read', ({ conversationId, messageIds }) => {
      socket.to(conversationId).emit('messages-read', {
        userId: socket.userId,
        conversationId,
        messageIds
      });
    });

    // NOTIFICATION EVENTS
    
    // Send notification to specific user
    socket.on('send-notification', ({ userId, notification }) => {
      io.to(userId).emit('new-notification', notification);
    });

    // DISCONNECT HANDLER
    
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userName}`);
      
      // Broadcast offline status
      socket.broadcast.emit('user-offline', {
        userId: socket.userId,
        userName: socket.userName
      });
    });

    // ERROR HANDLER

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  console.log('Socket.IO initialized');
  return io;
};

// HELPER FUNCTIONS

// Get Socket.IO instance
const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

// Emit to specific user
const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(userId).emit(event, data);
  }
};

// Emit to conversation
const emitToConversation = (conversationId, event, data) => {
  if (io) {
    io.to(conversationId).emit(event, data);
  }
};

// Emit to all connected users
const emitToAll = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

// Get online users count
const getOnlineUsersCount = () => {
  if (io) {
    return io.sockets.sockets.size;
  }
  return 0;
};

// Check if user is online
const isUserOnline = (userId) => {
  if (io) {
    const room = io.sockets.adapter.rooms.get(userId);
    return room && room.size > 0;
  }
  return false;
};

module.exports = {
  initializeSocket,
  getIO,
  emitToUser,
  emitToConversation,
  emitToAll,
  getOnlineUsersCount,
  isUserOnline
};
