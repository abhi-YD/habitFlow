const Habit = require('../models/Habit');
const Log = require('../models/Log');

// CREATE HABIT
exports.createHabit = async (req, res) => {
  try {
    const { name, icon, color, frequency, customDays, reminderTime } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Habit name is required' });
    }

    const habit = new Habit({
      userId: req.userId,  // comes from auth middleware
      name,
      icon,
      color,
      frequency,
      customDays,
      reminderTime
    });

    await habit.save();
    res.status(201).json(habit);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET ALL HABITS (for logged in user)
exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ 
      userId: req.userId,
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json(habits);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET SINGLE HABIT
exports.getHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({ 
      _id: req.params.id, 
      userId: req.userId  // ensures user owns this habit
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json(habit);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE HABIT
exports.updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...req.body },
      { returnDocument: 'after' }  // return updated document
    );

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json(habit);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE HABIT (soft delete)
exports.deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isActive: false },
      { returnDocument: 'after' }
    );

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json({ message: 'Habit deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// LOG HABIT (check off for a day)
exports.logHabit = async (req, res) => {
  try {
    const { date, completed, note } = req.body;
    const habitId = req.params.id;

    // verify habit belongs to user
    const habit = await Habit.findOne({ _id: habitId, userId: req.userId });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // upsert → create if not exists, update if exists
    const log = await Log.findOneAndUpdate(
      { habitId, userId: req.userId, date },
      { completed, note },
      { upsert: true, new: true }
    );

    res.json(log);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET LOGS FOR A DATE (all habits completion for that day)
exports.getLogsForDate = async (req, res) => {
  try {
    const { date } = req.params;

    const logs = await Log.find({ 
      userId: req.userId, 
      date 
    }).populate('habitId', 'name icon color');

    // calculate daily score
    const total = logs.length;
    const completed = logs.filter(l => l.completed).length;
    const score = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({ logs, score, completed, total });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET LOGS FOR A HABIT (history)
exports.getHabitLogs = async (req, res) => {
  try {
    const logs = await Log.find({ 
      habitId: req.params.id, 
      userId: req.userId 
    }).sort({ date: -1 }).limit(30);  // last 30 days

    // calculate streak
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const sortedLogs = logs.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );

    for (let log of sortedLogs) {
      if (log.completed) streak++;
      else break;
    }

    res.json({ logs, streak });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET LOGS FOR DATE RANGE (for streak + heatmap)
exports.getLogsForRange = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({
        message: 'from and to dates required'
      });
    }

    const logs = await Log.find({
      userId: req.userId,
      date:   { $gte: from, $lte: to }
    }).populate('habitId', 'name icon color');

    // group logs by date
    const grouped = {};
    logs.forEach((log) => {
      if (!grouped[log.date]) grouped[log.date] = [];
      grouped[log.date].push(log);
    });

    // calculate score per day
    const Habit = require('../models/Habit');
    const habits = await Habit.find({
      userId:   req.userId,
      isActive: true
    });
    const totalHabits = habits.length;

    const dailyScores = {};
    Object.entries(grouped).forEach(([date, dayLogs]) => {
      const completed = dayLogs.filter((l) => l.completed).length;
      dailyScores[date] = totalHabits > 0
        ? Math.round((completed / totalHabits) * 100)
        : 0;
    });

    res.json({ logs: grouped, dailyScores, totalHabits });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};