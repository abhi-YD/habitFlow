const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  level: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true
  },
  targetValue: {
    type: Number,   // e.g. 5 (habits per day), 80 (% completion)
    required: true
  },
  currentValue: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,   // "habits", "%", "days", "times"
    default: '%'
  },
  linkedHabitIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit'
  }],
  startDate: {
    type: String,   // "2026-01-01"
    required: true
  },
  endDate: {
    type: String,   // "2026-12-31"
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#7C3AED'
  },
  icon: {
    type: String,
    default: '🎯'
  }
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);