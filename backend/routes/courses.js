const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Course = require('../models/Course');
const { protect, authorize, checkFormateurApproval } = require('../middleware/auth');
const {
  sendEnrollmentConfirmationEmail,
  sendNewStudentNotification
} = require('../utils/emailService');
const { Formateur } = require('../models/User');
const { User } = require('../models/User');
const { issueCertificateForCompletion } = require('../utils/issueCertificate');

// PUBLIC ROUTES - No authentication required

// Get all published courses (with filters and pagination)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Build filter query
    const filter = { isPublished: true, status: 'published' };
    
    // Filter by category
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    // Filter by level
    if (req.query.level) {
      filter.level = req.query.level;
    }
    
    // Filter by language
    if (req.query.language) {
      filter.language = req.query.language;
    }
    
    // Filter by price type
    if (req.query.priceType) {
      filter.priceType = req.query.priceType;
    }
    
    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }
    
    // Build sort options
    let sort = {};
    if (req.query.sort === 'popular') {
      sort = { totalEnrollments: -1 };
    } else if (req.query.sort === 'rating') {
      sort = { averageRating: -1 };
    } else if (req.query.sort === 'newest') {
      sort = { createdAt: -1 };
    } else if (req.query.sort === 'price-low') {
      sort = { price: 1 };
    } else if (req.query.sort === 'price-high') {
      sort = { price: -1 };
    } else {
      sort = { createdAt: -1 }; // Default sort
    }
    
    // Get courses with pagination
    const courses = await Course.find(filter)
      .populate('formateur', 'fullName email rating')
      .select('-enrolledStudents -reviews')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Course.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: courses
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// Search courses by text
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const courses = await Course.searchCourses(q)
      .populate('formateur', 'fullName email rating')
      .select('-enrolledStudents -reviews')
      .limit(20);
    
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Error searching courses' });
  }
});

// Get featured courses
router.get('/featured', async (req, res) => {
  try {
    const courses = await Course.findFeatured()
      .populate('formateur', 'fullName email rating');
    
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Get featured courses error:', error);
    res.status(500).json({ message: 'Error fetching featured courses' });
  }
});

// Get popular courses
router.get('/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const courses = await Course.findPopular(limit)
      .populate('formateur', 'fullName email rating');
    
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Get popular courses error:', error);
    res.status(500).json({ message: 'Error fetching popular courses' });
  }
});

// FORMATEUR ROUTES - Requires authentication

// Create new course (Formateur only, must be approved)
router.post('/',
  protect,
  authorize('formateur'),
  checkFormateurApproval,
  [
    body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
    body('description').trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
    body('category').notEmpty().withMessage('Category is required'),
    body('level').isIn(['Beginner', 'Intermediate', 'Advanced', 'All Levels']).withMessage('Invalid level'),
    body('language').isIn(['Arabic', 'English', 'French']).withMessage('Invalid language'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('priceType').isIn(['free', 'paid', 'semi-free']).withMessage('Invalid price type'),
    body('learningOutcomes').isArray({ min: 1 }).withMessage('At least one learning outcome is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      // Create course with formateur ID
      const courseData = {
        ...req.body,
        formateur: req.user.id,
        status: 'pending' // Needs admin approval
      };
      
      const course = await Course.create(courseData);
      
      res.status(201).json({
        success: true,
        message: 'Course created successfully. Waiting for admin approval.',
        data: course
      });
    } catch (error) {
      console.error('Create course error:', error);
      res.status(500).json({ message: 'Error creating course' });
    }
  }
);

// Get formateur's own courses
router.get('/formateur/my-courses', protect, authorize('formateur'), async (req, res) => {
  try {
    const courses = await Course.find({ formateur: req.user.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Get formateur courses error:', error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// Update course (Formateur can only update their own courses)
router.put('/:id', protect, authorize('formateur'), async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user owns this course
    if (course.formateur.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }
    
    // If course is published and making major changes, set status to pending
    if (course.isPublished && (req.body.title || req.body.description || req.body.sections)) {
      req.body.status = 'pending';
      req.body.isApproved = false;
    }
    
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Error updating course' });
  }
});

// Delete course (Formateur can only delete their own courses)
router.delete('/:id', protect, authorize('formateur'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user owns this course
    if (course.formateur.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }
    
    // Can't delete if students are enrolled
    if (course.totalEnrollments > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete course with enrolled students. Archive it instead.' 
      });
    }
    
    await course.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Error deleting course' });
  }
});

// STUDENT ROUTES

// Enroll in course
router.post('/:id/enroll', protect, authorize('visiteur'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (!course.isPublished) {
      return res.status(400).json({ message: 'Course is not available for enrollment' });
    }
    
    // Check if already enrolled
    const alreadyEnrolled = course.enrolledStudents.some(
      e => e.student.toString() === req.user.id
    );
    
    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    
    // For paid courses, payment should be handled before enrollment
    if (course.priceType === 'paid' && !req.body.paymentVerified) {
      return res.status(400).json({ 
        message: 'Payment required for this course'
      });
    }
    
    await course.enrollStudent(req.user.id);
    
    // Send enrollment confirmation email to student
    const formateur = await Formateur.findById(course.formateur);
    await sendEnrollmentConfirmationEmail(req.user, course, formateur);
    
    // Send notification to formateur
    await sendNewStudentNotification(formateur, req.user, course);
    
    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: course
    });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({ message: error.message || 'Error enrolling in course' });
  }
});

