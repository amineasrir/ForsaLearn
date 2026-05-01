const User = require('../models/User');

// Profile of a visitor

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
    } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Update visitor profile
exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;

    try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    res.json({ success: true, data: user });
    } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// reser password for visitor
exports.resetPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

    try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();
    
    res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
    }
};