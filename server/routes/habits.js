const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createHabit,
  getHabits,
  getHabit,
  updateHabit,
  deleteHabit,
  logHabit,
  getLogsForDate,
  getHabitLogs
} = require('../controllers/habitController');

// all routes protected with auth middleware
router.post('/',           auth, createHabit);
router.get('/',            auth, getHabits);
router.get('/:id',         auth, getHabit);
router.put('/:id',         auth, updateHabit);
router.delete('/:id',      auth, deleteHabit);
router.post('/:id/log',    auth, logHabit);
router.get('/logs/:date',  auth, getLogsForDate);
router.get('/:id/logs',    auth, getHabitLogs);

module.exports = router;