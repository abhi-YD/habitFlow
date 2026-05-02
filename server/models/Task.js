const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
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
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: String,   // "2026-04-27"
    default: null
  },
  completed: {
    type: Boolean,
    default: false
  },
  linkedHabitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);