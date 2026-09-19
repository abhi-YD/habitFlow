const Habit = require('../models/Habit');
const Log   = require('../models/Log');
const Task  = require('../models/Task');

// ── helper: get N days ago ──
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};

// ── GET FULL ANALYTICS ──
exports.getAnalytics = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const fromDate = daysAgo(Number(days));
    const today    = new Date().toISOString().split('T')[0];

    // fetch habits + logs
    const habits = await Habit.find({
      userId: req.userId, isActive: true
    });

    const logs = await Log.find({
      userId: req.userId,
      date:   { $gte: fromDate, $lte: today }
    });

    const totalHabits = habits.length;
    if (!totalHabits) {
      return res.json({
        overview:    {},
        dailyTrend:  [],
        habitStats:  [],
        dayOfWeek:   [],
        yearHeatmap: {},
        taskStats:   {}
      });
    }

    // ── 1. DAILY TREND (score per day) ──
    const dateMap = {};
    // initialize all days in range
    for (let i = Number(days); i >= 0; i--) {
      const d = daysAgo(i);
      dateMap[d] = { date: d, completed: 0, total: totalHabits, score: 0 };
    }
    // fill in completions
    logs.forEach((log) => {
      if (dateMap[log.date] && log.completed) {
        dateMap[log.date].completed++;
      }
    });
    const dailyTrend = Object.values(dateMap).map((d) => ({
      ...d,
      score: Math.round((d.completed / d.total) * 100)
    }));

    // ── 2. HABIT STATS (per habit) ──
    const habitStats = habits.map((h) => {
      const habitLogs = logs.filter(
        (l) => l.habitId.toString() === h._id.toString()
      );
      const completed = habitLogs.filter((l) => l.completed).length;
      const rate      = Math.round((completed / Number(days)) * 100);

      // streak calculation
      let streak = 0;
      const sorted = habitLogs
        .filter((l) => l.completed)
        .map((l) => l.date)
        .sort((a, b) => new Date(b) - new Date(a));

      for (let i = 0; i < sorted.length; i++) {
        const expected = daysAgo(i);
        if (sorted[i] === expected) streak++;
        else break;
      }

      return {
        id:             h._id,
        name:           h.name,
        icon:           h.icon,
        color:          h.color,
        completionRate: Math.min(rate, 100),
        totalCompleted: completed,
        streak,
        weeklyTarget:   h.weeklyTarget,
        frequency:      h.frequency,
      };
    }).sort((a, b) => b.completionRate - a.completionRate);

    // ── 3. DAY OF WEEK ANALYSIS ──
    const dowMap = Array(7).fill(null).map((_, i) => ({
      day:       ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][i],
      completed: 0,
      total:     0,
      score:     0
    }));

    Object.values(dateMap).forEach(({ date, completed, total }) => {
      const dow = new Date(date).getDay();
      dowMap[dow].completed += completed;
      dowMap[dow].total     += total;
    });

    dowMap.forEach((d) => {
      d.score = d.total > 0
        ? Math.round((d.completed / d.total) * 100) : 0;
    });

    // ── 4. YEAR HEATMAP (last 365 days) ──
    const yearLogs = await Log.find({
      userId: req.userId,
      date:   { $gte: daysAgo(365), $lte: today },
      completed: true
    });

    const yearHeatmap = {};
    yearLogs.forEach((l) => {
      yearHeatmap[l.date] = (yearHeatmap[l.date] || 0) + 1;
    });

    // ── 5. OVERVIEW STATS ──
    const completedLogs  = logs.filter((l) => l.completed).length;
    const totalPossible  = totalHabits * (Number(days) + 1);
    const overallRate    = Math.round((completedLogs / totalPossible) * 100);
    const avgDailyScore  = dailyTrend.length > 0
      ? Math.round(
          dailyTrend.reduce((s, d) => s + d.score, 0) / dailyTrend.length
        )
      : 0;

    const bestHabit  = habitStats[0] || null;
    const worstHabit = habitStats[habitStats.length - 1] || null;
    const bestDay    = [...dowMap].sort((a,b) => b.score - a.score)[0];
    const worstDay   = [...dowMap].sort((a,b) => a.score - b.score)[0];

    // current streak (consecutive days with >0 completions)
    let currentStreak = 0;
    for (let i = 0; i <= Number(days); i++) {
      const d = daysAgo(i);
      if (dateMap[d]?.completed > 0) currentStreak++;
      else break;
    }

    // longest streak
    let longestStreak = 0;
    let tempStreak    = 0;
    dailyTrend.forEach((d) => {
      if (d.completed > 0) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    });

    // ── 6. TASK STATS ──
    const tasks         = await Task.find({ userId: req.userId });
    const completedTasks = tasks.filter((t) => t.completed).length;
    const taskRate       = tasks.length > 0
      ? Math.round((completedTasks / tasks.length) * 100) : 0;

    res.json({
      overview: {
        overallRate,
        avgDailyScore,
        totalCompleted:  completedLogs,
        totalHabits,
        currentStreak,
        longestStreak,
        bestHabit:  bestHabit  ? { name: bestHabit.name,  icon: bestHabit.icon,  rate: bestHabit.completionRate  } : null,
        worstHabit: worstHabit ? { name: worstHabit.name, icon: worstHabit.icon, rate: worstHabit.completionRate } : null,
        bestDay:    bestDay?.day,
        worstDay:   worstDay?.day,
      },
      dailyTrend,
      habitStats,
      dayOfWeek:   dowMap,
      yearHeatmap,
      taskStats: {
        total:     tasks.length,
        completed: completedTasks,
        rate:      taskRate
      }
    });

  } catch (err) {
    console.error('[Analytics]', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};