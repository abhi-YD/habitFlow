// const cron    = require('node-cron');
// const User    = require('../models/User');
// const Habit   = require('../models/Habit');
// const Log     = require('../models/Log');
// const emailSvc = require('./emailService');
// const pushSvc  = require('./pushService');

// // helper — get current time string HH:MM
// const getCurrentTime = () => {
//   const now = new Date();
//   return `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
// };

// // helper — today date string
// const getToday = () => new Date().toISOString().split('T')[0];

// // ── JOB 1: HABIT REMINDERS (runs every minute) ──
// const habitReminderJob = () => {
//   cron.schedule('* * * * *', async () => {
//     try {
//       const currentTime = getCurrentTime();
//       console.log(`[CRON] Checking reminders at ${currentTime}`);

//       // find habits with reminderTime matching now
//       const habits = await Habit.find({
//         reminderTime: currentTime,
//         isActive: true
//       }).populate('userId');

//       for (const habit of habits) {
//         const user = habit.userId;
//         if (!user) continue;

//         // check if already logged today
//         const today = getToday();
//         const log = await Log.findOne({
//           habitId: habit._id,
//           userId: user._id,
//           date: today,
//           completed: true
//         });

//         // only remind if not done yet
//         if (!log) {
//           // email reminder
//           if (user.notificationPrefs?.emailNotifications &&
//               user.notificationPrefs?.habitReminders) {
//             await emailSvc.sendHabitReminder(user, habit);
//           }

//           // push reminder
//           if (user.pushSubscription &&
//               user.notificationPrefs?.pushNotifications &&
//               user.notificationPrefs?.habitReminders) {
//             await pushSvc.sendHabitReminderPush(
//               user.pushSubscription, habit
//             );
//           }
//         }
//       }
//     } catch (err) {
//       console.error('[CRON] Habit reminder error:', err.message);
//     }
//   });
// };

// // ── JOB 2: DAILY SUMMARY (runs at configured time) ──
// const dailySummaryJob = () => {
//   // runs every hour, checks per-user summary time
//   cron.schedule('0 * * * *', async () => {
//     try {
//       const currentTime = getCurrentTime();
//       const today       = getToday();

//       // find users with dailySummaryTime = now
//       const users = await User.find({
//         'notificationPrefs.dailySummary': true,
//         'notificationPrefs.dailySummaryTime': currentTime
//       });

//       for (const user of users) {
//         // get all habits
//         const habits = await Habit.find({
//           userId: user._id,
//           isActive: true
//         });

//         // get today's logs
//         const logs = await Log.find({
//           userId: user._id,
//           date: today
//         });

//         const total     = habits.length;
//         const completed = logs.filter((l) => l.completed).length;
//         const score = total > 0
//           ? Math.round((completed / total) * 100)
//           : 0;

//         const habitStats = habits.map((h) => ({
//           ...h.toObject(),
//           completed: logs.some(
//             (l) => l.habitId.toString() === h._id.toString()
//                 && l.completed
//           )
//         }));

//         // send email summary
//         if (user.notificationPrefs?.emailNotifications) {
//           await emailSvc.sendDailySummary(user, {
//             completed, total, score, habits: habitStats
//           });
//         }

//         // send push summary
//         if (user.pushSubscription &&
//             user.notificationPrefs?.pushNotifications) {
//           await pushSvc.sendDailySummaryPush(
//             user.pushSubscription, score
//           );
//         }
//       }
//     } catch (err) {
//       console.error('[CRON] Daily summary error:', err.message);
//     }
//   });
// };

// // ── JOB 3: MISSED HABIT NUDGE (runs every hour) ──
// const missedHabitNudgeJob = () => {
//   cron.schedule('0 * * * *', async () => {
//     try {
//       const currentTime = getCurrentTime();
//       const today       = getToday();

//       const users = await User.find({
//         'notificationPrefs.missedHabitNudge': true,
//         'notificationPrefs.nudgeTime': currentTime
//       });

//       for (const user of users) {
//         const habits = await Habit.find({
//           userId: user._id,
//           isActive: true
//         });

//         const logs = await Log.find({
//           userId: user._id,
//           date: today,
//           completed: true
//         });

//         const completedIds = logs.map((l) => l.habitId.toString());
//         const missedCount  = habits.filter(
//           (h) => !completedIds.includes(h._id.toString())
//         ).length;

