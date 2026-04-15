const mongoose = require('mongoose');

// CERTIFICATE SCHEMA

const certificateSchema = new mongoose.Schema({
  // Certificate ID (public facing)
  certificateId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  
  // Student Information
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required']
  },
  studentName: {
    type: String,
    required: true
  },
  
  // Course Information
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  courseName: {
    type: String,
    required: true
  },
  courseDuration: {
    type: Number, // Duration in hours
    required: true
  },
  
  // Instructor Information
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Instructor is required']
  },
  instructorName: {
    type: String,
    required: true
  },
  
  // Certificate File
  pdfUrl: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  
  // Completion Details
  completionDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  finalScore: {
    type: Number,
    min: 0,
    max: 100
  },
  
  // Certificate Status
  status: {
    type: String,
    enum: ['active', 'revoked', 'expired'],
    default: 'active'
  },
  
  // Revocation (if certificate is revoked)
  revocation: {
    reason: String,
    revokedAt: Date,
    revokedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Verification
  verifiedCount: {
    type: Number,
    default: 0
  },
  lastVerifiedAt: Date,
  
  // Metadata
  metadata: {
    generatedBy: String, // System or manual
    ipAddress: String,
    userAgent: String
  }
  
}, {
  timestamps: true
});

// INDEXES

certificateSchema.index({ certificateId: 1 });
certificateSchema.index({ student: 1, course: 1 }, { unique: true });
certificateSchema.index({ status: 1, createdAt: -1 });

// VIRTUAL FIELDS

// Check if certificate is valid
certificateSchema.virtual('isValid').get(function() {
  return this.status === 'active';
});

// Get verification URL
certificateSchema.virtual('verificationUrl').get(function() {
  return `${process.env.CLIENT_URL}/verify/${this.certificateId}`;
});

// METHODS

// Revoke certificate
certificateSchema.methods.revoke = async function(reason, revokedBy) {
  this.status = 'revoked';
  this.revocation = {
    reason,
    revokedAt: Date.now(),
    revokedBy
  };
  await this.save();
};

// Record verification attempt
certificateSchema.methods.recordVerification = async function() {
  this.verifiedCount += 1;
  this.lastVerifiedAt = Date.now();
  await this.save();
};

// STATIC METHODS

// Get student's certificates
certificateSchema.statics.getStudentCertificates = function(studentId) {
  return this.find({ student: studentId, status: 'active' })
    .populate('course', 'title thumbnail category')
    .populate('instructor', 'fullName')
    .sort({ completionDate: -1 });
};

// Verify certificate by ID
certificateSchema.statics.verifyCertificateById = async function(certificateId) {
  const certificate = await this.findOne({ certificateId, status: 'active' })
    .populate('student', 'fullName email')
    .populate('course', 'title')
    .populate('instructor', 'fullName');
  
  if (certificate) {
    await certificate.recordVerification();
  }
  
  return certificate;
};

// Get instructor's issued certificates
certificateSchema.statics.getInstructorCertificates = function(instructorId) {
  return this.find({ instructor: instructorId, status: 'active' })
    .populate('student', 'fullName')
    .populate('course', 'title')
    .sort({ completionDate: -1 });
};

// Get certificate statistics
certificateSchema.statics.getCertificateStats = async function(startDate, endDate) {
  const match = { status: 'active' };
  
  if (startDate || endDate) {
    match.completionDate = {};
    if (startDate) match.completionDate.$gte = new Date(startDate);
    if (endDate) match.completionDate.$lte = new Date(endDate);
  }
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalCertificates: { $sum: 1 },
        totalVerifications: { $sum: '$verifiedCount' },
        avgVerifications: { $avg: '$verifiedCount' }
      }
    }
  ]);
};

// MIDDLEWARE

// Populate fields on save
certificateSchema.pre('save', async function() {
  if (this.isNew) {
    // Populate names from references
    if (this.student && !this.studentName) {
      const User = mongoose.model('User');
      const student = await User.findById(this.student);
      this.studentName = student.fullName;
    }
    
    if (this.course && !this.courseName) {
      const Course = mongoose.model('Course');
      const course = await Course.findById(this.course);
      this.courseName = course.title;
      this.courseDuration = Math.round(course.totalDuration / 60); // Convert minutes to hours
    }
    
    if (this.instructor && !this.instructorName) {
      const User = mongoose.model('User');
      const instructor = await User.findById(this.instructor);
      this.instructorName = instructor.fullName;
    }
  }
});

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;
