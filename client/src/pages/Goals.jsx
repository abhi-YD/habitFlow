import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trophy, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useGoalStore  from '../store/goalStore';
import useHabitStore from '../store/habitStore';
import GoalForm      from '../components/goals/GoalForm';

const LEVEL_CONFIG = {
  daily:   { label: 'Daily',   color: '#06FFA5', bg: 'bg-[#06FFA5]/10',
             border: 'border-[#06FFA5]/20', icon: '☀️' },
  weekly:  { label: 'Weekly',  color: '#7C3AED', bg: 'bg-violet-500/10',
             border: 'border-violet-500/20', icon: '📅' },
  monthly: { label: 'Monthly', color: '#F59E0B', bg: 'bg-amber-500/10',
             border: 'border-amber-500/20', icon: '🗓️' },
  yearly:  { label: 'Yearly',  color: '#EF4444', bg: 'bg-red-500/10',
             border: 'border-red-500/20', icon: '🏆' },
};

const LEVEL_ORDER = ['daily', 'weekly', 'monthly', 'yearly'];

export default function Goals() {
  const { goals, fetchGoals,
          deleteGoal, updateProgress } = useGoalStore();
  const { habits, fetchHabits }        = useHabitStore();

  const [formOpen,  setFormOpen]  = useState(false);
  const [editGoal,  setEditGoal]  = useState(null);
  const [filter,    setFilter]    = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    await Promise.all([fetchGoals(), fetchHabits()]);
    setIsLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id) => {
    await deleteGoal(id);
    toast.success('Goal deleted');
  };

  const handleEdit = (goal) => {
    setEditGoal(goal);
    setFormOpen(true);
  };

  const handleUpdateProgress = async (id) => {
    await updateProgress(id);
    toast.success('Progress updated!');
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditGoal(null);
    loadData();
  };

  // filter goals
  const filtered = filter === 'all'
    ? goals
    : goals.filter((g) => g.level === filter);

  // group by level
  const grouped = LEVEL_ORDER.reduce((acc, level) => {
    acc[level] = filtered.filter((g) => g.level === level);
    return acc;
  }, {});

  // overall stats
  const completed = goals.filter((g) => g.isCompleted).length;
  const active    = goals.filter((g) => !g.isCompleted).length;

  return (
    <div className="max-w-4xl mx-auto">

      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0  }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-white text-2xl font-bold">Goals</h1>
          <p className="text-[#64748B] text-sm mt-0.5">
            {active} active · {completed} completed
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditGoal(null);
            setFormOpen(true);
          }}
          className="flex items-center gap-2 bg-violet-600
                     hover:bg-violet-500 text-white font-medium
                     rounded-xl px-4 py-2.5 text-sm transition-all
                     shadow-lg shadow-violet-600/25"
        >
          <Plus size={16} />
          New Goal
        </motion.button>
      </motion.div>

      {/* ── STATS ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-4 gap-3 mb-6"
      >
        {LEVEL_ORDER.map((level) => {
          const c     = LEVEL_CONFIG[level];
          const count = goals.filter((g) => g.level === level).length;
          return (
            <div key={level}
              className={`${c.bg} border ${c.border}
                          rounded-2xl p-4 text-center`}>
              <p className="text-xl mb-1">{c.icon}</p>
              <p className="text-white font-bold text-lg">{count}</p>
              <p className="text-[#64748B] text-xs">{c.label}</p>
            </div>
          );
        })}
      </motion.div>

      {/* ── FILTER TABS ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-1 bg-[#111118]
                   border border-[#1E1E2E] rounded-xl p-1
                   mb-6 w-fit"
      >
        {['all', ...LEVEL_ORDER].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs
                        font-medium capitalize transition-all
                        ${filter === f
                          ? 'bg-violet-600 text-white'
                          : 'text-[#64748B] hover:text-white'}`}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* ── GOALS LIST ── */}
      {isLoading ? (
        <div className="flex items-center justify-center
                        min-h-[40vh]">
          <div className="w-8 h-8 border-2 border-violet-600
                          border-t-transparent rounded-full
                          animate-spin" />
        </div>

      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center
                     min-h-[40vh] gap-4"
        >
          <div className="w-20 h-20 rounded-2xl bg-[#111118]
                          border border-[#1E1E2E]
                          flex items-center justify-center">
            <Trophy size={32} className="text-[#2E2E4E]" />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold mb-1">
              No goals yet
            </p>
            <p className="text-[#64748B] text-sm">
              Set your first goal to start tracking progress
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-2 bg-violet-600
                       hover:bg-violet-500 text-white font-medium
                       rounded-xl px-5 py-2.5 text-sm transition-all"
          >
            <Plus size={16} />
            Create First Goal
          </motion.button>
        </motion.div>

      ) : (
        <div className="space-y-8">
          {LEVEL_ORDER.map((level) => {
            const levelGoals = grouped[level];
            if (!levelGoals?.length) return null;
            const c = LEVEL_CONFIG[level];

            return (
              <motion.div
                key={level}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0  }}
              >
                {/* level header */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">{c.icon}</span>
                  <h2 className="text-white font-semibold">
                    {c.label} Goals
                  </h2>
                  <span className="text-[#64748B] text-sm">
                    ({levelGoals.length})
                  </span>
                </div>

                {/* goal cards */}
                <div className="grid grid-cols-1
                                md:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {levelGoals.map((goal) => (
                      <GoalCard
                        key={goal._id}
                        goal={goal}
                        habits={habits}
                        config={c}
                        onEdit={() => handleEdit(goal)}
                        onDelete={() => handleDelete(goal._id)}
                        onUpdateProgress={() =>
                          handleUpdateProgress(goal._id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* form modal */}
      <GoalForm
        open={formOpen}
        onClose={handleCloseForm}
        editGoal={editGoal}
      />
    </div>
  );
}

// ── GOAL CARD COMPONENT ──
function GoalCard({ goal, habits, config,
                    onEdit, onDelete, onUpdateProgress }) {
  const progress = Math.min(
    goal.targetValue > 0
      ? Math.round((goal.currentValue / goal.targetValue) * 100)
      : 0,
    100
  );

  const linkedHabits = habits.filter((h) =>
    goal.linkedHabitIds?.some(
      (id) => (id._id || id) === h._id
    )
  );

  const daysLeft = () => {
    if (!goal.endDate) return null;
    const diff = Math.ceil(
      (new Date(goal.endDate) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  };

  const days = daysLeft();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1   }}
      exit={{    opacity: 0, scale: 0.95 }}
      className={`bg-[#111118] border rounded-2xl p-5
                  transition-all group hover:border-[#2E2E4E]
                  ${goal.isCompleted
                    ? 'border-[#06FFA5]/30'
                    : 'border-[#1E1E2E]'}`}
    >
      {/* top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* icon */}
          <div
            className="w-11 h-11 rounded-xl flex items-center
                       justify-center text-2xl flex-shrink-0"
            style={{
              backgroundColor: `${goal.color}20`,
              border: `1px solid ${goal.color}40`
            }}
          >
            {goal.isCompleted ? '✅' : goal.icon}
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm
                           leading-tight">
              {goal.title}
            </h3>
            {goal.description && (
              <p className="text-[#64748B] text-xs mt-0.5 line-clamp-1">
                {goal.description}
              </p>
            )}
          </div>
        </div>

        {/* actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100
                        transition-opacity flex-shrink-0">
          <button
            onClick={onEdit}
            className="w-7 h-7 rounded-lg bg-[#1E1E2E]
                       flex items-center justify-center
                       text-[#64748B] hover:text-white transition-colors"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={onDelete}
            className="w-7 h-7 rounded-lg bg-[#1E1E2E]
                       flex items-center justify-center
                       text-[#64748B] hover:text-red-400
                       transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-[#64748B]">
            {goal.currentValue} / {goal.targetValue} {goal.unit}
          </span>
          <span className="font-semibold"
            style={{ color: goal.color }}>
            {progress}%
          </span>
        </div>
        <div className="w-full h-2 bg-[#1E1E2E]
                        rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{
              backgroundColor: goal.color,
              boxShadow: `0 0 8px ${goal.color}60`
            }}
          />
        </div>
      </div>

      {/* bottom row */}
      <div className="flex items-center justify-between
                      pt-3 border-t border-[#1E1E2E]">

        {/* dates + days left */}
        <div className="text-xs text-[#64748B]">
          {days !== null && (
            <span className={days < 0
              ? 'text-red-400'
              : days <= 3
              ? 'text-amber-400'
              : 'text-[#64748B]'}>
              {days < 0
                ? 'Overdue'
                : days === 0
                ? 'Due today'
                : `${days} days left`}
            </span>
          )}
        </div>

        {/* linked habits */}
        <div className="flex items-center gap-1">
          {linkedHabits.slice(0, 3).map((h) => (
            <span key={h._id} title={h.name}
              className="text-sm">
              {h.icon}
            </span>
          ))}
          {linkedHabits.length > 3 && (
            <span className="text-xs text-[#64748B]">
              +{linkedHabits.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* completed badge */}
      {goal.isCompleted && (
        <div className="mt-3 flex items-center justify-center
                        gap-2 py-2 rounded-xl
                        bg-[#06FFA5]/10 border border-[#06FFA5]/20">
          <span className="text-[#06FFA5] text-xs font-semibold">
            🎉 Goal Completed!
          </span>
        </div>
      )}
    </motion.div>
  );
}