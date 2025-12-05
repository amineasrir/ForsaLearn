const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { User, Admin, Formateur, Visiteur } = require('../models/User');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');
const {
  sendFormateurApprovalEmail,
  sendFormateurRejectionEmail,
  sendCourseApprovalEmail,
  sendCourseRejectionEmail
} = require('../utils/emailService');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// DASHBOARD STATISTICS

// Get dashboard overview statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
    const totalFormateurs = await Formateur.countDocuments();
    const totalVisiteurs = await Visiteur.countDocuments();
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ status: 'published' });
    const pendingCourses = await Course.countDocuments({ status: 'pending' });
    
    // Get pending formateur approvals
    const pendingFormateurs = await Formateur.countDocuments({ isApproved: false });
    
    // Get total enrollments and revenue
    const coursesWithStats = await Course.find({});
    const totalEnrollments = coursesWithStats.reduce((sum, course) => sum + course.totalEnrollments, 0);
    const totalRevenue = coursesWithStats.reduce((sum, course) => sum + course.totalRevenue, 0);
    
    // Get recent activities (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsersThisMonth = await User.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo },
      role: { $ne: 'admin' }
    });
    const newCoursesThisMonth = await Course.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Get top performing courses
    const topCourses = await Course.find({ status: 'published' })
      .sort({ totalEnrollments: -1 })
      .limit(5)
      .select('title totalEnrollments totalRevenue averageRating')
      .populate('formateur', 'firstName lastName');
    
    // Get top formateurs by revenue
    const topFormateurs = await Formateur.find({ isApproved: true })
      .sort({ totalEarnings: -1 })
      .limit(5)
      .select('firstName lastName email totalEarnings totalStudents rating');
    
    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalFormateurs,
          totalVisiteurs,
          totalCourses,
          publishedCourses,
          pendingCourses,
          totalEnrollments,
          totalRevenue
        },
        pending: {
          formateurs: pendingFormateurs,
          courses: pendingCourses
        },
        thisMonth: {
          newUsers: newUsersThisMonth,
          newCourses: newCoursesThisMonth
        },
        topPerformers: {
          courses: topCourses,
          formateurs: topFormateurs
        }
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
});

// Get revenue statistics
router.get('/dashboard/revenue', async (req, res) => {
  try {
    const { period = 'month' } = req.query; // day, week, month, year
    
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
    
    // Get courses with enrollments in period
    const courses = await Course.find({
      'enrolledStudents.enrolledAt': { $gte: startDate }
    });
    
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

// USER MANAGEMENT

// Get all users with filters and pagination
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter = { role: { $ne: 'admin' } }; // Don't show admins
    
    if (req.query.role) {
      filter.role = req.query.role;
    }
    
    if (req.query.search) {
      filter.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }
    
    // Get users
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await User.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get single user details
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If formateur, get their courses
    let additionalData = {};
    if (user.role === 'formateur') {
      const courses = await Course.find({ formateur: user._id })
        .select('title status totalEnrollments totalRevenue');
      additionalData.courses = courses;
    }
    
    // If visiteur, get enrolled courses
    if (user.role === 'visiteur') {
      const enrolledCourses = await Course.find({ 
        'enrolledStudents.student': user._id 
      })
      .select('title')
      .populate('formateur', 'firstName lastName');
      additionalData.enrolledCourses = enrolledCourses;
    }
    
    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        ...additionalData
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error fetching user details' });
  }
});

// Update user status (activate/deactivate)
router.patch('/users/:id/status', async (req, res) => {
  try {
    const { isActive } = req.body;
    
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ message: 'isActive must be a boolean' });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot modify admin users' });
    }
    
    user.isActive = isActive;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Error updating user status' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }
    
    // If formateur, check if they have active courses
    if (user.role === 'formateur') {
      const activeCourses = await Course.countDocuments({ 
        formateur: user._id,
        totalEnrollments: { $gt: 0 }
      });
      
      if (activeCourses > 0) {
        return res.status(400).json({ 
          message: 'Cannot delete formateur with active courses. Deactivate instead.' 
        });
      }
    }
    
    await user.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// FORMATEUR APPROVAL MANAGEMENT

// Get all pending formateur approvals
router.get('/formateurs/pending', async (req, res) => {
  try {
    const pendingFormateurs = await Formateur.find({ isApproved: false })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: pendingFormateurs.length,
      data: pendingFormateurs
    });
  } catch (error) {
    console.error('Get pending formateurs error:', error);
    res.status(500).json({ message: 'Error fetching pending formateurs' });
  }
});

// Approve formateur
router.patch('/formateurs/:id/approve', async (req, res) => {
  try {
    const formateur = await Formateur.findById(req.params.id);
    
    if (!formateur) {
      return res.status(404).json({ message: 'Formateur not found' });
    }
    
    if (formateur.isApproved) {
      return res.status(400).json({ message: 'Formateur already approved' });
    }
    
    formateur.isApproved = true;
    formateur.approvedBy = req.user.id;
    formateur.approvedAt = Date.now();
    formateur.rejectionReason = undefined;
    
    await formateur.save();
    
    // Send approval email
    await sendFormateurApprovalEmail(formateur);
    
    res.status(200).json({
      success: true,
      message: 'Formateur approved successfully',
      data: formateur
    });
  } catch (error) {
    console.error('Approve formateur error:', error);
    res.status(500).json({ message: 'Error approving formateur' });
  }
});

