const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { Admin, Formateur, Visiteur, User } = require('../models/User');

// REGISTER ROUTES

// Register Admin (should be protected - only existing admin can create new admin)
router.post('/register/admin',
  [
    body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
    body('lastName').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('phoneNumber').matches(/^[0-9]{10,15}$/).withMessage('Please provide a valid phone number'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { firstName, lastName, email, phoneNumber, password } = req.body;

      // Check if admin already exists
      const existingAdmin = await User.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Create new admin
      const admin = new Admin({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        role: 'admin'
      });

      await admin.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'Admin registered successfully',
        token,
        user: {
          id: admin._id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          role: admin.role
        }
      });
    } catch (error) {
      console.error('Admin registration error:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  }
);

// Register Formateur (Instructor)
router.post('/register/formateur',
  [
    body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
    body('lastName').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('phoneNumber').matches(/^[0-9]{10,15}$/).withMessage('Please provide a valid phone number'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('skills').isArray({ min: 1 }).withMessage('At least one skill is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { firstName, lastName, email, phoneNumber, password, skills, certificates, projects, bio } = req.body;

      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Create new formateur (instructor)
      const formateur = new Formateur({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        role: 'formateur',
        skills,
        certificates: certificates || [],
        projects: projects || [],
        bio: bio || '',
        isApproved: false // Requires admin approval
      });

      await formateur.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: formateur._id, role: formateur.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'Formateur registered successfully. Waiting for admin approval.',
        token,
        user: {
          id: formateur._id,
          firstName: formateur.firstName,
          lastName: formateur.lastName,
          email: formateur.email,
          role: formateur.role,
          isApproved: formateur.isApproved
        }
      });
    } catch (error) {
      console.error('Formateur registration error:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  }
);

// Register Visiteur (Student/Learner)
router.post('/register/visiteur',
  [
    body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
    body('lastName').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('phoneNumber').matches(/^[0-9]{10,15}$/).withMessage('Please provide a valid phone number'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('skillsNeeded').isArray().withMessage('Skills needed must be an array')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { firstName, lastName, email, phoneNumber, password, skillsNeeded, interests } = req.body;

      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Create new visiteur (student)
      const visiteur = new Visiteur({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        role: 'visiteur',
        skillsNeeded: skillsNeeded || [],
        interests: interests || []
      });

      await visiteur.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: visiteur._id, role: visiteur.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'Visiteur registered successfully',
        token,
        user: {
          id: visiteur._id,
          firstName: visiteur.firstName,
          lastName: visiteur.lastName,
          email: visiteur.email,
          role: visiteur.role,
          skillsNeeded: visiteur.skillsNeeded
        }
      });
    } catch (error) {
      console.error('Visiteur registration error:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  }
);

// ============================================
// LOGIN ROUTES - SEPARATED BY ROLE
// ============================================

// Admin Login - Separate endpoint for admin authentication
router.post('/login/admin',
  [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find admin user by email and role
      const admin = await Admin.findOne({ email, role: 'admin' }).select('+password');
      
      if (!admin) {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }

      // Check if account is active
      if (!admin.isActive) {
        return res.status(403).json({ message: 'Admin account has been deactivated.' });
      }

      // Compare passwords
      const isPasswordCorrect = await admin.comparePassword(password);
      
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }

      // Update last login
      admin.lastLogin = Date.now();
      await admin.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(200).json({
        message: 'Admin login successful',
        token,
        user: {
          id: admin._id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          phoneNumber: admin.phoneNumber,
          role: admin.role,
          lastLogin: admin.lastLogin,
          permissions: admin.permissions
        }
      });
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ message: 'Server error during admin login' });
    }
  }
);

// Formateur & Visiteur Login - Combined endpoint for regular users
router.post('/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user by email (formateur or visiteur only - NOT admin)
      const user = await User.findOne({ 
        email,
        role: { $in: ['formateur', 'visiteur'] } // Only allow formateur and visiteur
      }).select('+password');
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Check if account is active
      if (!user.isActive) {
        return res.status(403).json({ message: 'Account has been deactivated. Please contact support.' });
      }

      // Compare passwords
      const isPasswordCorrect = await user.comparePassword(password);
      
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // For formateurs, check if approved
      if (user.role === 'formateur' && !user.isApproved) {
        return res.status(403).json({ 
          message: 'Your account is pending admin approval. You will be notified once approved.',
          isPending: true
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Return user data based on role
      let userData = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role
      };

      // Add role-specific data
      if (user.role === 'formateur') {
        userData.skills = user.skills;
        userData.isApproved = user.isApproved;
        userData.totalEarnings = user.totalEarnings;
        userData.rating = user.rating;
        userData.bio = user.bio;
      } else if (user.role === 'visiteur') {
        userData.skillsNeeded = user.skillsNeeded;
        userData.totalCoursesCompleted = user.totalCoursesCompleted;
        userData.interests = user.interests;
      }

      res.status(200).json({
        message: 'Login successful',
        token,
        user: userData
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  }
);


// GET CURRENT USER (Protected route)

router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// LOGOUT ROUTE (Optional - JWT is stateless)

router.post('/logout', (req, res) => {
  res.status(200).json({ 
    message: 'Logout successful. Please remove the token from client storage.' 
  });
});

module.exports = router;