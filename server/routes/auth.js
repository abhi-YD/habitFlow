const express  = require('express');
const router   = express.Router();
const jwt      = require('jsonwebtoken');
const passport = require('../config/passport');
const {
  register, login, getMe
} = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// ── EXISTING ROUTES ──
router.post('/register', register);
router.post('/login',    login);
router.get('/me',        authMiddleware, getMe);

// ── GOOGLE OAUTH ──

// Step 1: redirect to Google
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

// Step 2: Google calls this back
router.get('/google/callback',
  passport.authenticate('google', {
    session:         false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`
  }),
  (req, res) => {
    // generate our own JWT
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // send token to frontend via URL param
    // frontend reads it and stores in localStorage
    res.redirect(
      `${process.env.CLIENT_URL}/auth/callback?token=${token}&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}`
    );
  }
);

module.exports = router;