const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Payment = require('../models/Payment');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');
const {
  createStripePaymentIntent,
  retrieveStripePaymentIntent,
  createPayPalPayment,
  executePayPalPayment,
  createStripeRefund
} = require('../config/payment');

// STRIPE PAYMENT FLOW

// Step 1: Create Payment Intent (Client gets client secret)
router.post('/stripe/create-intent',
  protect,
  authorize('visiteur'),
  [
    body('courseId').notEmpty().withMessage('Course ID is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { courseId } = req.body;
      
      // Get course details
      const course = await Course.findById(courseId).populate('formateur');
      
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      
      if (!course.isPublished) {
        return res.status(400).json({ message: 'Course is not available' });
      }
      
      // Check if already enrolled
      const alreadyEnrolled = course.enrolledStudents.some(
        e => e.student.toString() === req.user.id
      );
      
      if (alreadyEnrolled) {
        return res.status(400).json({ message: 'Already enrolled in this course' });
      }
      
      // Calculate final price
      const finalPrice = course.finalPrice || course.price;
      
      // Create Stripe Payment Intent
      const result = await createStripePaymentIntent(
        finalPrice,
        'usd',
        {
          courseId: course._id.toString(),
          courseName: course.title,
          userId: req.user.id,
          formateurId: course.formateur._id.toString()
        }
      );
      
      if (!result.success) {
        return res.status(500).json({ message: result.error });
      }
      
      // Create pending payment record
      const payment = await Payment.create({
        user: req.user.id,
        course: course._id,
        formateur: course.formateur._id,
        paymentMethod: 'stripe',
        paymentProvider: {
          transactionId: result.paymentIntentId,
          clientSecret: result.clientSecret
        },
        amount: {
          original: course.price,
          discount: course.price - finalPrice,
          final: finalPrice,
          currency: 'USD'
        },
        status: 'pending'
      });
      
      res.status(200).json({
        success: true,
        clientSecret: result.clientSecret,
        paymentId: payment._id,
        amount: finalPrice
      });
    } catch (error) {
      console.error('Create payment intent error:', error);
      res.status(500).json({ message: 'Error creating payment intent' });
    }
  }
);

