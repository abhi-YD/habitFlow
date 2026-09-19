const webpush = require('web-push');

webpush.setVapidDetails(
  `mailto:${process.env.FROM_EMAIL}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// send push notification
exports.sendPush = async (subscription, payload) => {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    );
    return true;
  } catch (err) {
    console.error('Push error:', err.message);
    return false;
  }
};

// habit reminder push
exports.sendHabitReminderPush = async (subscription, habit) => {
  return exports.sendPush(subscription, {
    title: `⏰ ${habit.name}`,
    body:  `Time for your ${habit.frequency} habit!`,
    icon:  '/icon.png',
    badge: '/badge.png',
    data:  { url: '/dashboard' }
  });
};

// daily summary push
exports.sendDailySummaryPush = async (subscription, score) => {
  return exports.sendPush(subscription, {
    title: `📊 Daily Summary`,
    body:  `You completed ${score}% of your habits today!`,
    icon:  '/icon.png',
    data:  { url: '/dashboard' }
  });
};

// missed habit nudge
exports.sendMissedHabitPush = async (subscription, count) => {
  return exports.sendPush(subscription, {
    title: `🔔 Don't break your streak!`,
    body:  `You have ${count} habit${count > 1 ? 's' : ''} left to log today.`,
    icon:  '/icon.png',
    data:  { url: '/dashboard' }
  });
};