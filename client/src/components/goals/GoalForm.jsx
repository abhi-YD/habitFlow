import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import useGoalStore  from '../../store/goalStore';
import useHabitStore from '../../store/habitStore';
import usePlanStore from '../../store/planStore';


const ICONS  = ['🎯','🏆','💪','📚','🌿','❤️','🧠','☀️','🔥','⭐'];
const COLORS = ['#7C3AED','#06FFA5','#F59E0B','#EF4444',
                '#3B82F6','#EC4899','#10B981','#F97316'];
const LEVELS = [
  { value: 'daily',   label: 'Daily',   desc: 'Resets every day'   },
  { value: 'weekly',  label: 'Weekly',  desc: 'Resets every week'  },
  { value: 'monthly', label: 'Monthly', desc: 'Resets every month' },
  { value: 'yearly',  label: 'Yearly',  desc: 'Full year goal'     },
];

const getDateRange = (level) => {
  const now   = new Date();
  const start = now.toISOString().split('T')[0];
  let end;
  if (level === 'daily') {
    end = start;
  } else if (level === 'weekly') {
    const e = new Date(now);
    e.setDate(now.getDate() + (7 - now.getDay()));
    end = e.toISOString().split('T')[0];
  } else if (level === 'monthly') {
    end = new Date(now.getFullYear(),
      now.getMonth() + 1, 0).toISOString().split('T')[0];
  } else {
    end = `${now.getFullYear()}-12-31`;
  }
  return { start, end };
};

const defaultForm = {
  title:          '',
  description:    '',
  level:          'monthly',
  targetValue:    30,
  unit:           '%',
  linkedHabitIds: [],
  startDate:      '',
  endDate:        '',
  icon:           '🎯',
  color:          '#7C3AED',
};