// Step 2: Confirm Payment (After client confirms payment)
router.post('/stripe/confirm',
  protect,
  authorize('visiteur'),
  [
    body('paymentId').notEmpty().withMessage('Payment ID is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { paymentId } = req.body;
      
      // Get payment record
      const payment = await Payment.findById(paymentId)
        .populate('course')
        .populate('formateur', 'email fullName');
      
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
      
      if (payment.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      // Verify payment with Stripe
      const result = await retrieveStripePaymentIntent(payment.paymentProvider.transactionId);
      
      if (!result.success) {
        await payment.markAsFailed(result.error);
        return res.status(500).json({ message: 'Payment verification failed' });
      }
      
      const paymentIntent = result.paymentIntent;
      
      if (paymentIntent.status === 'succeeded') {
        // Mark payment as completed
        await payment.markAsCompleted();
        
        // Enroll student in course
        await payment.course.enrollStudent(req.user.id);
        
        // Send confirmation emails
        const { sendEnrollmentConfirmationEmail, sendNewStudentNotification } = require('../utils/emailService');
        await sendEnrollmentConfirmationEmail(req.user, payment.course, payment.formateur);
        await sendNewStudentNotification(payment.formateur, req.user, payment.course);
        
        res.status(200).json({
          success: true,
          message: 'Payment successful! You are now enrolled.',
          payment,
          enrollmentId: payment.course.enrolledStudents[payment.course.enrolledStudents.length - 1]._id
        });
      } else {
        await payment.markAsFailed(`Payment status: ${paymentIntent.status}`);
        res.status(400).json({
          success: false,
          message: 'Payment not completed',
          status: paymentIntent.status
        });
      }
    } catch (error) {
      console.error('Confirm payment error:', error);
      res.status(500).json({ message: 'Error confirming payment' });
    }
  }
);

// PAYPAL PAYMENT

// Step 1: Create PayPal Payment
router.post('/paypal/create',
  protect,
  authorize('visiteur'),
  [
    body('courseId').notEmpty().withMessage('Course ID is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { courseId } = req.body;
      
      // Get course details
      const course = await Course.findById(courseId).populate('formateur');
      
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      
      // Calculate final price
      const finalPrice = course.finalPrice || course.price;
      
      // Create PayPal payment
      const returnUrl = `${process.env.CLIENT_URL}/payment/paypal/success`;
      const cancelUrl = `${process.env.CLIENT_URL}/payment/paypal/cancel`;
      
      const result = await createPayPalPayment(
        finalPrice,
        'USD',
        `Enrollment in: ${course.title}`,
        returnUrl,
        cancelUrl
      );
      
      if (!result.success) {
        return res.status(500).json({ message: 'Error creating PayPal payment' });
      }
      
      // Create pending payment record
      const payment = await Payment.create({
        user: req.user.id,
        course: course._id,
        formateur: course.formateur._id,
        paymentMethod: 'paypal',
        paymentProvider: {
          transactionId: result.paymentId
        },
        amount: {
          original: course.price,
          discount: course.price - finalPrice,
          final: finalPrice,
          currency: 'USD'
        },
        status: 'pending'
      });
      
      res.status(200).json({
        success: true,
        approvalUrl: result.approvalUrl,
        paymentId: payment._id
      });
    } catch (error) {
      console.error('Create PayPal payment error:', error);
      res.status(500).json({ message: 'Error creating PayPal payment' });
    }
  }
);

// Step 2: Execute PayPal Payment
router.post('/paypal/execute',
  protect,
  authorize('visiteur'),
  [
    body('paymentId').notEmpty().withMessage('Payment ID is required'),
    body('PayerID').notEmpty().withMessage('Payer ID is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { paymentId, PayerID } = req.body;
      
      // Get payment record
      const payment = await Payment.findById(paymentId)
        .populate('course')
        .populate('formateur', 'email fullName');
      
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
      
      if (payment.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      // Execute PayPal payment
      const result = await executePayPalPayment(payment.paymentProvider.transactionId, PayerID);
      
      if (!result.success) {
        await payment.markAsFailed('PayPal execution failed');
        return res.status(500).json({ message: 'Payment execution failed' });
      }
      
      // Update payment with payer ID
      payment.paymentProvider.payerId = PayerID;
      await payment.markAsCompleted();
      
      // Enroll student
      await payment.course.enrollStudent(req.user.id);
      
      // Send emails
      const { sendEnrollmentConfirmationEmail, sendNewStudentNotification } = require('../utils/emailService');
      await sendEnrollmentConfirmationEmail(req.user, payment.course, payment.formateur);
      await sendNewStudentNotification(payment.formateur, req.user, payment.course);
      
      res.status(200).json({
        success: true,
        message: 'Payment successful! You are now enrolled.',
        payment
      });
    } catch (error) {
      console.error('Execute PayPal payment error:', error);
      res.status(500).json({ message: 'Error executing payment' });
    }
  }
);

// PAYMENT HISTORY & DETAILS

// Get user's payment history
router.get('/my-payments',
  protect,
  async (req, res) => {
    try {
      const payments = await Payment.getUserPayments(req.user.id);
      
      res.status(200).json({
        success: true,
        count: payments.length,
        data: payments
      });
    } catch (error) {
      console.error('Get payments error:', error);
      res.status(500).json({ message: 'Error fetching payments' });
    }
  }
);

// Get single payment details
router.get('/:id',
  protect,
  async (req, res) => {
    try {
      const payment = await Payment.findById(req.params.id)
        .populate('user', 'fullName email')
        .populate('course', 'title thumbnail')
        .populate('formateur', 'fullName email');
      
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
      
      // Check authorization
      if (
        payment.user._id.toString() !== req.user.id &&
        payment.formateur._id.toString() !== req.user.id &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      res.status(200).json({
        success: true,
        data: payment
      });
    } catch (error) {
      console.error('Get payment error:', error);
      res.status(500).json({ message: 'Error fetching payment' });
    }
  }
);

// FORMATEUR EARNINGS

// Get formateur earnings
router.get('/formateur/earnings',
  protect,
  authorize('formateur'),
  async (req, res) => {
    try {
      const earnings = await Payment.getFormateurEarnings(req.user.id);
      
      // Get detailed breakdown
      const payments = await Payment.find({
        formateur: req.user.id,
        status: 'completed'
      })
        .populate('course', 'title')
        .populate('user', 'fullName')
        .sort({ paidAt: -1 });
      
      res.status(200).json({
        success: true,
        summary: earnings,
        payments
      });
    } catch (error) {
      console.error('Get earnings error:', error);
      res.status(500).json({ message: 'Error fetching earnings' });
    }
  }
);

// ADMIN ROUTES

// Get all payments (Admin only)
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
      
      if (req.query.paymentMethod) {
        filter.paymentMethod = req.query.paymentMethod;
      }
      
      const payments = await Payment.find(filter)
        .populate('user', 'fullName email')
        .populate('course', 'title')
        .populate('formateur', 'fullName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await Payment.countDocuments(filter);
      
      res.status(200).json({
        success: true,
        count: payments.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: payments
      });
    } catch (error) {
      console.error('Get all payments error:', error);
      res.status(500).json({ message: 'Error fetching payments' });
    }
  }
);

// Get platform revenue statistics
router.get('/admin/revenue',
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      const revenue = await Payment.getPlatformRevenue(startDate, endDate);
      
      res.status(200).json({
        success: true,
        data: revenue
      });
    } catch (error) {
      console.error('Get revenue error:', error);
      res.status(500).json({ message: 'Error fetching revenue' });
    }
  }
);

// Process refund (Admin only)
router.post('/:id/refund',
  protect,
  authorize('admin'),
  [
    body('reason').notEmpty().withMessage('Refund reason is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { reason, amount } = req.body;
      
      const payment = await Payment.findById(req.params.id);
      
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
      
      if (!payment.isRefundable) {
        return res.status(400).json({ message: 'Payment is not refundable' });
      }
      
      // Process refund with payment provider
      if (payment.paymentMethod === 'stripe') {
        const result = await createStripeRefund(
          payment.paymentProvider.transactionId,
          amount
        );
        
        if (!result.success) {
          return res.status(500).json({ message: result.error });
        }
        
        payment.refund.refundId = result.refund.id;
      }
      
      // Update payment record
      await payment.processRefund(amount, reason, req.user.id);
      
      res.status(200).json({
        success: true,
        message: 'Refund processed successfully',
        data: payment
      });
    } catch (error) {
      console.error('Process refund error:', error);
      res.status(500).json({ message: error.message || 'Error processing refund' });
    }
  }
);

module.exports = router;
