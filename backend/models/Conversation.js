const mongoose = require('mongoose');

const generateTicketId = () => {
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  const timePart = Date.now().toString().slice(-6);
  return `SUP-${timePart}-${randomPart}`;
};

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  type: {
    type: String,
    enum: ['direct', 'group', 'support'],
    default: 'direct'
  },
  name: {
    type: String,
    trim: true,
    maxlength: 100,
    default: null
  },
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  mutedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  pinnedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  archivedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    default: null
  },
  supportTicket: {
    ticketId: {
      type: String,
      default: null,
      trim: true
    },
    subject: {
      type: String,
      default: '',
      trim: true,
      maxlength: 160
    },
    category: {
      type: String,
      enum: ['technical', 'billing', 'certificate', 'account', 'course', 'other'],
      default: 'other'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['open', 'pending', 'resolved', 'closed'],
      default: 'open'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    assignedAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolvedAt: {
      type: Date,
      default: null
    },
    closedAt: {
      type: Date,
      default: null
    }
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
conversationSchema.index({ participants: 1, lastMessageAt: -1 });
conversationSchema.index({ type: 1, isActive: 1 });
conversationSchema.index({ course: 1 });
conversationSchema.index({ 'supportTicket.ticketId': 1 }, { sparse: true });
conversationSchema.index({ 'supportTicket.status': 1 }, { sparse: true });

// Virtual for participant count
conversationSchema.virtual('participantCount').get(function() {
  return this.participants ? this.participants.length : 0;
});

// Method to check if user is participant
conversationSchema.methods.isParticipant = function(userId) {
  return this.participants.some(p => p.toString() === userId.toString());
};

// Method to add participant
conversationSchema.methods.addParticipant = async function(userId) {
  if (!this.isParticipant(userId)) {
    this.participants.push(userId);
    await this.save();
  }
};

// Method to remove participant
conversationSchema.methods.removeParticipant = async function(userId) {
  this.participants = this.participants.filter(
    p => p.toString() !== userId.toString()
  );
  await this.save();
};

// Static method to find or create direct conversation
conversationSchema.statics.findOrCreateDirect = async function(user1Id, user2Id) {
  let conversation = await this.findOne({
    type: 'direct',
    participants: { $all: [user1Id, user2Id], $size: 2 }
  }).populate('participants', 'fullName email role profilePicture')
    .populate('lastMessage');

  if (!conversation) {
    conversation = await this.create({
      type: 'direct',
      participants: [user1Id, user2Id]
    });
    
    conversation = await this.findById(conversation._id)
      .populate('participants', 'fullName email role profilePicture')
      .populate('lastMessage');
  }

  return conversation;
};

// Static method to get user conversations
conversationSchema.statics.getUserConversations = async function(userId, filters = {}) {
  const query = {
    participants: userId,
    isActive: true
  };

  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.archived) {
    query.archivedBy = userId;
  } else {
    query.archivedBy = { $ne: userId };
  }

  return await this.find(query)
    .populate('participants', 'fullName email role profilePicture')
    .populate('lastMessage')
    .populate('course', 'title thumbnail')
    .sort({ lastMessageAt: -1 })
    .lean();
};

// Pre-save middleware
conversationSchema.pre('save', function(next) {
  if (this.type === 'direct' && this.participants.length !== 2) {
    return next(new Error('Direct conversation must have exactly 2 participants'));
  }

  if (this.type === 'support') {
    if (!this.supportTicket) {
      this.supportTicket = {};
    }

    if (!this.supportTicket.ticketId) {
      this.supportTicket.ticketId = generateTicketId();
    }
  }

  next();
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
