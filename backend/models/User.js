const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Base User Schema - Common fields for all users
const baseOptions = {
  discriminatorKey: 'role', 
  timestamps: true, 
};

// Main User Schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[0-9]{10,15}$/, 'Please provide a valid phone number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default in queries
  },
  role: {
    type: String,
    enum: ['admin', 'formateur', 'visiteur'],
    required: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, baseOptions);

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) return next();
  
  // Generate salt and hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create base User model
const User = mongoose.model('User', userSchema);

// ============================================
// ADMIN MODEL
// ============================================
const Admin = User.discriminator('admin', new mongoose.Schema({
  // Admin has only base fields (firstName, lastName, email, phoneNumber, password)
  // No additional fields needed
  permissions: {
    type: [String],
    default: ['manage_users', 'manage_courses', 'manage_payments', 'view_statistics']
  },
  lastLogin: {
    type: Date
  }
}));

// ============================================
// FORMATEUR (INSTRUCTOR) MODEL
// ============================================
const Formateur = User.discriminator('formateur', new mongoose.Schema({
  skills: [{
    type: String,
    trim: true
  }],
  certificates: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['link', 'file'],
      required: true
    },
    value: {
      type: String, // URL for links, or file path for uploaded files
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  projects: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    type: {
      type: String,
      enum: ['link', 'file'],
      required: true
    },
    value: {
      type: String, // URL for links, or file path for uploaded files
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  isApproved: {
    type: Boolean,
    default: false // Admin must approve before formateur can create courses
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Reference to admin who approved
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  totalStudents: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}));

// ============================================
// VISITEUR (STUDENT/LEARNER) MODEL
// ============================================
const Visiteur = User.discriminator('visiteur', new mongoose.Schema({
  skillsNeeded: [{
    type: String,
    trim: true
  }],
  interests: [{
    type: String,
    trim: true
  }],
  enrolledCourses: [{
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date,
    certificateIssued: {
      type: Boolean,
      default: false
    },
    certificateUrl: String
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  totalCoursesCompleted: {
    type: Number,
    default: 0
  }
}));

module.exports = {
  User,
  Admin,
  Formateur,
  Visiteur
};