const express   = require('express');
const router    = express.Router();
const auth      = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const {
  getMetrics,
  getUsers,
  updateUserPlan,
  deleteUser,
  getUserDetail
} = require('../controllers/adminController');

// all admin routes need both auth + adminAuth
router.get('/metrics',        auth, adminAuth, getMetrics);
router.get('/users',          auth, adminAuth, getUsers);
router.get('/users/:id',      auth, adminAuth, getUserDetail);
router.put('/users/:id',      auth, adminAuth, updateUserPlan);
router.delete('/users/:id',   auth, adminAuth, deleteUser);

module.exports = router;