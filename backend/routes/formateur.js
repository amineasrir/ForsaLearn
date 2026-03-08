const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Course = require('../models/Course');
const { Visiteur } = require('../models/User');
const { protect, authorize, checkFormateurApproval } = require('../middleware/auth');

// All formateur routes require authentication and formateur role
router.use(protect);
router.use(authorize('formateur'));

// DASHBOARD STATISTICS

// checkFormateurApproval middleware ensures only approved formateurs can access these routes
router.get('/check-approval', (req, res) => {
  try {
    if (req.user.isApproved) {
      return res.status(200).json({
        success: true,
        isApproved: true,
        message: 'Your account is approved. You can access the dashboard.'
      });
    } else {
      return res.status(403).json({
        success: false,
        isApproved: false,
        message: 'Your account is not yet approved by admin. Please wait for approval.'
      });
    } 
  } catch (error) {
    console.error('Check approval error:', error);
    res.status(500).json({ message: 'Error checking approval status' });
  }
});

// Get formateur dashboard statistics
router.get('/dashboard/stats', checkFormateurApproval, async (req, res) => {
  try {
    // Get formateur's courses
    const courses = await Course.find({ formateur: req.user.id });
    
    // Calculate statistics
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(c => c.status === 'published').length;
    const pendingCourses = courses.filter(c => c.status === 'pending').length;
    const draftCourses = courses.filter(c => c.status === 'draft').length;
    const rejectedCourses = courses.filter(c => c.status === 'rejected').length;
    
    const totalEnrollments = courses.reduce((sum, course) => sum + course.totalEnrollments, 0);
    const totalRevenue = courses.reduce((sum, course) => sum + course.totalRevenue, 0);
    
    // Calculate average rating
    const coursesWithRatings = courses.filter(c => c.totalReviews > 0);
    const averageRating = coursesWithRatings.length > 0
      ? (coursesWithRatings.reduce((sum, c) => sum + parseFloat(c.averageRating), 0) / coursesWithRatings.length).toFixed(1)
      : 0;
    
    const totalReviews = courses.reduce((sum, course) => sum + course.totalReviews, 0);
    
    // Get recent enrollments (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    let recentEnrollments = 0;
    courses.forEach(course => {
      course.enrolledStudents.forEach(enrollment => {
        if (enrollment.enrolledAt >= thirtyDaysAgo) {
          recentEnrollments++;
        }
      });
    });
    
    // Get top performing courses
    const topCourses = [...courses]
      .sort((a, b) => b.totalEnrollments - a.totalEnrollments)
      .slice(0, 5)
      .map(course => ({
        _id: course._id,
        title: course.title,
        totalEnrollments: course.totalEnrollments,
        totalRevenue: course.totalRevenue,
        averageRating: course.averageRating,
        status: course.status
      }));
    
    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalCourses,
          publishedCourses,
          pendingCourses,
          draftCourses,
          rejectedCourses,
          totalEnrollments,
          totalRevenue,
          averageRating,
          totalReviews
        },
        thisMonth: {
          newEnrollments: recentEnrollments
        },
        topCourses
      }
    });
  } catch (error) {
    console.error('Formateur dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
});

// Get revenue statistics
router.get('/dashboard/revenue', checkFormateurApproval, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let startDate = new Date();
    if (period === 'day') {
      startDate.setDate(startDate.getDate() - 1);
    } else if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }
    
    // Get formateur's courses
    const courses = await Course.find({ formateur: req.user.id });
    
    // Calculate revenue by date
    const revenueByDate = {};
    courses.forEach(course => {
      course.enrolledStudents.forEach(enrollment => {
        if (enrollment.enrolledAt >= startDate) {
          const date = enrollment.enrolledAt.toISOString().split('T')[0];
          revenueByDate[date] = (revenueByDate[date] || 0) + course.price;
        }
      });
    });
    
    res.status(200).json({
      success: true,
      data: {
        period,
        revenueByDate,
        totalRevenue: Object.values(revenueByDate).reduce((a, b) => a + b, 0)
      }
    });
  } catch (error) {
    console.error('Revenue stats error:', error);
    res.status(500).json({ message: 'Error fetching revenue statistics' });
  }
});

// COURSE MANAGEMENT

// Get all formateur's courses
router.get('/courses', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filter = { formateur: req.user.id };
    
    // Filter by status
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    // Search
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const courses = await Course.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
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

// Get single course (formateur's own)
router.get('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      formateur: req.user.id
    })
    .populate('enrolledStudents.student', 'firstName lastName email')
    .populate('reviews.user', 'firstName lastName');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
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

