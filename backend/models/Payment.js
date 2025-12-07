const mongoose = require('mongoose');

// PAYMENT SCHEMA

const paymentSchema = new mongoose.Schema({
  // User Information
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  
  // Course Information
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  
  // Formateur (instructor) who will receive payment
  formateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Formateur is required']
  },
  
  // Payment Method
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'card'],
    required: [true, 'Payment method is required']
  },
  
  // Payment Provider Details
  paymentProvider: {
    // Stripe Payment Intent ID or PayPal Payment ID
    transactionId: {
      type: String,
      required: true,
      unique: true
    },
    // For PayPal: payer ID
    payerId: String,
    // Payment Intent client secret (Stripe)
    clientSecret: String,
    // Payment status from provider
    providerStatus: String
  },
  
  // Amount Details
  amount: {
    // Original course price
    original: {
      type: Number,
      required: true,
      min: 0
    },
    // Discount applied
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    // Final amount paid
    final: {
      type: Number,
      required: true,
      min: 0
    },
    // Currency
    currency: {
      type: String,
      default: 'USD',
      uppercase: true
    }
  },
  
  // Platform Fee (percentage taken by platform)
  platformFee: {
    percentage: {
      type: Number,
      default: 20, // 20% platform fee
      min: 0,
      max: 100
    },
    amount: {
      type: Number,
      default: 0
    }
  },
  
  // Formateur Earnings (after platform fee)
  formateurEarnings: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Payment Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  
  // Payment Timestamps
  paidAt: {
    type: Date
  },
  refundedAt: {
    type: Date
  },
  
  // Refund Information
  refund: {
    amount: {
      type: Number,
      min: 0
    },
    reason: String,
    refundId: String,
    refundedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Billing Information
  billingDetails: {
    name: String,
    email: String,
    phone: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    }
  },
  
  // Metadata
  metadata: {
    // IP address
    ipAddress: String,
    // User agent
    userAgent: String,
    // Any additional data
    customData: mongoose.Schema.Types.Mixed
  },
  
  // Notes (admin/system notes)
  notes: String
  
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// INDEXES

paymentSchema.index({ user: 1, course: 1 });
paymentSchema.index({ formateur: 1, status: 1 });
paymentSchema.index({ 'paymentProvider.transactionId': 1 });
paymentSchema.index({ status: 1, createdAt: -1 });

// VIRTUAL FIELDS

// Check if payment is successful
paymentSchema.virtual('isSuccessful').get(function() {
  return this.status === 'completed';
});

// Check if payment is refundable
paymentSchema.virtual('isRefundable').get(function() {
  // Can refund within 30 days of payment
  if (this.status !== 'completed' || !this.paidAt) return false;
  
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return this.paidAt > thirtyDaysAgo;
});

// METHODS

// Mark payment as completed
paymentSchema.methods.markAsCompleted = async function() {
  this.status = 'completed';
  this.paidAt = Date.now();
  
  // Calculate platform fee and formateur earnings
  const feeAmount = (this.amount.final * this.platformFee.percentage) / 100;
  this.platformFee.amount = feeAmount;
  this.formateurEarnings = this.amount.final - feeAmount;
  
  await this.save();
  
  // Update formateur total earnings
  const Formateur = mongoose.model('User');
  await Formateur.findByIdAndUpdate(
    this.formateur,
    { $inc: { totalEarnings: this.formateurEarnings } }
  );
};

// Mark payment as failed
paymentSchema.methods.markAsFailed = async function(reason) {
  this.status = 'failed';
  this.notes = reason;
  await this.save();
};

// Process refund
paymentSchema.methods.processRefund = async function(refundAmount, reason, refundedBy) {
  if (!this.isRefundable) {
    throw new Error('Payment is not refundable');
  }
  
  this.status = 'refunded';
  this.refundedAt = Date.now();
  this.refund = {
    amount: refundAmount || this.amount.final,
    reason,
    refundedBy
  };
  
  await this.save();
  
  // Deduct from formateur earnings
  const Formateur = mongoose.model('User');
  await Formateur.findByIdAndUpdate(
    this.formateur,
    { $inc: { totalEarnings: -this.formateurEarnings } }
  );
};

// STATIC METHODS

// Get user's payment history
paymentSchema.statics.getUserPayments = function(userId) {
  return this.find({ user: userId })
    .populate('course', 'title thumbnail')
    .populate('formateur', 'firstName lastName')
    .sort({ createdAt: -1 });
};

// Get formateur's earnings
paymentSchema.statics.getFormateurEarnings = async function(formateurId, status = 'completed') {
  const result = await this.aggregate([
    {
      $match: {
        formateur: mongoose.Types.ObjectId(formateurId),
        status
      }
    },
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: '$formateurEarnings' },
        totalTransactions: { $sum: 1 }
      }
    }
  ]);
  
  return result[0] || { totalEarnings: 0, totalTransactions: 0 };
};

// Get platform revenue
paymentSchema.statics.getPlatformRevenue = async function(startDate, endDate) {
  const match = {
    status: 'completed'
  };
  
  if (startDate || endDate) {
    match.paidAt = {};
    if (startDate) match.paidAt.$gte = new Date(startDate);
    if (endDate) match.paidAt.$lte = new Date(endDate);
  }
  
  const result = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$platformFee.amount' },
        totalTransactions: { $sum: 1 },
        totalGross: { $sum: '$amount.final' }
      }
    }
  ]);
  
  return result[0] || { totalRevenue: 0, totalTransactions: 0, totalGross: 0 };
};

// Get payment statistics by date range
paymentSchema.statics.getPaymentStats = async function(startDate, endDate) {
  const match = {
    paidAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  };
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          year: { $year: '$paidAt' },
          month: { $month: '$paidAt' },
          day: { $dayOfMonth: '$paidAt' }
        },
        totalAmount: { $sum: '$amount.final' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);
};

// MIDDLEWARE

// Calculate final amount before saving
paymentSchema.pre('save', function() {
  if (this.isModified('amount.original') || this.isModified('amount.discount')) {
    this.amount.final = this.amount.original - this.amount.discount;
  }
});

// CREATE MODEL

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;