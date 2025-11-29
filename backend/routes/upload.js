// routes/upload.js
const express = require('express');
const router = express.Router();
const path = require('path');
const { protect, authorize, checkFormateurApproval } = require('../middleware/auth');
const {
  uploadCourseThumbnail,
  uploadCourseVideo,
  uploadCourseResources,
  uploadCertificate,
  uploadProject,
  uploadProfile,
  handleUploadError,
  deleteFile,
  getFileSize,
  formatFileSize
} = require('../middleware/upload');
const Course = require('../models/Course');
const { Formateur, User } = require('../models/User');

// ============================================
// COURSE THUMBNAIL UPLOAD
// ============================================

// Upload course thumbnail (Formateur only)
router.post('/course/thumbnail',
  protect,
  authorize('formateur'),
  checkFormateurApproval,
  (req, res, next) => {
    uploadCourseThumbnail(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res, next);
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload an image file'
        });
      }
      
      // Get file info
      const fileUrl = `/uploads/courses/thumbnails/${req.file.filename}`;
      const fileSize = getFileSize(req.file.path);
      
      res.status(200).json({
        success: true,
        message: 'Thumbnail uploaded successfully',
        data: {
          filename: req.file.filename,
          url: fileUrl,
          size: formatFileSize(fileSize),
          mimetype: req.file.mimetype
        }
      });
    } catch (error) {
      console.error('Upload thumbnail error:', error);
      res.status(500).json({ message: 'Error uploading thumbnail' });
    }
  }
);

// ============================================
// COURSE VIDEO UPLOAD
// ============================================

// Upload course video (Formateur only)
router.post('/course/video',
  protect,
  authorize('formateur'),
  checkFormateurApproval,
  (req, res, next) => {
    uploadCourseVideo(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res, next);
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a video file'
        });
      }
      
      const fileUrl = `/uploads/courses/videos/${req.file.filename}`;
      const fileSize = getFileSize(req.file.path);
      
      res.status(200).json({
        success: true,
        message: 'Video uploaded successfully',
        data: {
          filename: req.file.filename,
          url: fileUrl,
          size: formatFileSize(fileSize),
          mimetype: req.file.mimetype
        }
      });
    } catch (error) {
      console.error('Upload video error:', error);
      res.status(500).json({ message: 'Error uploading video' });
    }
  }
);

// ============================================
// COURSE RESOURCES UPLOAD
// ============================================

// Upload course resources (multiple files)
router.post('/course/resources',
  protect,
  authorize('formateur'),
  checkFormateurApproval,
  (req, res, next) => {
    uploadCourseResources(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res, next);
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please upload at least one file'
        });
      }
      
      const uploadedFiles = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        url: `/uploads/courses/resources/${file.filename}`,
        size: formatFileSize(getFileSize(file.path)),
        mimetype: file.mimetype
      }));
      
      res.status(200).json({
        success: true,
        message: `${req.files.length} file(s) uploaded successfully`,
        data: uploadedFiles
      });
    } catch (error) {
      console.error('Upload resources error:', error);
      res.status(500).json({ message: 'Error uploading resources' });
    }
  }
);

// ============================================
// FORMATEUR CERTIFICATE UPLOAD
// ============================================

// Upload formateur certificate
router.post('/formateur/certificate',
  protect,
  authorize('formateur'),
  (req, res, next) => {
    uploadCertificate(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res, next);
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a certificate file'
        });
      }
      
      const { name } = req.body;
      
      if (!name) {
        // Delete uploaded file if name is missing
        deleteFile(req.file.path);
        return res.status(400).json({
          success: false,
          message: 'Certificate name is required'
        });
      }
      
      // Add certificate to formateur profile
      const formateur = await Formateur.findById(req.user.id);
      
      formateur.certificates.push({
        name,
        type: 'file',
        value: `/uploads/certificates/${req.file.filename}`,
        uploadedAt: Date.now()
      });
      
      await formateur.save();
      
      res.status(200).json({
        success: true,
        message: 'Certificate uploaded successfully',
        data: {
          name,
          filename: req.file.filename,
          url: `/uploads/certificates/${req.file.filename}`,
          size: formatFileSize(getFileSize(req.file.path))
        }
      });
    } catch (error) {
      console.error('Upload certificate error:', error);
      // Delete file on error
      if (req.file) deleteFile(req.file.path);
      res.status(500).json({ message: 'Error uploading certificate' });
    }
  }
);