// Create new course
router.post('/courses',
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

// Update course
router.put('/courses/:id', async (req, res) => {
  try {
    let course = await Course.findOne({
      _id: req.params.id,
      formateur: req.user.id
    });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // If course is published and making major changes, set status to pending
    if (course.isPublished && (req.body.title || req.body.description || req.body.sections)) {
      req.body.status = 'pending';
      req.body.isApproved = false;
      req.body.isPublished = false;
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

// Delete course
router.delete('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      formateur: req.user.id
    });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
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

// Archive/Unarchive course
router.patch('/courses/:id/archive', async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      formateur: req.user.id
    });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    course.status = course.status === 'archived' ? 'draft' : 'archived';
    await course.save();
    
    res.status(200).json({
      success: true,
      message: `Course ${course.status === 'archived' ? 'archived' : 'unarchived'} successfully`,
      data: course
    });
  } catch (error) {
    console.error('Archive course error:', error);
    res.status(500).json({ message: 'Error updating course status' });
  }
});

// ============================================
// STUDENT MANAGEMENT
// ============================================

// Get enrolled students for a specific course
router.get('/courses/:id/students', async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      formateur: req.user.id
    })
    .populate('enrolledStudents.student', 'firstName lastName email phoneNumber');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Format enrolled students data
    const students = course.enrolledStudents.map(enrollment => ({
      student: enrollment.student,
      enrolledAt: enrollment.enrolledAt,
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons.length,
      lastAccessedAt: enrollment.lastAccessedAt
    }));
    
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Error fetching enrolled students' });
  }
});

// Get all students across all formateur's courses
router.get('/students', async (req, res) => {
  try {
    const courses = await Course.find({ formateur: req.user.id })
      .populate('enrolledStudents.student', 'firstName lastName email');
    
    // Collect unique students
    const studentsMap = new Map();
    
    courses.forEach(course => {
      course.enrolledStudents.forEach(enrollment => {
        const studentId = enrollment.student._id.toString();
        if (!studentsMap.has(studentId)) {
          studentsMap.set(studentId, {
            student: enrollment.student,
            coursesEnrolled: [],
            totalProgress: 0,
            enrolledAt: enrollment.enrolledAt
          });
        }
        
        studentsMap.get(studentId).coursesEnrolled.push({
          courseId: course._id,
          courseTitle: course.title,
          progress: enrollment.progress
        });
        studentsMap.get(studentId).totalProgress += enrollment.progress;
      });
    });
    
    // Calculate average progress
    const students = Array.from(studentsMap.values()).map(data => ({
      ...data,
      averageProgress: (data.totalProgress / data.coursesEnrolled.length).toFixed(0)
    }));
    
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Error fetching students' });
  }
});

// ============================================
// REVIEWS MANAGEMENT
// ============================================

// Get all reviews for formateur's courses
router.get('/reviews', async (req, res) => {
  try {
    const courses = await Course.find({ formateur: req.user.id })
      .populate('reviews.user', 'firstName lastName')
      .select('title reviews');
    
    // Collect all reviews with course info
    const allReviews = [];
    courses.forEach(course => {
      course.reviews.forEach(review => {
        allReviews.push({
          courseId: course._id,
          courseTitle: course.title,
          user: review.user,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt
        });
      });
    });
    
    // Sort by date
    allReviews.sort((a, b) => b.createdAt - a.createdAt);
    
    res.status(200).json({
      success: true,
      count: allReviews.length,
      data: allReviews
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// Get reviews for specific course
router.get('/courses/:id/reviews', async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      formateur: req.user.id
    })
    .populate('reviews.user', 'firstName lastName')
    .select('title reviews averageRating totalReviews');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.status(200).json({
      success: true,
      courseTitle: course.title,
      averageRating: course.averageRating,
      totalReviews: course.totalReviews,
      data: course.reviews
    });
  } catch (error) {
    console.error('Get course reviews error:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// ============================================
// ANALYTICS
// ============================================

// Get course analytics
router.get('/courses/:id/analytics', async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      formateur: req.user.id
    });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Calculate analytics
    const totalStudents = course.enrolledStudents.length;
    const activeStudents = course.enrolledStudents.filter(
      e => new Date(e.lastAccessedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    
    const completedStudents = course.enrolledStudents.filter(
      e => e.progress === 100
    ).length;
    
    const averageProgress = totalStudents > 0
      ? (course.enrolledStudents.reduce((sum, e) => sum + e.progress, 0) / totalStudents).toFixed(0)
      : 0;
    
    // Enrollments by month
    const enrollmentsByMonth = {};
    course.enrolledStudents.forEach(enrollment => {
      const month = new Date(enrollment.enrolledAt).toISOString().substring(0, 7); // YYYY-MM
      enrollmentsByMonth[month] = (enrollmentsByMonth[month] || 0) + 1;
    });
    
    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalStudents,
          activeStudents,
          completedStudents,
          averageProgress,
          averageRating: course.averageRating,
          totalReviews: course.totalReviews,
          totalRevenue: course.totalRevenue
        },
        enrollmentsByMonth
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
});

module.exports = router;