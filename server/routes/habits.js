const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { checkHabitLimit } = require('../middleware/checkPlan');

const {
  createHabit,
  getHabits,
  getHabit,
  updateHabit,
  deleteHabit,
  logHabit,
  getLogsForDate,
  getHabitLogs,
  getLogsForRange
} = require('../controllers/habitController');

// all routes protected with auth middleware
router.post('/',            auth, checkHabitLimit,createHabit);
router.get('/',             auth, getHabits);
router.get('/logs/range',   auth, getLogsForRange);  // ← MOVED UP
router.get('/logs/:date',   auth, getLogsForDate);
router.get('/:id',          auth, getHabit);
router.put('/:id',          auth, updateHabit);
router.delete('/:id',       auth, deleteHabit);
router.post('/:id/log',     auth, logHabit);
router.get('/:id/logs',     auth, getHabitLogs);


module.exports = router;