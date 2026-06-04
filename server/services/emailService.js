const dotenv = require('dotenv');
dotenv.config();

// ── PROVIDER SETUP ──
const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'sendgrid';

let sendEmail;

if (EMAIL_PROVIDER === 'sendgrid') {
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  sendEmail = async ({ to, subject, html }) => {
    await sgMail.send({
      to,
      from:    process.env.FROM_EMAIL,
      subject, html
    });
  };

} else if (EMAIL_PROVIDER === 'brevo') {
  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport({
    host:   'smtp-relay.brevo.com',
    port:   587,
    secure: false,
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASS,
    }
  });

  sendEmail = async ({ to, subject, html }) => {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to, subject, html
    });
  };

} else if (EMAIL_PROVIDER === 'resend') {
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  sendEmail = async ({ to, subject, html }) => {
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to, subject, html
    });
  };

} else if (EMAIL_PROVIDER === 'nodemailer-gmail') {
  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    }
  });

  sendEmail = async ({ to, subject, html }) => {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to, subject, html
    });
  };
}

// ── SHARED HTML HEADER ──
const emailHeader = `
  <div style="display:flex;align-items:center;
              gap:12px;margin-bottom:24px;">
    <div style="width:40px;height:40px;background:#7C3AED;
                border-radius:10px;display:flex;
                align-items:center;justify-content:center;
                font-size:20px;">⚡</div>
    <span style="font-size:20px;font-weight:700;color:#F8FAFC;">
      HabitFlow
    </span>
  </div>
`;

// ── SHARED HTML WRAPPER ──
const wrapEmail = (content) => `
  <div style="font-family:sans-serif;max-width:480px;
              margin:0 auto;background:#0A0A0F;
              color:#F8FAFC;padding:32px;border-radius:16px;">
    ${emailHeader}
    ${content}
    <p style="color:#64748B;font-size:12px;
               text-align:center;margin-top:24px;">
      Manage your preferences in
      <a href="${process.env.CLIENT_URL}/settings"
         style="color:#7C3AED;text-decoration:none;">
        HabitFlow Settings
      </a>
    </p>
  </div>
`;

// ── HABIT REMINDER EMAIL ──
exports.sendHabitReminder = async (user, habit) => {
  try {
    await sendEmail({
      to:      user.email,
      subject: `⏰ Time to ${habit.name}!`,
      html: wrapEmail(`
        <h1 style="font-size:24px;margin-bottom:8px;">
          Hey ${user.name}! 👋
        </h1>
        <p style="color:#94A3B8;margin-bottom:24px;">
          It's time for your habit reminder.
        </p>

        <div style="background:#111118;border:1px solid #1E1E2E;
                    border-radius:12px;padding:20px;
                    margin-bottom:24px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <span style="font-size:32px;">${habit.icon}</span>
            <div>
              <p style="font-size:18px;font-weight:600;margin:0;
                         color:#F8FAFC;">
                ${habit.name}
              </p>
              <p style="color:#64748B;font-size:14px;margin:4px 0 0;">
                ${habit.frequency} · ${habit.weeklyTarget}x/week target
              </p>
            </div>
          </div>
        </div>

        <a href="${process.env.CLIENT_URL}/dashboard"
           style="display:block;background:#7C3AED;color:white;
                  text-align:center;padding:14px;border-radius:12px;
                  text-decoration:none;font-weight:600;
                  margin-bottom:24px;">
          Log Habit Now →
        </a>
      `)
    });
    return true;
  } catch (err) {
    console.error('[Email] Habit reminder error:', err.message);
    return false;
  }
};

