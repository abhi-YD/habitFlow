const Task = require('../models/Task');

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { title, priority, dueDate, linkedHabitId } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const task = new Task({
      userId: req.userId,
      title,
      priority,
      dueDate,
      linkedHabitId
    });

    await task.save();
    res.status(201).json(task);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET ALL TASKS
exports.getTasks = async (req, res) => {
  try {
    const { date, completed } = req.query;
    
    let filter = { userId: req.userId };
    if (date) filter.dueDate = date;
    if (completed !== undefined) filter.completed = completed === 'true';

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .populate('linkedHabitId', 'name icon');

    res.json(tasks);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...req.body },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// COMPLETE TASK (toggle)
exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.completed = !task.completed;  // toggle
    await task.save();

    res.json(task);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET TODAY'S SUMMARY (habits + tasks combined score)
exports.getDailySummary = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const tasks = await Task.find({ 
      userId: req.userId, 
      dueDate: today 
    });

    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const score = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({ tasks, score, completed, total, date: today });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};