const multer = require('multer');
const path = require('path');
const fs = require('fs');

// CREATE UPLOAD DIRECTORIES IF NOT EXIST
const createUploadDirs = () => {
  const dirs = [
    './uploads',
    './uploads/courses',
    './uploads/courses/thumbnails',
    './uploads/courses/videos',
    './uploads/courses/resources',
    './uploads/certificates',
    './uploads/projects',
    './uploads/profiles'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  });
};

createUploadDirs();

// STORAGE CONFIGURATION

// Storage for course thumbnails
const courseThumbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/courses/thumbnails');
  },
  filename: (req, file, cb) => {
    // Generate unique filename: courseid_timestamp.ext
    const uniqueName = `course_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Storage for course videos
const courseVideoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/courses/videos');
  },
  filename: (req, file, cb) => {
    const uniqueName = `video_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Storage for course resources (PDFs, docs, etc.)
const courseResourceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/courses/resources');
  },
  filename: (req, file, cb) => {
    const uniqueName = `resource_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Storage for formateur certificates
const certificateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/certificates');
  },
  filename: (req, file, cb) => {
    const uniqueName = `cert_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Storage for formateur projects
const projectStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/projects');
  },
  filename: (req, file, cb) => {
    const uniqueName = `project_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Storage for profile pictures
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/profiles');
  },
  filename: (req, file, cb) => {
    const uniqueName = `profile_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// FILE FILTER FUNCTIONS

// Image filter (for thumbnails, profiles)
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed!'));
  }
};

// Video filter
const videoFilter = (req, file, cb) => {
  const allowedTypes = /mp4|avi|mov|wmv|flv|mkv|webm/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.startsWith('video/');
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only video files (MP4, AVI, MOV, etc.) are allowed!'));
  }
};

// Document filter (for resources, certificates)
const documentFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|ppt|pptx|xls|xlsx|zip|rar/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only document files (PDF, DOC, PPT, XLS, ZIP) are allowed!'));
  }
};

// General file filter (for projects - allows more types)
const generalFileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|ppt|pptx|xls|xlsx|zip|rar|jpg|jpeg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('File type not allowed!'));
  }
};

// FILE SIZE LIMITS
const fileSizeLimits = {
  image: 5 * 1024 * 1024,      // 5 MB for images
  video: 500 * 1024 * 1024,    // 500 MB for videos
  document: 10 * 1024 * 1024,  // 10 MB for documents
  general: 50 * 1024 * 1024    // 50 MB for general files
};

// MULTER UPLOAD INSTANCES

// Upload course thumbnail
const uploadCourseThumbnail = multer({
  storage: courseThumbnailStorage,
  limits: { fileSize: fileSizeLimits.image },
  fileFilter: imageFilter
}).single('thumbnail');

// Upload course video
const uploadCourseVideo = multer({
  storage: courseVideoStorage,
  limits: { fileSize: fileSizeLimits.video },
  fileFilter: videoFilter
}).single('video');

// Upload course resources (multiple files)
const uploadCourseResources = multer({
  storage: courseResourceStorage,
  limits: { fileSize: fileSizeLimits.document },
  fileFilter: documentFilter
}).array('resources', 10); // Max 10 files

// Upload formateur certificate
const uploadCertificate = multer({
  storage: certificateStorage,
  limits: { fileSize: fileSizeLimits.document },
  fileFilter: documentFilter
}).single('certificate');

// Upload formateur project files
const uploadProject = multer({
  storage: projectStorage,
  limits: { fileSize: fileSizeLimits.general },
  fileFilter: generalFileFilter
}).single('project');

// Upload profile picture
const uploadProfile = multer({
  storage: profileStorage,
  limits: { fileSize: fileSizeLimits.image },
  fileFilter: imageFilter
}).single('profilePicture');

// ERROR HANDLING MIDDLEWARE

const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File is too large. Please check size limits.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files uploaded.'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name in upload.'
      });
    }
  } else if (err) {
    // Custom errors (from file filters)
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

// HELPER FUNCTION TO DELETE FILE

const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`File deleted: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// HELPER FUNCTION TO GET FILE SIZE

const getFileSize = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      return stats.size;
    }
    return 0;
  } catch (error) {
    console.error('Error getting file size:', error);
    return 0;
  }
};

// HELPER FUNCTION TO FORMAT FILE SIZE

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

module.exports = {
  // Upload middleware
  uploadCourseThumbnail,
  uploadCourseVideo,
  uploadCourseResources,
  uploadCertificate,
  uploadProject,
  uploadProfile,
  
  // Error handler
  handleUploadError,
  
  // Helper functions
  deleteFile,
  getFileSize,
  formatFileSize,
  
  // Size limits
  fileSizeLimits
};