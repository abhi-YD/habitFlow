const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createTask,
  getTasks,
  updateTask,
  completeTask,
  deleteTask,
  getDailySummary
} = require('../controllers/taskController');

router.post('/',                auth, createTask);
router.get('/',                 auth, getTasks);
router.put('/:id',              auth, updateTask);
router.patch('/:id/complete',   auth, completeTask);
router.delete('/:id',           auth, deleteTask);
router.get('/summary/today',    auth, getDailySummary);

module.exports = router;