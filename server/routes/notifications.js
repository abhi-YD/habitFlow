const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const {
  savePushSubscription,
  getPrefs,
  updatePrefs,
  getVapidKey
} = require('../controllers/notificationController');

router.get('/vapid-key',    auth, getVapidKey);
router.post('/subscribe',   auth, savePushSubscription);
router.get('/prefs',        auth, getPrefs);
router.put('/prefs',        auth, updatePrefs);

module.exports = router;