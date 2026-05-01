// routes/certificate.js
const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');
const {
  verifyCertificate
} = require('../utils/certificateGenerator');
const { issueCertificateForCompletion } = require('../utils/issueCertificate');
const { User } = require('../models/User');

// PUBLIC ROUTES

// Verify certificate by ID (public)
router.get('/verify/:certificateId', async (req, res) => {
  try {
    const { certificateId } = req.params;
    
    const certificate = await Certificate.verifyCertificateById(certificateId);
    
    if (!certificate) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: 'Certificate not found or has been revoked'
      });
    }
    
    res.status(200).json({
      success: true,
      valid: true,
      data: {
        certificateId: certificate.certificateId,
        studentName: certificate.student.fullName,
        courseName: certificate.courseName,
        instructorName: certificate.instructorName,
        completionDate: certificate.completionDate,
        verificationUrl: certificate.verificationUrl,
        verifiedCount: certificate.verifiedCount
      }
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    res.status(500).json({ message: 'Error verifying certificate' });
  }
});

// Download certificate (public if student shares link)
router.get('/download/:certificateId', async (req, res) => {
  try {
    const { certificateId } = req.params;
    
    const certificate = await Certificate.findOne({ certificateId, status: 'active' });
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    // Return the PDF URL for download
    res.status(200).json({
      success: true,
      downloadUrl: `${process.env.API_URL || 'http://localhost:5000'}${certificate.pdfUrl}`
    });
  } catch (error) {
    console.error('Download certificate error:', error);
    res.status(500).json({ message: 'Error downloading certificate' });
  }
});

// STUDENT ROUTES

// Get my certificates
router.get('/my-certificates',
  protect,
  authorize('visiteur'),
  async (req, res) => {
    try {
      const certificates = await Certificate.getStudentCertificates(req.user.id);
      
      res.status(200).json({
        success: true,
        count: certificates.length,
        data: certificates
      });
    } catch (error) {
      console.error('Get certificates error:', error);
      res.status(500).json({ message: 'Error fetching certificates' });
    }
  }
);

// Generate certificate for completed course
router.post('/generate/:courseId',
  protect,
  authorize('visiteur'),
  async (req, res) => {
    try {
      const { courseId } = req.params;
      
      // Get course and check if student completed it
      const course = await Course.findById(courseId).populate('formateur', 'fullName');
      
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      
      // Check if student is enrolled
      const enrollment = course.enrolledStudents.find(
        e => e.student.toString() === req.user.id
      );
      
      if (!enrollment) {
        return res.status(403).json({ message: 'You are not enrolled in this course' });
      }
      
      // Check if course is completed
      if (enrollment.progress < 100) {
        return res.status(400).json({
          message: 'Course not completed yet',
          progress: enrollment.progress
        });
      }
      
      const certificateResult = await issueCertificateForCompletion({
        course,
        student: req.user,
        enrollment,
        reqMeta: {
          ipAddress: req.ip,
          userAgent: req.get('user-agent')
        }
      });

      await course.save();
      
      res.status(certificateResult.issued ? 201 : 200).json({
        success: true,
        message: certificateResult.issued ? 'Certificate generated successfully' : 'Certificate already generated',
        data: certificateResult.certificate
      });
    } catch (error) {
      console.error('Generate certificate error:', error);
      res.status(500).json({ message: 'Error generating certificate' });
    }
  }
);

