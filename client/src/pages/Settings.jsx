import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, Clock, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import usePushNotification from '../hooks/usePushNotification';

export default function Settings() {
  const { permission, subscribe } = usePushNotification();
  const [prefs, setPrefs]         = useState({
    emailNotifications:  true,
    pushNotifications:   true,
    habitReminders:      true,
    dailySummary:        true,
    dailySummaryTime:    '08:00',
    weeklyReport:        true,
    missedHabitNudge:    true,
    nudgeTime:           '21:00',
  });
  const [loading, setLoading] = useState(false);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/notifications/prefs');
        setPrefs(data);
      } catch (err) { /* use defaults */ }
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/notifications/prefs', prefs);
      toast.success('Settings saved! ✅');
    } catch (err) {
      toast.error('Failed to save settings');
    }
    setSaving(false);
  };

  const handleEnablePush = async () => {
    const result = await subscribe();
    if (result.success) {
      toast.success('Push notifications enabled! 🔔');
      setPrefs((p) => ({ ...p, pushNotifications: true }));
    } else {
      toast.error('Could not enable push notifications');
    }
  };

  const toggle = (key) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-violet-600
                      border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">

      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0  }}
        className="mb-6"
      >
        <h1 className="text-white text-2xl font-bold">Settings</h1>
        <p className="text-[#64748B] text-sm mt-0.5">
          Manage your notification preferences
        </p>
      </motion.div>

      <div className="space-y-4">

        {/* push notifications */}
        <Section title="Push Notifications" icon={Bell}>
          <div className="space-y-4">
            {/* enable push */}
            {permission !== 'granted' ? (
              <div className="flex items-center justify-between
                              p-4 rounded-xl bg-violet-600/10
                              border border-violet-500/20">
                <div>
                  <p className="text-white text-sm font-medium">
                    Enable Push Notifications
                  </p>
                  <p className="text-[#64748B] text-xs mt-0.5">
                    Get notified even when the app is closed
                  </p>
                </div>
                <button
                  onClick={handleEnablePush}
                  className="bg-violet-600 hover:bg-violet-500
                             text-white text-xs font-medium
                             rounded-lg px-3 py-2 transition-all"
                >
                  Enable
                </button>
              </div>
            ) : (
              <ToggleRow
                label="Push Notifications"
                desc="Receive push notifications on this device"
                value={prefs.pushNotifications}
                onChange={() => toggle('pushNotifications')}
              />
            )}

            <ToggleRow
              label="Habit Reminders"
              desc="Get reminded when it's time for your habits"
              value={prefs.habitReminders}
              onChange={() => toggle('habitReminders')}
              disabled={!prefs.pushNotifications}
            />

            <ToggleRow
              label="Missed Habit Nudge"
              desc="Alert if you haven't logged habits by evening"
              value={prefs.missedHabitNudge}
              onChange={() => toggle('missedHabitNudge')}
              disabled={!prefs.pushNotifications}
            />

            {prefs.missedHabitNudge && prefs.pushNotifications && (
              <TimeRow
                label="Nudge Time"
                value={prefs.nudgeTime}
                onChange={(v) => setPrefs({ ...prefs, nudgeTime: v })}
              />
            )}
          </div>
        </Section>

        {/* email notifications */}
        <Section title="Email Notifications" icon={Mail}>
          <div className="space-y-4">
            <ToggleRow
              label="Email Notifications"
              desc="Receive notifications via email"
              value={prefs.emailNotifications}
              onChange={() => toggle('emailNotifications')}
            />

            <ToggleRow
              label="Daily Summary"
              desc="Receive your daily habit summary by email"
              value={prefs.dailySummary}
              onChange={() => toggle('dailySummary')}
              disabled={!prefs.emailNotifications}
            />

            {prefs.dailySummary && prefs.emailNotifications && (
              <TimeRow
                label="Summary Time"
                value={prefs.dailySummaryTime}
                onChange={(v) =>
                  setPrefs({ ...prefs, dailySummaryTime: v })}
              />
            )}

            <ToggleRow
              label="Weekly Report"
              desc="Get a detailed weekly performance report"
              value={prefs.weeklyReport}
              onChange={() => toggle('weeklyReport')}
              disabled={!prefs.emailNotifications}
            />
          </div>
        </Section>

        {/* save button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2
                     bg-violet-600 hover:bg-violet-500
                     disabled:opacity-50 text-white font-semibold
                     rounded-xl py-3.5 transition-all
                     shadow-lg shadow-violet-600/25"
        >
          {saving ? (
            <>
              <svg className="animate-spin h-4 w-4"
                fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12"
                  r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Settings
            </>
          )}
        </motion.button>

      </div>
    </div>
  );
}

// ── REUSABLE COMPONENTS ──

function Section({ title, icon: Icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0  }}
      className="bg-[#111118] border border-[#1E1E2E]
                 rounded-2xl p-5"
    >
      <div className="flex items-center gap-2 mb-4 pb-4
                      border-b border-[#1E1E2E]">
        <div className="w-8 h-8 rounded-lg bg-violet-600/20
                        flex items-center justify-center">
          <Icon size={16} className="text-violet-400" />
        </div>
        <h2 className="text-white font-semibold">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

function ToggleRow({ label, desc, value, onChange, disabled }) {
  return (
    <div className={`flex items-center justify-between
                     ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        <p className="text-[#64748B] text-xs mt-0.5">{desc}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-all
                    ${value ? 'bg-violet-600' : 'bg-[#1E1E2E]'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full
                         bg-white transition-all
                         ${value ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );
}

function TimeRow({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Clock size={14} className="text-[#64748B]" />
        <p className="text-[#94A3B8] text-sm">{label}</p>
      </div>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#0A0A0F] border border-[#1E1E2E]
                   text-white rounded-lg px-3 py-1.5 text-sm
                   focus:outline-none focus:border-violet-500
                   [color-scheme:dark]"
      />
    </div>
  );
}