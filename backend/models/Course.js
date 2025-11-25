const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    minlength: [20, 'Description must be at least 20 characters'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  formateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Formateur is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Web Development',
      'Mobile Development',
      'Data Science',
      'Machine Learning',
      'Design',
      'Marketing',
      'Business',
      'Photography',
      'Music',
      'Language Learning',
      'Other'
    ]
  },
  subcategory: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  level: {
    type: String,
    required: [true, 'Course level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
    default: 'All Levels'
  },
  language: {
    type: String,
    required: [true, 'Course language is required'],
    enum: ['Arabic', 'English', 'French'],
    default: 'Arabic'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  priceType: {
    type: String,
    enum: ['free', 'paid', 'semi-free'],
    default: 'paid'
  },
  discount: {
    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    validUntil: {
      type: Date
    }
  },
  sections: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    order: {
      type: Number,
      required: true
    },
    lessons: [{
      title: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        trim: true
      },
      type: {
        type: String,
        enum: ['video', 'article', 'quiz', 'assignment', 'file'],
        required: true
      },
      content: {
        type: String
      },
      duration: {
        type: Number,
        default: 0
      },
      isFree: {
        type: Boolean,
        default: false 
      },
      order: {
        type: Number,
        required: true
      },
      resources: [{
        name: {
          type: String,
          required: true
        },
        type: {
          type: String,
          enum: ['pdf', 'doc', 'zip', 'code', 'link', 'other']
        },
        url: {
          type: String,
          required: true
        },
        size: Number
      }]
    }]
  }],
  thumbnail: {
    type: String,
    default: 'default-course-thumbnail.jpg'
  },
  requirements: [{
    type: String,
    trim: true
  }],
  learningOutcomes: [{
    type: String,
    required: true,
    trim: true
  }],
  targetAudience: [{
    type: String,
    trim: true
  }],
  totalDuration: {
    type: Number,
    default: 0
  },
  enrolledStudents: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    completedLessons: [{
      type: mongoose.Schema.Types.ObjectId
    }],
    lastAccessedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalEnrollments: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: 1000
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'pending', 'published', 'rejected', 'archived'],
    default: 'draft'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  certificateEnabled: {
    type: Boolean,
    default: true
  },
  certificateTemplate: {
    type: String
  },
  metaTitle: {
    type: String,
    maxlength: 70
  },
  metaDescription: {
    type: String,
    maxlength: 160
  },
  metaKeywords: [{
    type: String
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;