// Get certificate details
router.get('/:id',
  protect,
  async (req, res) => {
    try {
      const certificate = await Certificate.findById(req.params.id)
        .populate('student', 'fullName email')
        .populate('course', 'title thumbnail')
        .populate('instructor', 'fullName');
      
      if (!certificate) {
        return res.status(404).json({ message: 'Certificate not found' });
      }
      
      // Check authorization
      if (
        certificate.student._id.toString() !== req.user.id &&
        certificate.instructor._id.toString() !== req.user.id &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      res.status(200).json({
        success: true,
        data: certificate
      });
    } catch (error) {
      console.error('Get certificate error:', error);
      res.status(500).json({ message: 'Error fetching certificate' });
    }
  }
);

// INSTRUCTOR ROUTES

// Get certificates issued by instructor
router.get('/instructor/issued',
  protect,
  authorize('formateur'),
  async (req, res) => {
    try {
      const certificates = await Certificate.getInstructorCertificates(req.user.id);
      
      res.status(200).json({
        success: true,
        count: certificates.length,
        data: certificates
      });
    } catch (error) {
      console.error('Get instructor certificates error:', error);
      res.status(500).json({ message: 'Error fetching certificates' });
    }
  }
);

// ADMIN ROUTES

// Get all certificates
router.get('/admin/all',
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;
      
      const filter = {};
      
      if (req.query.status) {
        filter.status = req.query.status;
      }
      
      const certificates = await Certificate.find(filter)
        .populate('student', 'fullName email')
        .populate('course', 'title')
        .populate('instructor', 'fullName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await Certificate.countDocuments(filter);
      
      res.status(200).json({
        success: true,
        count: certificates.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: certificates
      });
    } catch (error) {
      console.error('Get all certificates error:', error);
      res.status(500).json({ message: 'Error fetching certificates' });
    }
  }
);

// Get certificate statistics
router.get('/admin/stats',
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      const stats = await Certificate.getCertificateStats(startDate, endDate);
      
      res.status(200).json({
        success: true,
        data: stats[0] || {
          totalCertificates: 0,
          totalVerifications: 0,
          avgVerifications: 0
        }
      });
    } catch (error) {
      console.error('Get certificate stats error:', error);
      res.status(500).json({ message: 'Error fetching statistics' });
    }
  }
);

// Revoke certificate
router.patch('/:id/revoke',
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const { reason } = req.body;
      
      if (!reason) {
        return res.status(400).json({ message: 'Revocation reason is required' });
      }
      
      const certificate = await Certificate.findById(req.params.id);
      
      if (!certificate) {
        return res.status(404).json({ message: 'Certificate not found' });
      }
      
      if (certificate.status === 'revoked') {
        return res.status(400).json({ message: 'Certificate already revoked' });
      }
      
      await certificate.revoke(reason, req.user.id);
      
      res.status(200).json({
        success: true,
        message: 'Certificate revoked successfully',
        data: certificate
      });
    } catch (error) {
      console.error('Revoke certificate error:', error);
      res.status(500).json({ message: 'Error revoking certificate' });
    }
  }
);

// Bulk generate certificates for a course
router.post('/admin/bulk-generate/:courseId',
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const { courseId } = req.params;
      
      const course = await Course.findById(courseId).populate('formateur', 'fullName');
      
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      
      // Get all students who completed the course but don't have certificates
      const completedStudents = course.enrolledStudents.filter(
        e => e.progress === 100 && !e.certificateIssued
      );
      
      if (completedStudents.length === 0) {
        return res.status(400).json({
          message: 'No students eligible for certificates'
        });
      }
      
      const generated = [];
      const errors = [];
      
      for (const enrollment of completedStudents) {
        try {
          const student = await User.findById(enrollment.student).select('fullName email language');

          const certificateResult = await issueCertificateForCompletion({
            course,
            student,
            enrollment,
            reqMeta: {
              ipAddress: req.ip,
              userAgent: req.get('user-agent')
            }
          });

          if (certificateResult.certificate) {
            generated.push(certificateResult.certificate);
          }
        } catch (err) {
          errors.push({
            studentId: enrollment.student,
            error: err.message
          });
        }
      }
      
      await course.save();
      
      res.status(200).json({
        success: true,
        message: `Generated ${generated.length} certificates`,
        generated: generated.length,
        errors: errors.length,
        errorDetails: errors
      });
    } catch (error) {
      console.error('Bulk generate error:', error);
      res.status(500).json({ message: 'Error generating certificates' });
    }
  }
);

module.exports = router;