//         if (missedCount > 0) {
//           if (user.pushSubscription &&
//               user.notificationPrefs?.pushNotifications) {
//             await pushSvc.sendMissedHabitPush(
//               user.pushSubscription, missedCount
//             );
//           }
//         }
//       }
//     } catch (err) {
//       console.error('[CRON] Nudge error:', err.message);
//     }
//   });
// };

// // ── JOB 4: WEEKLY REPORT (runs every Sunday 9AM) ──
// const weeklyReportJob = () => {
//   cron.schedule('0 9 * * 0', async () => {
//     try {
//       const users = await User.find({
//         'notificationPrefs.weeklyReport': true,
//         'notificationPrefs.emailNotifications': true
//       });

//       const today = new Date();
//       const weekAgo = new Date(today);
//       weekAgo.setDate(today.getDate() - 7);
//       const weekAgoStr = weekAgo.toISOString().split('T')[0];
//       const todayStr   = today.toISOString().split('T')[0];

//       for (const user of users) {
//         const habits = await Habit.find({
//           userId: user._id,
//           isActive: true
//         });

//         const logs = await Log.find({
//           userId: user._id,
//           date: { $gte: weekAgoStr, $lte: todayStr },
//           completed: true
//         });

//         // calculate per-habit completion
//         const habitStats = habits.map((h) => {
//           const done = logs.filter(
//             (l) => l.habitId.toString() === h._id.toString()
//           ).length;
//           return { ...h.toObject(), doneCount: done };
//         });

//         const totalDone = logs.length;
//         const avgScore  = habits.length > 0
//           ? Math.round((totalDone / (habits.length * 7)) * 100)
//           : 0;

//         const sorted    = [...habitStats].sort(
//           (a, b) => b.doneCount - a.doneCount
//         );
//         const bestHabit  = sorted[0]   || null;
//         const worstHabit = sorted[sorted.length - 1] || null;

//         await emailSvc.sendWeeklyReport(user, {
//           avgScore, totalDone, bestHabit, worstHabit
//         });
//       }
//     } catch (err) {
//       console.error('[CRON] Weekly report error:', err.message);
//     }
//   });
// };

// // ── START ALL JOBS ──
// exports.startCronJobs = () => {
//   habitReminderJob();
//   dailySummaryJob();
//   missedHabitNudgeJob();
//   weeklyReportJob();
//   console.log('✅ Cron jobs started');
// };


const cron     = require('node-cron');
const User     = require('../models/User');
const Habit    = require('../models/Habit');
const Log      = require('../models/Log');
const emailSvc = require('./emailService');
const pushSvc  = require('./pushService');

// ── TIMEZONE-AWARE HELPERS ──
const getCurrentTime = (timezone = 'Asia/Kolkata') => {
  return new Date().toLocaleTimeString('en-IN', {
    timeZone: timezone,
    hour:     '2-digit',
    minute:   '2-digit',
    hour12:   false
  });
};

const getToday = (timezone = 'Asia/Kolkata') => {
  return new Date().toLocaleDateString('en-CA', {
    timeZone: timezone
  });
};

// ── JOB 1: HABIT REMINDERS (every minute) ──
const habitReminderJob = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const habits = await Habit.find({
        reminderTime: { $ne: null, $ne: '' },
        isActive: true
      }).populate('userId');

      for (const habit of habits) {
        const user = habit.userId;
        if (!user) continue;

        const timezone    = user.timezone || 'Asia/Kolkata';
        const currentTime = getCurrentTime(timezone);
        const today       = getToday(timezone);

        console.log(
          `[CRON] ${user.name} | ${currentTime} | ` +
          `${habit.name} → ${habit.reminderTime}`
        );

        if (habit.reminderTime !== currentTime) continue;

        const log = await Log.findOne({
          habitId: habit._id, userId: user._id,
          date: today, completed: true
        });

        if (!log) {
          if (user.notificationPrefs?.emailNotifications &&
              user.notificationPrefs?.habitReminders) {
            const sent = await emailSvc.sendHabitReminder(user, habit);
            console.log(
              `[CRON] Email ${sent ? '✅' : '❌'} → ${user.email}`
            );
          }

          if (user.pushSubscription &&
              user.notificationPrefs?.pushNotifications &&
              user.notificationPrefs?.habitReminders) {
            await pushSvc.sendHabitReminderPush(
              user.pushSubscription, habit
            );
          }
        } else {
          console.log(`[CRON] ${habit.name} already done — skip`);
        }
      }
    } catch (err) {
      console.error('[CRON] Reminder error:', err.message);
    }
  });
};