export default function GoalForm({ open, onClose, editGoal = null }) {
  const { createGoal, updateGoal } = useGoalStore();
  const { habits }                 = useHabitStore();
  const [form, setForm]            = useState(defaultForm);
  const [loading, setLoading]      = useState(false);

  useEffect(() => {
    if (editGoal) {
      setForm({
        title:          editGoal.title          || '',
        description:    editGoal.description    || '',
        level:          editGoal.level          || 'monthly',
        targetValue:    editGoal.targetValue    || 30,
        unit:           editGoal.unit           || '%',
        linkedHabitIds: editGoal.linkedHabitIds?.map(
          (h) => h._id || h) || [],
        startDate:      editGoal.startDate      || '',
        endDate:        editGoal.endDate        || '',
        icon:           editGoal.icon           || '🎯',
        color:          editGoal.color          || '#7C3AED',
      });
    } else {
      const { start, end } = getDateRange('monthly');
      setForm({ ...defaultForm, startDate: start, endDate: end });
    }
  }, [editGoal, open]);

  // auto update dates when level changes
  const handleLevelChange = (level) => {
    const { start, end } = getDateRange(level);
    setForm((f) => ({ ...f, level, startDate: start, endDate: end }));
  };

  const toggleHabit = (id) => {
    setForm((f) => ({
      ...f,
      linkedHabitIds: f.linkedHabitIds.includes(id)
        ? f.linkedHabitIds.filter((h) => h !== id)
        : [...f.linkedHabitIds, id]
    }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error('Goal title is required');
      return;
    }
    if (!form.targetValue || form.targetValue < 1) {
      toast.error('Target value must be at least 1');
      return;
    }
    setLoading(true);

    const result = editGoal
      ? await updateGoal(editGoal._id, form)
      : await createGoal(form);

    if (result.success) {
      toast.success(editGoal ? 'Goal updated!' : '🏆 Goal created!');
      onClose();
    } else if (result.code === 'GOAL_LIMIT_REACHED') {
      onClose();
      usePlanStore.getState().openUpgradeModal(
        'You\'ve reached the 3 goal limit on Free plan'
      );
    } else {
      toast.error(result.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60
                       backdrop-blur-sm z-50"
          />

          {/* modal */}
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={{
              top: -200, left: -350,
              right: 350, bottom: 200
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1    }}
            exit={{    opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-1/2 left-1/2
                       -translate-x-1/2 -translate-y-1/2
                       w-[90vw] md:w-[480px]
                       bg-[#111118] border border-[#1E1E2E]
                       rounded-2xl z-50 shadow-2xl flex flex-col"
            style={{ height: '85vh', maxHeight: '660px' }}
          >
            {/* fixed header */}
            <div className="flex-shrink-0 px-6 pt-4 pb-4
                            border-b border-[#1E1E2E]
                            cursor-grab active:cursor-grabbing
                            rounded-t-2xl">
              <div className="flex justify-center mb-3">
                <div className="w-10 h-1 bg-[#2E2E4E] rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-xl">
                  {editGoal ? 'Edit Goal' : 'New Goal'}
                </h3>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl bg-[#1E1E2E]
                             flex items-center justify-center
                             text-[#64748B] hover:text-white
                             transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="space-y-5">

                {/* preview */}
                <div className="flex items-center gap-3 p-4
                                rounded-xl bg-[#0A0A0F]
                                border border-[#1E1E2E]">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center
                                justify-center text-2xl flex-shrink-0"
                    style={{
                      backgroundColor: `${form.color}20`,
                      border: `1px solid ${form.color}40`
                    }}
                  >
                    {form.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {form.title || 'Goal title'}
                    </p>
                    <p className="text-[#64748B] text-xs capitalize mt-0.5">
                      {form.level} · target {form.targetValue} {form.unit}
                    </p>
                    {/* mini progress */}
                    <div className="w-full h-1 bg-[#1E1E2E]
                                    rounded-full mt-2">
                      <div className="h-full w-0 rounded-full
                                      transition-all"
                        style={{ backgroundColor: form.color }} />
                    </div>
                  </div>
                </div>

                {/* title */}
                <div>
                  <label className="block text-sm font-medium
                                    text-[#94A3B8] mb-2">
                    Goal Title
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Meditate 25 days this month..."
                    className="w-full bg-[#0A0A0F] border border-[#1E1E2E]
                               text-white placeholder-[#64748B]
                               rounded-xl px-4 py-3 focus:outline-none
                               focus:border-violet-500
                               focus:ring-1 focus:ring-violet-500"
                  />
                </div>

                {/* description */}
                <div>
                  <label className="block text-sm font-medium
                                    text-[#94A3B8] mb-2">
                    Description{' '}
                    <span className="text-[#64748B]">(optional)</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })}
                    placeholder="Why is this goal important to you?"
                    rows={2}
                    className="w-full bg-[#0A0A0F] border border-[#1E1E2E]
                               text-white placeholder-[#64748B]
                               rounded-xl px-4 py-3 focus:outline-none
                               focus:border-violet-500
                               focus:ring-1 focus:ring-violet-500
                               resize-none"
                  />
                </div>

                {/* icon picker */}
                <div>
                  <label className="block text-sm font-medium
                                    text-[#94A3B8] mb-2">
                    Icon
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setForm({ ...form, icon })}
                        className={`w-10 h-10 rounded-xl text-xl
                                    flex items-center justify-center
                                    transition-all
                                    ${form.icon === icon
                                      ? 'bg-violet-600/30 ring-2 ring-violet-500'
                                      : 'bg-[#0A0A0F] hover:bg-[#1E1E2E]'}`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* color picker */}
                <div>
                  <label className="block text-sm font-medium
                                    text-[#94A3B8] mb-2">
                    Color
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setForm({ ...form, color })}
                        className={`w-8 h-8 rounded-full transition-all
                                    ${form.color === color
                                      ? 'ring-2 ring-white ring-offset-2 ring-offset-[#111118] scale-110'
                                      : 'hover:scale-105'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* level */}
                <div>
                  <label className="block text-sm font-medium
                                    text-[#94A3B8] mb-2">
                    Goal Level
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {LEVELS.map((l) => (
                      <button
                        key={l.value}
                        type="button"
                        onClick={() => handleLevelChange(l.value)}
                        className={`p-3 rounded-xl text-left
                                    transition-all border
                                    ${form.level === l.value
                                      ? 'bg-violet-600/20 border-violet-500/40 text-white'
                                      : 'bg-[#0A0A0F] border-[#1E1E2E] text-[#64748B] hover:text-white'}`}
                      >
                        <p className="text-sm font-medium">
                          {l.label}
                        </p>
                        <p className="text-xs opacity-60 mt-0.5">
                          {l.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* target value + unit */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium
                                      text-[#94A3B8] mb-2">
                      Target Value
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={form.targetValue}
                      onChange={(e) => setForm({
                        ...form,
                        targetValue: Number(e.target.value)
                      })}
                      className="w-full bg-[#0A0A0F] border border-[#1E1E2E]
                                 text-white rounded-xl px-4 py-3
                                 focus:outline-none focus:border-violet-500
                                 focus:ring-1 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium
                                      text-[#94A3B8] mb-2">
                      Unit
                    </label>
                    <select
                      value={form.unit}
                      onChange={(e) =>
                        setForm({ ...form, unit: e.target.value })}
                      className="w-full bg-[#0A0A0F] border border-[#1E1E2E]
                                 text-white rounded-xl px-4 py-3
                                 focus:outline-none focus:border-violet-500
                                 focus:ring-1 focus:ring-violet-500
                                 appearance-none"
                    >
                      <option value="%">% (percent)</option>
                      <option value="days">days</option>
                      <option value="times">times</option>
                      <option value="hours">hours</option>
                      <option value="km">km</option>
                    </select>
                  </div>
                </div>

                {/* date range */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium
                                      text-[#94A3B8] mb-2">
                      Start Date
                    </label>
                    <div className="relative">
                      <Calendar size={14}
                        className="absolute left-3 top-1/2
                                   -translate-y-1/2 text-[#64748B]" />
                      <input
                        type="date"
                        value={form.startDate}
                        onChange={(e) => setForm({
                          ...form, startDate: e.target.value
                        })}
                        className="w-full bg-[#0A0A0F] border border-[#1E1E2E]
                                   text-white rounded-xl pl-9 pr-3 py-3
                                   focus:outline-none focus:border-violet-500
                                   text-sm [color-scheme:dark]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium
                                      text-[#94A3B8] mb-2">
                      End Date
                    </label>
                    <div className="relative">
                      <Calendar size={14}
                        className="absolute left-3 top-1/2
                                   -translate-y-1/2 text-[#64748B]" />
                      <input
                        type="date"
                        value={form.endDate}
                        onChange={(e) => setForm({
                          ...form, endDate: e.target.value
                        })}
                        className="w-full bg-[#0A0A0F] border border-[#1E1E2E]
                                   text-white rounded-xl pl-9 pr-3 py-3
                                   focus:outline-none focus:border-violet-500
                                   text-sm [color-scheme:dark]"
                      />
                    </div>
                  </div>
                </div>

                {/* link habits */}
                {habits.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium
                                      text-[#94A3B8] mb-2">
                      Link Habits{' '}
                      <span className="text-[#64748B]">(optional)</span>
                    </label>
                    <div className="space-y-2">
                      {habits.map((h) => (
                        <button
                          key={h._id}
                          type="button"
                          onClick={() => toggleHabit(h._id)}
                          className={`w-full flex items-center gap-3
                                      p-3 rounded-xl border transition-all
                                      ${form.linkedHabitIds.includes(h._id)
                                        ? 'bg-violet-600/15 border-violet-500/30 text-white'
                                        : 'bg-[#0A0A0F] border-[#1E1E2E] text-[#64748B] hover:text-white'}`}
                        >
                          <span className="text-lg">{h.icon}</span>
                          <span className="text-sm font-medium">
                            {h.name}
                          </span>
                          {form.linkedHabitIds.includes(h._id) && (
                            <span className="ml-auto text-violet-400
                                             text-xs">
                              ✓ linked
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* fixed footer */}
            <div className="flex-shrink-0 px-6 py-4
                            border-t border-[#1E1E2E]
                            bg-[#111118] rounded-b-2xl">
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-violet-600 hover:bg-violet-500
                           disabled:opacity-50 disabled:cursor-not-allowed
                           text-white font-semibold rounded-xl py-3.5
                           transition-all shadow-lg shadow-violet-600/25"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4"
                      fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12"
                        r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Saving...
                  </span>
                ) : editGoal ? 'Save Changes' : 'Create Goal'}
              </motion.button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}