// Get student's enrolled courses
router.get('/student/my-courses', protect, authorize('visiteur'), async (req, res) => {
  try {
    const courses = await Course.find({
      'enrolledStudents.student': req.user.id
    })
    .populate('formateur', 'fullName')
    .select('-reviews');
    
    // Add enrollment details to each course
    const coursesWithProgress = courses.map(course => {
      const enrollment = course.enrolledStudents.find(
        e => e.student.toString() === req.user.id
      );
      
      return {
        ...course.toObject(),
        myProgress: enrollment.progress,
        enrolledAt: enrollment.enrolledAt,
        lastAccessedAt: enrollment.lastAccessedAt,
        completedAt: enrollment.completedAt,
        certificateIssued: enrollment.certificateIssued,
        certificateUrl: enrollment.certificateUrl
      };
    });
    
    res.status(200).json({
      success: true,
      count: coursesWithProgress.length,
      data: coursesWithProgress
    });
  } catch (error) {
    console.error('Get student courses error:', error);
    res.status(500).json({ message: 'Error fetching enrolled courses' });
  }
});

// Mark lesson as completed
router.post('/:courseId/lessons/:lessonId/complete', protect, authorize('visiteur'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    const enrollment = course.updateProgress(req.user.id, req.params.lessonId);

    let issuedCertificate = null;
    if (Number(enrollment.progress || 0) >= 100) {
      await course.populate('formateur', 'fullName');
      const student = await User.findById(req.user.id).select('fullName email language');

      const certificateResult = await issueCertificateForCompletion({
        course,
        student,
        enrollment,
        reqMeta: {
          ipAddress: req.ip,
          userAgent: req.get('user-agent')
        }
      });

      issuedCertificate = certificateResult.certificate || null;
    }

    await course.save();
    
    res.status(200).json({
      success: true,
      message: 'Lesson marked as completed',
      progress: enrollment.progress,
      completedAt: enrollment.completedAt,
      certificateIssued: enrollment.certificateIssued,
      certificateUrl: enrollment.certificateUrl,
      certificate: issuedCertificate
    });
  } catch (error) {
    console.error('Complete lesson error:', error);
    res.status(500).json({ message: error.message || 'Error updating progress' });
  }
});

// Add review to course
router.post('/:id/reviews', 
  protect, 
  authorize('visiteur'),
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const course = await Course.findById(req.params.id);
      
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      
      // Check if user is enrolled
      const isEnrolled = course.enrolledStudents.some(
        e => e.student.toString() === req.user.id
      );
      
      if (!isEnrolled) {
        return res.status(403).json({ message: 'You must be enrolled to review this course' });
      }
      
      // Check if user already reviewed
      const existingReview = course.reviews.find(
        r => r.user.toString() === req.user.id
      );
      
      if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this course' });
      }
      
      // Add review
      course.reviews.push({
        user: req.user.id,
        rating: req.body.rating,
        comment: req.body.comment
      });
      
      course.calculateAverageRating();
      await course.save();
      
      res.status(201).json({
        success: true,
        message: 'Review added successfully',
        data: course.reviews[course.reviews.length - 1]
      });
    } catch (error) {
      console.error('Add review error:', error);
      res.status(500).json({ message: 'Error adding review' });
    }
  }
);

// Get single course by ID or slug
router.get('/:id', async (req, res) => {
  try {
    let course;
    
    // Check if ID is a valid MongoDB ObjectId or a slug
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      course = await Course.findById(req.params.id)
        .populate('formateur', 'fullName email bio rating totalStudents')
        .populate('reviews.user', 'fullName');
    } else {
      course = await Course.findOne({ slug: req.params.id })
        .populate('formateur', 'fullName email bio rating totalStudents')
        .populate('reviews.user', 'fullName');
    }
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Only show published courses to public
    if (!course.isPublished && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'Course not available' });
    }
    
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Error fetching course' });
  }
});

module.exports = router;