// ── DAILY SUMMARY EMAIL ──
exports.sendDailySummary = async (user, stats) => {
  try {
    const { completed, total, score, habits } = stats;

    const scoreColor = score >= 80 ? '#06FFA5'
                     : score >= 50 ? '#7C3AED'
                     : '#F59E0B';

    const habitRows = habits.map((h) => `
      <tr>
        <td style="padding:8px 0;font-size:16px;">${h.icon}</td>
        <td style="padding:8px 12px;color:#F8FAFC;font-size:14px;">
          ${h.name}
        </td>
        <td style="padding:8px 0;text-align:right;font-size:13px;">
          <span style="color:${h.completed ? '#06FFA5' : '#EF4444'};">
            ${h.completed ? '✅ Done' : '❌ Missed'}
          </span>
        </td>
      </tr>
    `).join('');

    await sendEmail({
      to:      user.email,
      subject: `📊 Your Daily Summary — ${score}% complete`,
      html: wrapEmail(`
        <h1 style="font-size:24px;margin-bottom:4px;">
          Daily Summary 📊
        </h1>
        <p style="color:#94A3B8;margin-bottom:24px;">
          ${new Date().toLocaleDateString('en-IN', {
            weekday: 'long', month: 'long', day: 'numeric'
          })}
        </p>

        <div style="background:#111118;border:1px solid #1E1E2E;
                    border-radius:12px;padding:20px;
                    margin-bottom:20px;text-align:center;">
          <p style="font-size:48px;font-weight:700;
                     margin:0;color:${scoreColor};">
            ${score}%
          </p>
          <p style="color:#64748B;margin:8px 0 0;">
            ${completed} of ${total} habits completed
          </p>
        </div>

        <div style="background:#111118;border:1px solid #1E1E2E;
                    border-radius:12px;padding:20px;
                    margin-bottom:24px;">
          <table style="width:100%;border-collapse:collapse;">
            ${habitRows}
          </table>
        </div>

        <a href="${process.env.CLIENT_URL}/dashboard"
           style="display:block;background:#7C3AED;color:white;
                  text-align:center;padding:14px;border-radius:12px;
                  text-decoration:none;font-weight:600;">
          View Full Dashboard →
        </a>
      `)
    });
    return true;
  } catch (err) {
    console.error('[Email] Daily summary error:', err.message);
    return false;
  }
};

// ── WEEKLY REPORT EMAIL ──
exports.sendWeeklyReport = async (user, weekStats) => {
  try {
    const { avgScore, bestHabit, worstHabit, totalDone } = weekStats;

    await sendEmail({
      to:      user.email,
      subject: `📈 Your Weekly Report — ${avgScore}% avg score`,
      html: wrapEmail(`
        <h1 style="font-size:24px;margin-bottom:4px;">
          Weekly Report 📈
        </h1>
        <p style="color:#94A3B8;margin-bottom:24px;">
          Here's how your week went.
        </p>

        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:12px;margin-bottom:24px;">
          <div style="background:#111118;border:1px solid #1E1E2E;
                      border-radius:12px;padding:16px;text-align:center;">
            <p style="font-size:32px;font-weight:700;
                       color:#7C3AED;margin:0;">
              ${avgScore}%
            </p>
            <p style="color:#64748B;font-size:12px;margin:4px 0 0;">
              Avg Score
            </p>
          </div>
          <div style="background:#111118;border:1px solid #1E1E2E;
                      border-radius:12px;padding:16px;text-align:center;">
            <p style="font-size:32px;font-weight:700;
                       color:#06FFA5;margin:0;">
              ${totalDone}
            </p>
            <p style="color:#64748B;font-size:12px;margin:4px 0 0;">
              Habits Done
            </p>
          </div>
        </div>

        ${bestHabit ? `
        <div style="background:#06FFA510;border:1px solid #06FFA520;
                    border-radius:12px;padding:16px;margin-bottom:12px;">
          <p style="color:#06FFA5;font-size:12px;
                     font-weight:600;margin:0 0 6px;">
            🏆 BEST HABIT
          </p>
          <p style="font-size:16px;font-weight:600;
                     margin:0;color:#F8FAFC;">
            ${bestHabit.icon} ${bestHabit.name}
          </p>
        </div>` : ''}

        ${worstHabit ? `
        <div style="background:#EF444410;border:1px solid #EF444420;
                    border-radius:12px;padding:16px;margin-bottom:24px;">
          <p style="color:#EF4444;font-size:12px;
                     font-weight:600;margin:0 0 6px;">
            💪 NEEDS WORK
          </p>
          <p style="font-size:16px;font-weight:600;
                     margin:0;color:#F8FAFC;">
            ${worstHabit.icon} ${worstHabit.name}
          </p>
        </div>` : ''}

        <a href="${process.env.CLIENT_URL}/dashboard"
           style="display:block;background:#7C3AED;color:white;
                  text-align:center;padding:14px;border-radius:12px;
                  text-decoration:none;font-weight:600;">
          View Full Report →
        </a>
      `)
    });
    return true;
  } catch (err) {
    console.error('[Email] Weekly report error:', err.message);
    return false;
  }
};