// Reject formateur
router.patch('/formateurs/:id/reject',
  [
    body('reason').notEmpty().withMessage('Rejection reason is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const formateur = await Formateur.findById(req.params.id);
      
      if (!formateur) {
        return res.status(404).json({ message: 'Formateur not found' });
      }
      
      formateur.isApproved = false;
      formateur.rejectionReason = req.body.reason;
      
      await formateur.save();
      
      // Send rejection email
      await sendFormateurRejectionEmail(formateur, req.body.reason);
      
      res.status(200).json({
        success: true,
        message: 'Formateur rejected',
        data: formateur
      });
    } catch (error) {
      console.error('Reject formateur error:', error);
      res.status(500).json({ message: 'Error rejecting formateur' });
    }
  }
);

// COURSE APPROVAL MANAGEMENT

// Get all pending courses
router.get('/courses/pending', async (req, res) => {
  try {
    const pendingCourses = await Course.find({ status: 'pending' })
      .populate('formateur', 'firstName lastName email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: pendingCourses.length,
      data: pendingCourses
    });
  } catch (error) {
    console.error('Get pending courses error:', error);
    res.status(500).json({ message: 'Error fetching pending courses' });
  }
});

// Get all courses (admin view)
router.get('/courses', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const filter = {};
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const courses = await Course.find(filter)
      .populate('formateur', 'firstName lastName email')
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

// Approve course
router.patch('/courses/:id/approve', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (course.status === 'published') {
      return res.status(400).json({ message: 'Course already published' });
    }
    
    course.status = 'published';
    course.isApproved = true;
    course.isPublished = true;
    course.approvedBy = req.user.id;
    course.approvedAt = Date.now();
    course.publishedAt = Date.now();
    course.rejectionReason = undefined;
    
    await course.save();
    
    // Get formateur info and send approval email
    const formateur = await Formateur.findById(course.formateur);
    await sendCourseApprovalEmail(course, formateur);
    
    res.status(200).json({
      success: true,
      message: 'Course approved and published successfully',
      data: course
    });
  } catch (error) {
    console.error('Approve course error:', error);
    res.status(500).json({ message: 'Error approving course' });
  }
});

// Reject course
router.patch('/courses/:id/reject',
  [
    body('reason').notEmpty().withMessage('Rejection reason is required')
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
      
      course.status = 'rejected';
      course.isApproved = false;
      course.isPublished = false;
      course.rejectionReason = req.body.reason;
      
      await course.save();
      
      // Get formateur info and send rejection email
      const formateur = await Formateur.findById(course.formateur);
      await sendCourseRejectionEmail(course, formateur, req.body.reason);
      
      res.status(200).json({
        success: true,
        message: 'Course rejected',
        data: course
      });
    } catch (error) {
      console.error('Reject course error:', error);
      res.status(500).json({ message: 'Error rejecting course' });
    }
  }
);

// Delete course (admin can delete any course)
router.delete('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
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

// Toggle featured status
router.patch('/courses/:id/featured', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    course.isFeatured = !course.isFeatured;
    await course.save();
    
    res.status(200).json({
      success: true,
      message: `Course ${course.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      data: course
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({ message: 'Error updating featured status' });
  }
});

// BULK OPERATIONS

// Bulk approve formateurs
router.post('/formateurs/bulk-approve',
  [
    body('ids').isArray({ min: 1 }).withMessage('IDs array is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const result = await Formateur.updateMany(
        { _id: { $in: req.body.ids }, isApproved: false },
        { 
          $set: { 
            isApproved: true,
            approvedBy: req.user.id,
            approvedAt: Date.now()
          },
          $unset: { rejectionReason: "" }
        }
      );
      
      res.status(200).json({
        success: true,
        message: `${result.modifiedCount} formateurs approved successfully`
      });
    } catch (error) {
      console.error('Bulk approve error:', error);
      res.status(500).json({ message: 'Error approving formateurs' });
    }
  }
);

// Bulk approve courses
router.post('/courses/bulk-approve',
  [
    body('ids').isArray({ min: 1 }).withMessage('IDs array is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const result = await Course.updateMany(
        { _id: { $in: req.body.ids }, status: 'pending' },
        { 
          $set: { 
            status: 'published',
            isApproved: true,
            isPublished: true,
            approvedBy: req.user.id,
            approvedAt: Date.now(),
            publishedAt: Date.now()
          },
          $unset: { rejectionReason: "" }
        }
      );
      
      res.status(200).json({
        success: true,
        message: `${result.modifiedCount} courses approved successfully`
      });
    } catch (error) {
      console.error('Bulk approve courses error:', error);
      res.status(500).json({ message: 'Error approving courses' });
    }
  }
);

module.exports = router;