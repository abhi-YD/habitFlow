const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const { requirePro } = require('../middleware/checkPlan');
const {
  getHabitSuggestions,
  getSmartInsights,
  prioritizeTasks,
  getDailyCoach,
  getCorrelations
} = require('../controllers/aiController');

router.post('/suggest-habits',  auth, requirePro, getHabitSuggestions);
router.get('/insights',         auth, requirePro, getSmartInsights);
router.post('/prioritize',      auth, requirePro, prioritizeTasks);
router.get('/coach',            auth, requirePro, getDailyCoach);
router.get('/correlations',     auth, requirePro, getCorrelations);

module.exports = router;