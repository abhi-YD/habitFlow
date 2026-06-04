const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { checkGoalLimit } = require('../middleware/checkPlan');


const {
  createGoal,
  getGoals,
  updateGoalProgress,
  updateGoal,
  deleteGoal
} = require('../controllers/goalController');

router.post('/',                    auth, checkGoalLimit, createGoal);
router.get('/',                     auth, getGoals);
router.put('/:id',                  auth, updateGoal);
router.patch('/:id/progress',       auth, updateGoalProgress);
router.delete('/:id',               auth, deleteGoal);

module.exports = router;