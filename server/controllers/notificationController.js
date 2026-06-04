const User = require('../models/User');

// save push subscription
exports.savePushSubscription = async (req, res) => {
  try {
    const { subscription } = req.body;
    await User.findByIdAndUpdate(req.userId, {
      pushSubscription: subscription
    });
    res.json({ message: 'Push subscription saved' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// get notification prefs
exports.getPrefs = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('notificationPrefs');
    res.json(user.notificationPrefs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// update notification prefs
exports.updatePrefs = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { notificationPrefs: req.body },
      { new: true }
    ).select('notificationPrefs');
    res.json(user.notificationPrefs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// get VAPID public key (needed by frontend)
exports.getVapidKey = async (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
};