const mongoose = require('mongoose');
const slugify = (value = '') => value
  .toString()
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const quizQuestionSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer', 'essay'],
    default: 'multiple-choice'
  },
  options: [{
    text: {
      type: String,
      trim: true
    },
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],
  correctAnswer: {
    type: String,
    trim: true
  },
  acceptableAnswers: [{
    type: String,
    trim: true
  }],
  explanation: {
    type: String,
    trim: true
  },
  points: {
    type: Number,
    default: 1,
    min: 0
  },
  order: {
    type: Number,
    default: 1
  }
}, { _id: true });

const lessonQuizSchema = new mongoose.Schema({
  instructions: {
    type: String,
    trim: true
  },
  passingScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  timeLimit: {
    type: Number,
    default: 0,
    min: 0
  },
  allowRetry: {
    type: Boolean,
    default: true
  },
  maxAttempts: {
    type: Number,
    default: 0,
    min: 0
  },
  questions: [quizQuestionSchema]
}, { _id: false });

const quizAnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  selectedAnswer: {
    type: String,
    default: ''
  },
  isCorrect: {
    type: Boolean,
    default: false
  },
  pointsEarned: {
    type: Number,
    default: 0,
    min: 0
  }
}, { _id: false });

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
      quiz: {
        type: lessonQuizSchema,
        default: () => ({})
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
  videoUrl: {
    type: String,
    trim: true
  },
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
    completedAt: {
      type: Date
    },
    certificateIssued: {
      type: Boolean,
      default: false
    },
    certificateUrl: {
      type: String
    },
    quizAttempts: [{
      lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      answers: [quizAnswerSchema],
      score: {
        type: Number,
        default: 0
      },
      totalPoints: {
        type: Number,
        default: 0
      },
      percentageScore: {
        type: Number,
        default: 0
      },
      passed: {
        type: Boolean,
        default: false
      },
      status: {
        type: String,
        enum: ['submitted', 'passed', 'failed'],
        default: 'submitted'
      },
      attemptNumber: {
        type: Number,
        default: 1
      },
      startedAt: {
        type: Date,
        default: Date.now
      },
      completedAt: {
        type: Date,
        default: Date.now
      }
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
  comments: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    subject: {
      type: String,
      trim: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000
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

courseSchema.pre('save', function(next) {
  if ((this.isModified('title') || !this.slug) && this.title) {
    this.slug = slugify(this.title);
  }

  if (this.isModified('sections')) {
    const lessons = (this.sections || []).flatMap((section) => section.lessons || []);
    this.totalDuration = lessons.reduce((sum, lesson) => sum + Number(lesson.duration || 0), 0);
  }

  next();
});

courseSchema.methods.enrollStudent = async function(studentId) {
  const alreadyEnrolled = this.enrolledStudents.some(
    (enrollment) => enrollment.student.toString() === studentId.toString()
  );

  if (alreadyEnrolled) {
    throw new Error('Student already enrolled in this course');
  }

  this.enrolledStudents.push({
    student: studentId,
    enrolledAt: new Date(),
    progress: 0,
    completedLessons: [],
    lastAccessedAt: new Date()
  });

  this.totalEnrollments = this.enrolledStudents.length;

  if (Number(this.price || 0) > 0) {
    this.totalRevenue += Number(this.finalPrice || this.price || 0);
  }

  await this.save();
  return this;
};

courseSchema.methods.updateProgress = function(studentId, lessonId) {
  const enrollment = this.enrolledStudents.find(
    (item) => item.student.toString() === studentId.toString()
  );

  if (!enrollment) {
    throw new Error('Student is not enrolled in this course');
  }

  const normalizedLessonId = lessonId.toString();
  const alreadyCompleted = enrollment.completedLessons.some(
    (completedLessonId) => completedLessonId.toString() === normalizedLessonId
  );

  if (!alreadyCompleted) {
    enrollment.completedLessons.push(new mongoose.Types.ObjectId(normalizedLessonId));
  }

  const totalLessons = (this.sections || []).reduce(
    (sum, section) => sum + ((section.lessons || []).length),
    0
  );

  const completedLessonsCount = enrollment.completedLessons.length;
  enrollment.progress = totalLessons > 0
    ? Math.min(100, Math.round((completedLessonsCount / totalLessons) * 100))
    : 0;
  enrollment.lastAccessedAt = new Date();

  if (enrollment.progress >= 100 && !enrollment.completedAt) {
    enrollment.completedAt = new Date();
  }

  return enrollment;
};

courseSchema.methods.findLessonById = function(lessonId) {
  for (const section of this.sections || []) {
    const lesson = (section.lessons || []).find(
      (item) => item._id.toString() === lessonId.toString()
    );

    if (lesson) {
      return { section, lesson };
    }
  }

  return null;
};

courseSchema.methods.submitQuizAttempt = function(studentId, lessonId, submittedAnswers = []) {
  const enrollment = this.enrolledStudents.find(
    (item) => item.student.toString() === studentId.toString()
  );

  if (!enrollment) {
    throw new Error('Student is not enrolled in this course');
  }

  const locatedLesson = this.findLessonById(lessonId);
  if (!locatedLesson) {
    throw new Error('Quiz lesson not found');
  }

  const { lesson } = locatedLesson;
  if (lesson.type !== 'quiz') {
    throw new Error('Selected lesson is not a quiz');
  }

  const questions = lesson.quiz?.questions || [];
  if (!questions.length) {
    throw new Error('This quiz has no questions yet');
  }

  const previousAttempts = enrollment.quizAttempts.filter(
    (attempt) => attempt.lessonId.toString() === lessonId.toString()
  );

  if (lesson.quiz?.allowRetry === false && previousAttempts.length > 0) {
    throw new Error('This quiz can only be submitted once');
  }

  if (lesson.quiz?.maxAttempts > 0 && previousAttempts.length >= lesson.quiz.maxAttempts) {
    throw new Error('You have reached the maximum number of attempts for this quiz');
  }

  const normalizedAnswerMap = new Map(
    submittedAnswers.map((answer) => [answer.questionId?.toString(), String(answer.selectedAnswer || '').trim()])
  );

  const evaluatedAnswers = questions.map((question) => {
    const selectedAnswer = normalizedAnswerMap.get(question._id.toString()) || '';
    const normalizedSelected = selectedAnswer.trim().toLowerCase();
    const normalizedCorrectAnswer = String(question.correctAnswer || '').trim().toLowerCase();
    const acceptableAnswers = [
      normalizedCorrectAnswer,
      ...(question.acceptableAnswers || []).map((answer) => String(answer || '').trim().toLowerCase())
    ].filter(Boolean);

    let isCorrect = false;

    if (question.type === 'multiple-choice' || question.type === 'true-false') {
      const correctOption = (question.options || []).find((option) => option.isCorrect);
      isCorrect = Boolean(
        correctOption &&
        normalizedSelected &&
        normalizedSelected === String(correctOption.text || '').trim().toLowerCase()
      );
    } else {
      isCorrect = Boolean(
        normalizedSelected &&
        acceptableAnswers.includes(normalizedSelected)
      );
    }

    return {
      questionId: question._id,
      selectedAnswer,
      isCorrect,
      pointsEarned: isCorrect ? Number(question.points || 0) : 0
    };
  });

  const score = evaluatedAnswers.reduce((sum, answer) => sum + Number(answer.pointsEarned || 0), 0);
  const totalPoints = questions.reduce((sum, question) => sum + Number(question.points || 0), 0);
  const percentageScore = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
  const passed = percentageScore >= Number(lesson.quiz?.passingScore || 50);
  const attemptNumber = previousAttempts.length + 1;

  enrollment.quizAttempts.push({
    lessonId,
    answers: evaluatedAnswers,
    score,
    totalPoints,
    percentageScore,
    passed,
    status: passed ? 'passed' : 'failed',
    attemptNumber,
    completedAt: new Date()
  });

  enrollment.lastAccessedAt = new Date();

  return {
    enrollment,
    lesson,
    attempt: enrollment.quizAttempts[enrollment.quizAttempts.length - 1]
  };
};

courseSchema.methods.calculateAverageRating = function() {
  if (!this.reviews.length) {
    this.averageRating = 0;
    this.totalReviews = 0;
    return;
  }

  const totalRating = this.reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
  this.totalReviews = this.reviews.length;
  this.averageRating = Number((totalRating / this.reviews.length).toFixed(1));
};

courseSchema.virtual('finalPrice').get(function() {
  const discountPercentage = Number(this.discount?.percentage || 0);
  if (!discountPercentage) {
    return Number(this.price || 0);
  }

  const discountAmount = (Number(this.price || 0) * discountPercentage) / 100;
  return Math.max(0, Number(this.price || 0) - discountAmount);
});

courseSchema.statics.searchCourses = function(query) {
  return this.find({
    isPublished: true,
    status: 'published',
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { category: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  });
};

courseSchema.statics.findFeatured = function(limit = 8) {
  return this.find({
    isPublished: true,
    status: 'published',
    isFeatured: true
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

courseSchema.statics.findPopular = function(limit = 10) {
  return this.find({
    isPublished: true,
    status: 'published'
  })
    .sort({ totalEnrollments: -1, averageRating: -1 })
    .limit(limit);
};

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
