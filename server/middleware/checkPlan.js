const Habit = require('../models/Habit');
const Goal  = require('../models/Goal');

const FREE_LIMITS = {
  habits: 5,
  goals:  3,
};

// block if free user hit habit limit
exports.checkHabitLimit = async (req, res, next) => {
  try {
    if (req.user?.plan === 'pro') return next();

    const count = await Habit.countDocuments({
      userId:   req.userId,
      isActive: true
    });

    if (count >= FREE_LIMITS.habits) {
      return res.status(403).json({
        message:  `Free plan is limited to ${FREE_LIMITS.habits} habits.`,
        code:     'HABIT_LIMIT_REACHED',
        limit:    FREE_LIMITS.habits,
        current:  count,
        upgrade:  true
      });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// block if free user hit goal limit
exports.checkGoalLimit = async (req, res, next) => {
  try {
    if (req.user?.plan === 'pro') return next();

    const count = await Goal.countDocuments({
      userId: req.userId
    });

    if (count >= FREE_LIMITS.goals) {
      return res.status(403).json({
        message: `Free plan is limited to ${FREE_LIMITS.goals} goals.`,
        code:    'GOAL_LIMIT_REACHED',
        limit:   FREE_LIMITS.goals,
        current: count,
        upgrade: true
      });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// block AI features for free users
exports.requirePro = (req, res, next) => {
  if (req.user?.plan !== 'pro') {
    return res.status(403).json({
      message: 'This feature requires Pro plan.',
      code:    'PRO_REQUIRED',
      upgrade: true
    });
  }
  next();
};