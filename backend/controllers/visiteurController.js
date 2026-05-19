const { Visiteur } = require('../models/User');

// Profile of a visitor
exports.getProfile = async (req, res) => {
  try {
    const user = await Visiteur.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, user });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Update visitor profile
exports.updateProfile = async (req, res) => {
  const {
    fullName,
    phoneNumber,
    gender,
    bio,
    interests,
    skillsNeeded
  } = req.body;

  try {
    const user = await Visiteur.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (fullName !== undefined) {
      user.fullName = String(fullName).trim();
    }

    if (phoneNumber !== undefined) {
      user.phoneNumber = String(phoneNumber).trim();
    }

    if (gender !== undefined) {
      user.gender = gender;
    }

    if (bio !== undefined) {
      user.bio = String(bio || '').trim();
    }

    if (Array.isArray(interests)) {
      user.interests = interests
        .map((item) => String(item || '').trim())
        .filter(Boolean);
    }

    if (Array.isArray(skillsNeeded)) {
      user.skillsNeeded = skillsNeeded
        .map((item) => String(item || '').trim())
        .filter(Boolean);
    }

    await user.save();

    return res.json({ success: true, user });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
};

// Reset password for visitor
exports.resetPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await Visiteur.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};
