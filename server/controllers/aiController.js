const aiService = require('../services/aiService');
const Habit     = require('../models/Habit');
const Log       = require('../models/Log');
const Task      = require('../models/Task');

// ── HABIT SUGGESTIONS ──
exports.getHabitSuggestions = async (req, res) => {
  try {
    const { goal } = req.body;
    if (!goal?.trim()) {
      return res.status(400).json({
        message: 'Please provide a goal'
      });
    }

    // get existing habits to avoid duplicates
    const existingHabits = await Habit.find({
      userId: req.userId, isActive: true
    }).select('name');

    const suggestions = await aiService.getHabitSuggestions(
      goal, existingHabits
    );

    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── SMART INSIGHTS ──
exports.getSmartInsights = async (req, res) => {
  try {
    const habits = await Habit.find({
      userId: req.userId, isActive: true
    });

    if (!habits.length) {
      return res.status(400).json({
        message: 'Add some habits first to get insights'
      });
    }

    // get last 30 days of logs
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const fromDate = thirtyDaysAgo.toISOString().split('T')[0];

    const logs = await Log.find({
      userId: req.userId,
      date:   { $gte: fromDate }
    });

    // build stats per habit
    const habitStats = habits.map((h) => {
      const habitLogs   = logs.filter(
        (l) => l.habitId.toString() === h._id.toString()
      );
      const completed   = habitLogs.filter((l) => l.completed).length;
      const rate        = habitLogs.length > 0
        ? Math.round((completed / 30) * 100) : 0;

      // completion by day of week
      const byDay = Array(7).fill(0);
      habitLogs.forEach((l) => {
        if (l.completed) {
          const day = new Date(l.date).getDay();
          byDay[day]++;
        }
      });

      return {
        name:           h.name,
        icon:           h.icon,
        completionRate: rate,
        totalCompleted: completed,
        byDayOfWeek:    byDay,
        streak:         0  // simplified
      };
    });

    const insights = await aiService.getSmartInsights(
      req.user, habitStats
    );

    res.json(insights);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── TASK PRIORITIZER ──
exports.prioritizeTasks = async (req, res) => {
  try {
    const { context } = req.body;

    const tasks = await Task.find({
      userId:    req.userId,
      completed: false
    });

    if (!tasks.length) {
      return res.status(400).json({
        message: 'No pending tasks to prioritize'
      });
    }

    const result = await aiService.prioritizeTasks(tasks, context);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── DAILY COACH MESSAGE ──
exports.getDailyCoach = async (req, res) => {
  try {
    // get yesterday's stats
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const habits = await Habit.find({
      userId: req.userId, isActive: true
    });

    const logs = await Log.find({
      userId: req.userId,
      date:   yesterdayStr
    });

    const total     = habits.length;
    const completed = logs.filter((l) => l.completed).length;
    const score     = total > 0
      ? Math.round((completed / total) * 100) : 0;

    // find best and missed
    const completedIds  = logs
      .filter((l) => l.completed)
      .map((l) => l.habitId.toString());

    const bestHabitObj  = habits.find(
      (h) => completedIds.includes(h._id.toString())
    );
    const missedHabitObj = habits.find(
      (h) => !completedIds.includes(h._id.toString())
    );

    const message = await aiService.getDailyCoachMessage(
      req.user,
      {
        score,
        completed,
        total,
        streak:      0,
        bestHabit:   bestHabitObj?.name  || null,
        missedHabit: missedHabitObj?.name || null
      }
    );

    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── HABIT CORRELATIONS ──
exports.getCorrelations = async (req, res) => {
  try {
    const habits = await Habit.find({
      userId: req.userId, isActive: true
    });

    if (habits.length < 2) {
      return res.status(400).json({
        message: 'Add at least 2 habits to see correlations'
      });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const fromDate = thirtyDaysAgo.toISOString().split('T')[0];

    const logs = await Log.find({
      userId: req.userId,
      date:   { $gte: fromDate }
    });

    const logSummary = habits.map((h) => ({
      habit:     h.name,
      completed: logs.filter(
        (l) => l.habitId.toString() === h._id.toString()
             && l.completed
      ).length
    }));

    const correlations = await aiService.getHabitCorrelations(
      logSummary, habits
    );

    res.json(correlations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};