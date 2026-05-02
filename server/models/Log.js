const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,  // "2026-04-27"
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  note: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// prevent duplicate logs for same habit on same day
logSchema.index({ habitId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Log', logSchema);