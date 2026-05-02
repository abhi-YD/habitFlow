const Goal = require('../models/Goal');
const Log = require('../models/Log');

// CREATE GOAL
exports.createGoal = async (req, res) => {
  try {
    const { 
      title, description, level, 
      targetValue, unit, linkedHabitIds,
      startDate, endDate, color, icon 
    } = req.body;

    const goal = new Goal({
      userId: req.userId,
      title, description, level,
      targetValue, unit, linkedHabitIds,
      startDate, endDate, color, icon
    });

    await goal.save();
    res.status(201).json(goal);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET ALL GOALS
exports.getGoals = async (req, res) => {
  try {
    const { level } = req.query;  // filter by daily/weekly/monthly/yearly
    let filter = { userId: req.userId };
    if (level) filter.level = level;

    const goals = await Goal.find(filter)
      .populate('linkedHabitIds', 'name icon color')
      .sort({ createdAt: -1 });

    res.json(goals);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE GOAL PROGRESS (auto-calculate from logs)
exports.updateGoalProgress = async (req, res) => {
  try {
    const goal = await Goal.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // count completed logs within goal's date range
    const completedLogs = await Log.countDocuments({
      userId: req.userId,
      habitId: { $in: goal.linkedHabitIds },
      date: { $gte: goal.startDate, $lte: goal.endDate },
      completed: true
    });

    // calculate progress %
    const progress = Math.min(
      Math.round((completedLogs / goal.targetValue) * 100), 
      100
    );

    goal.currentValue = completedLogs;
    goal.isCompleted = progress >= 100;
    await goal.save();

    res.json({ goal, progress });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE GOAL
exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...req.body },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json(goal);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE GOAL
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};