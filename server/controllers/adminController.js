const User    = require('../models/User');
const Habit   = require('../models/Habit');
const Log     = require('../models/Log');
const Task    = require('../models/Task');
const Goal    = require('../models/Goal');

// ── DASHBOARD METRICS ──
exports.getMetrics = async (req, res) => {
  try {
    const now       = new Date();
    const today     = new Date(now.setHours(0,0,0,0));
    const weekAgo   = new Date(Date.now() - 7  * 24 * 60 * 60 * 1000);
    const monthAgo  = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      proUsers,
      newToday,
      newThisWeek,
      newThisMonth,
      totalHabits,
      totalLogs,
      totalTasks,
      totalGoals,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ plan: 'pro' }),
      User.countDocuments({ createdAt: { $gte: today } }),
      User.countDocuments({ createdAt: { $gte: weekAgo } }),
      User.countDocuments({ createdAt: { $gte: monthAgo } }),
      Habit.countDocuments({ isActive: true }),
      Log.countDocuments({ completed: true }),
      Task.countDocuments(),
      Goal.countDocuments(),
    ]);

    // signups last 7 days (for chart)
    const signupChart = await User.aggregate([
      { $match: { createdAt: { $gte: weekAgo } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    res.json({
      users: {
        total:        totalUsers,
        pro:          proUsers,
        free:         totalUsers - proUsers,
        newToday,
        newThisWeek,
        newThisMonth,
        conversionRate: totalUsers > 0
          ? Math.round((proUsers / totalUsers) * 100)
          : 0
      },
      content: {
        habits: totalHabits,
        logs:   totalLogs,
        tasks:  totalTasks,
        goals:  totalGoals,
      },
      revenue: {
        monthly: proUsers * 199,
        annual:  proUsers * 1499,
      },
      signupChart,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── GET ALL USERS ──
exports.getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      plan = '',
      sort = '-createdAt'
    } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name:  { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (plan) filter.plan = plan;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password -pushSubscription')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      User.countDocuments(filter)
    ]);

    res.json({
      users,
      total,
      pages: Math.ceil(total / limit),
      page:  Number(page)
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── UPDATE USER PLAN ──
exports.updateUserPlan = async (req, res) => {
  try {
    const { plan, role } = req.body;
    const update = {};

    if (plan) {
      update.plan = plan;
      if (plan === 'pro') {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 30);
        update.planExpiry = expiry;
      } else {
        update.planExpiry  = null;
        update.planBilling = null;
      }
    }

    if (role) update.role = role;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user, message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── DELETE USER ──
exports.deleteUser = async (req, res) => {
  try {
    // prevent self-deletion
    if (req.params.id === req.userId.toString()) {
      return res.status(400).json({
        message: 'Cannot delete your own account'
      });
    }

    await Promise.all([
      User.findByIdAndDelete(req.params.id),
      Habit.deleteMany({ userId: req.params.id }),
      Log.deleteMany({   userId: req.params.id }),
      Task.deleteMany({  userId: req.params.id }),
      Goal.deleteMany({  userId: req.params.id }),
    ]);

    res.json({ message: 'User and all data deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── GET SINGLE USER DETAIL ──
exports.getUserDetail = async (req, res) => {
  try {
    const user   = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const [habits, logs, tasks, goals] = await Promise.all([
      Habit.countDocuments({ userId: req.params.id, isActive: true }),
      Log.countDocuments({   userId: req.params.id, completed: true }),
      Task.countDocuments({  userId: req.params.id }),
      Goal.countDocuments({  userId: req.params.id }),
    ]);

    res.json({
      user,
      stats: { habits, logs, tasks, goals }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};