// ============================================
// FORMATEUR PROJECT UPLOAD
// ============================================

// Upload formateur project
router.post('/formateur/project',
  protect,
  authorize('formateur'),
  (req, res, next) => {
    uploadProject(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res, next);
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a project file'
        });
      }
      
      const { title, description } = req.body;
      
      if (!title) {
        deleteFile(req.file.path);
        return res.status(400).json({
          success: false,
          message: 'Project title is required'
        });
      }
      
      // Add project to formateur profile
      const formateur = await Formateur.findById(req.user.id);
      
      formateur.projects.push({
        title,
        description: description || '',
        type: 'file',
        value: `/uploads/projects/${req.file.filename}`,
        uploadedAt: Date.now()
      });
      
      await formateur.save();
      
      res.status(200).json({
        success: true,
        message: 'Project uploaded successfully',
        data: {
          title,
          description,
          filename: req.file.filename,
          url: `/uploads/projects/${req.file.filename}`,
          size: formatFileSize(getFileSize(req.file.path))
        }
      });
    } catch (error) {
      console.error('Upload project error:', error);
      if (req.file) deleteFile(req.file.path);
      res.status(500).json({ message: 'Error uploading project' });
    }
  }
);

// ============================================
// PROFILE PICTURE UPLOAD
// ============================================

// Upload profile picture (All users)
router.post('/profile/picture',
  protect,
  (req, res, next) => {
    uploadProfile(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res, next);
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload an image file'
        });
      }
      
      // Update user profile picture
      const user = await User.findById(req.user.id);
      
      // Delete old profile picture if exists
      if (user.profilePicture && user.profilePicture !== 'default-avatar.jpg') {
        const oldPath = path.join(__dirname, '..', user.profilePicture);
        deleteFile(oldPath);
      }
      
      user.profilePicture = `/uploads/profiles/${req.file.filename}`;
      await user.save();
      
      res.status(200).json({
        success: true,
        message: 'Profile picture updated successfully',
        data: {
          filename: req.file.filename,
          url: user.profilePicture,
          size: formatFileSize(getFileSize(req.file.path))
        }
      });
    } catch (error) {
      console.error('Upload profile picture error:', error);
      if (req.file) deleteFile(req.file.path);
      res.status(500).json({ message: 'Error uploading profile picture' });
    }
  }
);

// ============================================
// FILE DELETION
// ============================================

// Delete file (Owner only)
router.delete('/file',
  protect,
  async (req, res) => {
    try {
      const { filePath } = req.body;
      
      if (!filePath) {
        return res.status(400).json({
          success: false,
          message: 'File path is required'
        });
      }
      
      // Security check: ensure file belongs to user
      // This is a simplified check - in production, add more validation
      const fullPath = path.join(__dirname, '..', filePath);
      
      if (!fullPath.includes(`${req.user.id}`) && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this file'
        });
      }
      
      const deleted = deleteFile(fullPath);
      
      if (deleted) {
        res.status(200).json({
          success: true,
          message: 'File deleted successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }
    } catch (error) {
      console.error('Delete file error:', error);
      res.status(500).json({ message: 'Error deleting file' });
    }
  }
);

// ============================================
// GET FILE INFO
// ============================================

// Get file information
router.get('/file/info',
  protect,
  (req, res) => {
    try {
      const { filePath } = req.query;
      
      if (!filePath) {
        return res.status(400).json({
          success: false,
          message: 'File path is required'
        });
      }
      
      const fullPath = path.join(__dirname, '..', filePath);
      const fileSize = getFileSize(fullPath);
      
      if (fileSize === 0) {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: {
          path: filePath,
          size: formatFileSize(fileSize),
          sizeBytes: fileSize
        }
      });
    } catch (error) {
      console.error('Get file info error:', error);
      res.status(500).json({ message: 'Error getting file info' });
    }
  }
);

module.exports = router;