// ── JOB 2: DAILY SUMMARY (every hour) ──
const dailySummaryJob = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      const users = await User.find({
        'notificationPrefs.dailySummary': true
      });

      for (const user of users) {
        const timezone    = user.timezone || 'Asia/Kolkata';
        const currentTime = getCurrentTime(timezone);
        const today       = getToday(timezone);

        if (user.notificationPrefs?.dailySummaryTime !== currentTime)
          continue;

        const habits = await Habit.find({
          userId: user._id, isActive: true
        });

        const logs = await Log.find({
          userId: user._id, date: today
        });

        const total     = habits.length;
        const completed = logs.filter((l) => l.completed).length;
        const score     = total > 0
          ? Math.round((completed / total) * 100) : 0;

        const habitStats = habits.map((h) => ({
          ...h.toObject(),
          completed: logs.some(
            (l) => l.habitId.toString() === h._id.toString()
                && l.completed
          )
        }));

        if (user.notificationPrefs?.emailNotifications) {
          await emailSvc.sendDailySummary(user, {
            completed, total, score, habits: habitStats
          });
        }

        if (user.pushSubscription &&
            user.notificationPrefs?.pushNotifications) {
          await pushSvc.sendDailySummaryPush(
            user.pushSubscription, score
          );
        }
      }
    } catch (err) {
      console.error('[CRON] Daily summary error:', err.message);
    }
  });
};

// ── JOB 3: MISSED HABIT NUDGE (every hour) ──
const missedHabitNudgeJob = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      const users = await User.find({
        'notificationPrefs.missedHabitNudge': true
      });

      for (const user of users) {
        const timezone    = user.timezone || 'Asia/Kolkata';
        const currentTime = getCurrentTime(timezone);
        const today       = getToday(timezone);

        if (user.notificationPrefs?.nudgeTime !== currentTime)
          continue;

        const habits = await Habit.find({
          userId: user._id, isActive: true
        });

        const logs = await Log.find({
          userId: user._id, date: today, completed: true
        });

        const completedIds = logs.map((l) => l.habitId.toString());
        const missedCount  = habits.filter(
          (h) => !completedIds.includes(h._id.toString())
        ).length;

        if (missedCount > 0 &&
            user.pushSubscription &&
            user.notificationPrefs?.pushNotifications) {
          await pushSvc.sendMissedHabitPush(
            user.pushSubscription, missedCount
          );
        }
      }
    } catch (err) {
      console.error('[CRON] Nudge error:', err.message);
    }
  });
};

// ── JOB 4: WEEKLY REPORT (Sunday 9AM IST) ──
const weeklyReportJob = () => {
  // 9AM IST = 3:30 AM UTC
  cron.schedule('30 3 * * 0', async () => {
    try {
      const users = await User.find({
        'notificationPrefs.weeklyReport':        true,
        'notificationPrefs.emailNotifications':  true
      });

      const today   = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);

      const weekAgoStr = weekAgo.toISOString().split('T')[0];
      const todayStr   = today.toISOString().split('T')[0];

      for (const user of users) {
        const habits = await Habit.find({
          userId: user._id, isActive: true
        });

        const logs = await Log.find({
          userId: user._id,
          date:   { $gte: weekAgoStr, $lte: todayStr },
          completed: true
        });

        const habitStats = habits.map((h) => {
          const done = logs.filter(
            (l) => l.habitId.toString() === h._id.toString()
          ).length;
          return { ...h.toObject(), doneCount: done };
        });

        const totalDone = logs.length;
        const avgScore  = habits.length > 0
          ? Math.round((totalDone / (habits.length * 7)) * 100) : 0;

        const sorted     = [...habitStats].sort(
          (a, b) => b.doneCount - a.doneCount
        );
        const bestHabit  = sorted[0] || null;
        const worstHabit = sorted[sorted.length - 1] || null;

        await emailSvc.sendWeeklyReport(user, {
          avgScore, totalDone, bestHabit, worstHabit
        });
      }
    } catch (err) {
      console.error('[CRON] Weekly report error:', err.message);
    }
  });
};

// ── START ALL JOBS ──
exports.startCronJobs = () => {
  habitReminderJob();
  dailySummaryJob();
  missedHabitNudgeJob();
  weeklyReportJob();
  console.log('✅ Cron jobs started');
};