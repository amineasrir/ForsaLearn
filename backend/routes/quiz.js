const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Only authenticated formateurs can access quiz results
router.use(protect);
router.use(authorize('formateur'));

// Return an empty quiz list for now.
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    data: []
  });
});

// Return empty details/attempts for a specific quiz.
router.get('/:id', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      attempts: []
    }
  });
});

// Return empty statistics for a specific quiz.
router.get('/:id/statistics', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      totalAttempts: 0,
      averageScore: 0,
      passed: 0,
      failed: 0
    }
  });
});

module.exports = router;
