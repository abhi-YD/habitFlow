const crypto     = require('crypto');
const User       = require('../models/User');
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const emailSvc   = require('../services/emailService');

// generate token helper
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check all fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // save user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // generate token
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // generate token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET CURRENT USER (me)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── FORGOT PASSWORD ──
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email });

    // always return success (don't reveal if email exists)
    if (!user) {
      return res.json({
        message: 'If that email exists, a reset link has been sent.'
      });
    }

    // block Google OAuth users
    if (user.authProvider === 'google') {
      return res.status(400).json({
        message: 'This account uses Google Sign-In. No password to reset.'
      });
    }

    // generate secure token
    const token  = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // save to DB
    user.passwordResetToken  = token;
    user.passwordResetExpiry = expiry;
    await user.save();

    // send email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    await emailSvc.sendPasswordReset(user, resetUrl);

    console.log(`[Auth] Password reset sent to ${email}`);

    res.json({
      message: 'If that email exists, a reset link has been sent.'
    });

  } catch (err) {
    console.error('[Auth] Forgot password error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── VERIFY RESET TOKEN ──
exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      passwordResetToken:  token,
      passwordResetExpiry: { $gt: new Date() } // not expired
    });

    if (!user) {
      return res.status(400).json({
        message: 'Reset link is invalid or has expired.',
        valid:   false
      });
    }

    res.json({
      valid: true,
      email: user.email.replace(
        /(.{2})(.*)(@.*)/, // mask: ab***@gmail.com
        (_, a, b, c) => a + '*'.repeat(b.length) + c
      )
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── RESET PASSWORD ──
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        message: 'Token and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters'
      });
    }

    // find user by valid token
    const user = await User.findOne({
      passwordResetToken:  token,
      passwordResetExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        message: 'Reset link is invalid or has expired.'
      });
    }

    // hash new password
    const salt = await bcrypt.genSalt(10);
    user.password            = await bcrypt.hash(password, salt);
    user.passwordResetToken  = null;
    user.passwordResetExpiry = null;
    user.authProvider        = 'local'; // in case they had google too
    await user.save();

    // send confirmation email
    await emailSvc.sendPasswordResetSuccess(user);

    console.log(`[Auth] Password reset successful for ${user.email}`);

    res.json({ message: 'Password reset successful! You can now log in.' });

  } catch (err) {
    console.error('[Auth] Reset password error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};