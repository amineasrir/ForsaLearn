const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

// PROTECT ROUTES - Verify JWT Token

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Extract token from "Bearer TOKEN"
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({ 
        message: 'Not authorized. Please login to access this resource.' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ 
        message: 'User no longer exists.' 
      });
    }

    // Check if user account is active
    if (!user.isActive) {
      return res.status(403).json({ 
        message: 'Your account has been deactivated. Please contact support.' 
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please login again.' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    }
    
    return res.status(500).json({ message: 'Authentication error' });
  }
};

// AUTHORIZE SPECIFIC ROLES

exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user role is in allowed roles array
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not authorized to access this resource.`
      });
    }
    next();
  };
};

// CHECK IF FORMATEUR IS APPROVED

exports.checkFormateurApproval = async (req, res, next) => {
  try {
    if (req.user.role !== 'formateur') {
      return next();
    }

    if (!req.user.isApproved) {
      return res.status(403).json({
        message: 'Your account is not yet approved by admin. Please wait for approval.'
      });
    }

    next();
  } catch (error) {
    console.error('Formateur approval check error:', error);
    res.status(500).json({ message: 'Error checking approval status' });
  }
};

// VERIFY EMAIL TOKEN

exports.verifyEmailToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Find user with valid email verification token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() } // Token not expired
    });

    if (!user) {
      return res.status(400).json({
        message: 'Email verification token is invalid or has expired.'
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.status(200).json({
      message: 'Email verified successfully. You can now login.'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Error verifying email' });
  }
};

// RATE LIMITING MIDDLEWARE (Security)

const rateLimit = require('express-rate-limit');

exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: 'Too many login attempts. Please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Limit registration attempts
exports.registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 registration requests per hour
  message: 'Too many accounts created from this IP. Please try again after an hour.',
  standardHeaders: true,
  legacyHeaders: false,
});

