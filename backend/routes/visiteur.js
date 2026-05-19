const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, resetPassword } = require('../controllers/visiteurController');
const { protect } = require('../middleware/auth');


// @route   GET /api/visiteurs/profile
// @desc    Get visitor profile
// @access  Private
router.get('/profile', protect, getProfile);

// @route   PUT /api/visiteurs/profile
// @desc    Update visitor profile
// @access  Private

router.put('/profile', protect, updateProfile);

module.exports = router;
