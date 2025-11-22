// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// ============================================
// LOAD ENVIRONMENT VARIABLES
// ============================================
dotenv.config();

// ============================================
// CONNECT TO DATABASE
// ============================================
connectDB();

// ============================================
// INITIALIZE EXPRESS APP
// ============================================
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// Body Parser - to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - Allow frontend to communicate with backend
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Security Headers
app.use((req, res, next) => {
  // Prevent XSS attacks
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Request Logger (Development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// ROUTES
// ============================================

// Test route
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Welcome to ForsaLearn API',
    version: '1.0.0',
    status: 'Running'
  });
});

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'Connected'
  });
});

// Authentication Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Course Routes
// const courseRoutes = require('./routes/courses');
// app.use('/api/courses', courseRoutes);

// User Routes
// const userRoutes = require('./routes/users');
// app.use('/api/users', userRoutes);

// Admin Routes
// const adminRoutes = require('./routes/admin');
// app.use('/api/admin', adminRoutes);

// Payment Routes
// const paymentRoutes = require('./routes/payments');
// app.use('/api/payments', paymentRoutes);

// ERROR HANDLING MIDDLEWARE

// Handle 404 - Route not found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode`);
  console.log(`📡 Server URL: http://localhost:${PORT}`);
  console.log(`🌐 API Base: http://localhost:${PORT}/api`);
  console.log('='.repeat(50));
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Rejection:', err.message);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;