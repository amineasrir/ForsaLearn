const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Admin } = require('../models/User');

// Load environment variables
dotenv.config();

// CREATE FIRST ADMIN USER
const seedAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);

    console.log('Connected to MongoDB');

    // Check if admin already exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@forsalearn.com';
    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      process.exit(0);
    }

    // Create new admin
    const admin = new Admin({
      firstName: process.env.ADMIN_FIRST_NAME || 'Admin',
      lastName: process.env.ADMIN_LAST_NAME || 'ForsaLearn',
      email: adminEmail,
      phoneNumber: '0600000000',
      password: process.env.ADMIN_PASSWORD || 'Admin@123!',
      role: 'admin',
      isEmailVerified: true,
      isActive: true
    });

    await admin.save();

    console.log('Admin user created successfully!');
    console.log('='.repeat(50));
    console.log(' Email:', admin.email);
    console.log('Password:', process.env.ADMIN_PASSWORD || 'Admin@123!');
    console.log('='.repeat(50));
    console.log('Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

// Run the seed function
seedAdmin();