// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6
//   },
//   timezone: {
//     type: String,
//     default: 'Asia/Kolkata'
//   },
//   avatar: {
//     type: String,
//     default: ''
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type:     String,
    required: true,
    trim:     true
  },
  email: {
    type:      String,
    required:  true,
    unique:    true,
    lowercase: true,
    trim:      true
  },
  password: {
    type:      String,
    required:  true,
    minlength: 6
  },
  timezone: {
    type:    String,
    default: 'Asia/Kolkata'
  },
  avatar: {
    type:    String,
    default: ''
  },

  // ── ROLE ──
  role: {
    type:    String,
    enum:    ['user', 'admin'],
    default: 'user'
  },

  // ── PLAN ──
  plan: {
    type:    String,
    enum:    ['free', 'pro'],
    default: 'free'
  },
  planExpiry: {
    type:    Date,
    default: null
  },
  planBilling: {
    type:    String,
    enum:    ['monthly', 'annual', null],
    default: null
  },

  // ── RAZORPAY ──
  razorpayCustomerId: {
    type:    String,
    default: null
  },

  // ── NOTIFICATIONS ──
  pushSubscription: {
    type:    Object,
    default: null
  },

  googleId: {
    type:    String,
    default: null,
    sparse:  true  // allows multiple null values
  },
  avatar: {
    type:    String,
    default: ''
  },
  authProvider: {
    type:    String,
    enum:    ['local', 'google'],
    default: 'local'
  },
  isEmailVerified: {
    type:    Boolean,
    default: false
  },
  passwordResetToken:   { type: String,  default: null },
  passwordResetExpiry:  { type: Date,    default: null },
  emailVerifyToken:     { type: String,  default: null },


  notificationPrefs: {
    emailNotifications: { type: Boolean, default: true  },
    pushNotifications:  { type: Boolean, default: true  },
    habitReminders:     { type: Boolean, default: true  },
    dailySummary:       { type: Boolean, default: true  },
    dailySummaryTime:   { type: String,  default: '08:00' },
    weeklyReport:       { type: Boolean, default: true  },
    missedHabitNudge:   { type: Boolean, default: true  },
    nudgeTime:          { type: String,  default: '21:00' },
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);