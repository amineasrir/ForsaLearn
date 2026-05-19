const multer = require('multer');
const path = require('path');
const fs = require('fs');

// CREATE UPLOAD DIRECTORIES

const createUploadDirectories = () => {
  const directories = [
    './uploads/courses/thumbnails',
    './uploads/courses/videos',
    './uploads/courses/resources',
    './uploads/certificates',
    './uploads/projects',
    './uploads/profiles',
    './uploads/messages'
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
};

// Create directories on module load
createUploadDirectories();

// STORAGE CONFIGURATION

// Course Thumbnail Storage
const courseThumbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/courses/thumbnails');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `thumbnail-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Course Video Storage
const courseVideoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/courses/videos');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `video-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Course Resources Storage
const courseResourcesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/courses/resources');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `resource-${uniqueSuffix}-${sanitizedName}`);
  }
});

// Certificate Storage
const certificateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/certificates');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `cert-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Project Storage
const projectStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/projects');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `project-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Formateur Signup Assets Storage
const formateurSignupStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'profilePicture') {
      cb(null, './uploads/profiles');
      return;
    }

    if (file.fieldname === 'certification') {
      cb(null, './uploads/certificates');
      return;
    }

    cb(new Error('Unsupported upload field'), '');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

    if (file.fieldname === 'profilePicture') {
      cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
      return;
    }

    if (file.fieldname === 'certification') {
      cb(null, `cert-${uniqueSuffix}${path.extname(file.originalname)}`);
      return;
    }

    cb(new Error('Unsupported upload field'), '');
  }
});

// Profile Picture Storage
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/profiles');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Message Attachment Storage
const messageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/messages');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `msg-${uniqueSuffix}-${sanitizedName}`);
  }
});

// FILE FILTERS

// Image filter (for thumbnails and profiles)
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed!'), false);
  }
};

// Video filter
const videoFilter = (req, file, cb) => {
  const allowedTypes = /mp4|avi|mov|wmv|flv|mkv|webm/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.startsWith('video/');

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'), false);
  }
};

// Document filter (for resources, certificates, projects)
const documentFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|xls|xlsx|ppt|pptx|txt|zip|rar/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    cb(null, true);
  } else {
    cb(new Error('Only document files (PDF, DOC, XLS, PPT, ZIP) are allowed!'), false);
  }
};

const formateurSignupFilter = (req, file, cb) => {
  if (file.fieldname === 'profilePicture') {
    imageFilter(req, file, cb);
    return;
  }

  if (file.fieldname === 'certification') {
    documentFilter(req, file, cb);
    return;
  }

  cb(new Error('File type not allowed for this field'), false);
};

// NEW - Message attachment filter (images, videos, documents)
const messageAttachmentFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|avi|mov|pdf|doc|docx|xls|xlsx|txt|zip|rar/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed for messages!'), false);
  }
};

// MULTER UPLOAD CONFIGURATIONS

// Course Thumbnail Upload (max 5MB)
const uploadCourseThumbnail = multer({
  storage: courseThumbnailStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFilter
}).single('thumbnail');

// Course Video Upload (max 500MB)
const uploadCourseVideo = multer({
  storage: courseVideoStorage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: videoFilter
}).single('video');

// Course Resources Upload (multiple, max 50MB each)
const uploadCourseResources = multer({
  storage: courseResourcesStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB per file
  fileFilter: documentFilter
}).array('resources', 10); // Max 10 files

// Certificate Upload (max 10MB)
const uploadCertificate = multer({
  storage: certificateStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: documentFilter
}).single('certificate');

// Project Upload (max 50MB)
const uploadProject = multer({
  storage: projectStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: documentFilter
}).single('project');

// Formateur signup assets upload
const uploadFormateurSignupAssets = multer({
  storage: formateurSignupStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
  fileFilter: formateurSignupFilter
}).fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'certification', maxCount: 1 }
]);

// Profile Picture Upload (max 5MB)
const uploadProfile = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFilter
}).single('profilePicture');

// Attachment Upload (max 10MB)
const uploadMessageAttachment = multer({
  storage: messageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: messageAttachmentFilter
}).single('file');

// ERROR HANDLER

const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: 'File is too large. Please check the size limits.'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Too many files uploaded.'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Unexpected field name in upload.'
        });
      default:
        return res.status(400).json({
          success: false,
          message: err.message
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

// HELPER FUNCTIONS

// Delete file from server
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️  Deleted file: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Get file size
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

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// Check if file exists
const fileExists = (filePath) => {
  return fs.existsSync(filePath);
};


module.exports = { 
  // Upload configurations
  uploadCourseThumbnail,
  uploadCourseVideo,
  uploadCourseResources,
  uploadCertificate,
  uploadProject,
  uploadFormateurSignupAssets,
  uploadProfile,
  uploadMessageAttachment,
  
  // Error handler
  handleUploadError,
  
  // Helper functions
  deleteFile,
  getFileSize,
  formatFileSize,
  fileExists,
  
  // Storage configurations (if needed elsewhere)
  courseThumbnailStorage,
  courseVideoStorage,
  courseResourcesStorage,
  certificateStorage,
  projectStorage,
  formateurSignupStorage,
  profileStorage,
  messageStorage
};
