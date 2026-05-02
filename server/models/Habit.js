// const mongoose = require('mongoose');

// const habitSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   icon: {
//     type: String,
//     default: '⭐'
//   },
//   color: {
//     type: String,
//     default: '#6366f1'
//   },
//   frequency: {
//     type: String,
//     enum: ['daily', 'weekly', 'custom'],
//     default: 'daily'
//   },
//   customDays: {
//     type: [Number], // 0=Sun, 1=Mon ... 6=Sat
//     default: []
//   },
//   reminderTime: {
//     type: String,  // "07:00"
//     default: null
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   // add inside habitSchema
//   weeklyTarget: {
//     type: Number,    // e.g. 5 = "I want to do this 5 days a week"
//     default: 7       // default = every day
//   },
//   dailyTarget: {
//     type: Number,    // for habits done multiple times a day (e.g. drink water 8x)
//     default: 1
//   }

// }, { timestamps: true });

// module.exports = mongoose.model('Habit', habitSchema);

const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    default: '⭐'
  },
  color: {
    type: String,
    default: '#6366f1'
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'custom'],
    default: 'daily'
  },
  customDays: {
    type: [Number], // 0=Sun, 1=Mon ... 6=Sat
    default: []
  },
  reminderTime: {
    type: String,   // "07:00"
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  weeklyTarget: {
    type: Number,   // e.g. 5 = "I want to do this 5 days a week"
    default: 7      // default = every day
  },
  dailyTarget: {
    type: Number,   // for habits done multiple times a day (e.g. drink water 8x)
    default: 1
  }
}, { timestamps: true });

module.exports = mongoose.model('Habit', habitSchema);