import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, Check,
         ChevronRight, Lightbulb } from 'lucide-react';
import toast from 'react-hot-toast';
import useHabitStore from '../../store/habitStore';

const difficultyConfig = {
  easy:   { color: 'text-[#06FFA5]', bg: 'bg-[#06FFA5]/10',
            label: 'Easy'   },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/10',
            label: 'Medium' },
  hard:   { color: 'text-red-400',   bg: 'bg-red-500/10',
            label: 'Hard'   },
};

export default function HabitSuggestions({
  suggestions, isLoading, onFetch
}) {
  const [goal, setGoal]       = useState('');
  const [added, setAdded]     = useState({});
  const { createHabit }       = useHabitStore();

  const handleAddHabit = async (habit, index) => {
    const result = await createHabit({
      name:         habit.name,
      icon:         habit.icon,
      frequency:    habit.frequency,
      weeklyTarget: habit.weeklyTarget,
      dailyTarget:  habit.dailyTarget,
      reminderTime: habit.reminderTime,
      color:        '#7C3AED',
    });
    if (result.success) {
      setAdded((prev) => ({ ...prev, [index]: true }));
      toast.success(`${habit.icon} ${habit.name} added!`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!goal.trim()) return;
    onFetch(goal);
  };

  return (
    <div className="bg-[#111118] border border-[#1E1E2E]
                    rounded-2xl p-6">

      {/* header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-violet-600/20
                        border border-violet-500/30
                        flex items-center justify-center">
          <Lightbulb size={16} className="text-violet-400" />
        </div>
        <div>
          <h3 className="text-white font-bold">AI Habit Suggestions</h3>
          <p className="text-[#64748B] text-xs">
            Tell your goal → get a personalized habit plan
          </p>
        </div>
      </div>

      {/* goal input */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-5">
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g. lose weight, sleep better, be productive..."
          className="flex-1 bg-[#0A0A0F] border border-[#1E1E2E]
                     text-white placeholder-[#64748B]
                     rounded-xl px-4 py-3 text-sm
                     focus:outline-none focus:border-violet-500
                     focus:ring-1 focus:ring-violet-500"
        />
        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          disabled={isLoading || !goal.trim()}
          className="flex items-center gap-2 bg-violet-600
                     hover:bg-violet-500 disabled:opacity-50
                     text-white text-sm font-medium
                     rounded-xl px-4 py-3 transition-all
                     whitespace-nowrap"
        >
          {isLoading ? (
            <svg className="animate-spin h-4 w-4"
              fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12"
                r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <Sparkles size={14} />
          )}
          {isLoading ? 'Thinking...' : 'Suggest'}
        </motion.button>
      </form>

      {/* loading skeleton */}
      {isLoading && (
        <div className="space-y-3 animate-pulse">
          {[1,2,3].map((i) => (
            <div key={i} className="h-20 bg-[#0A0A0F]
                                    rounded-xl border border-[#1E1E2E]" />
          ))}
        </div>
      )}

      {/* results */}
      <AnimatePresence>
        {suggestions && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {/* plan summary */}
            <div className="p-4 rounded-xl bg-[#06FFA5]/5
                            border border-[#06FFA5]/15 mb-4">
              <p className="text-[#06FFA5] text-xs font-semibold
                             uppercase tracking-wider mb-1">
                Your Plan
              </p>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                {suggestions.planSummary}
              </p>
            </div>

            {/* habit cards */}
            {suggestions.habits.map((habit, i) => {
              const d = difficultyConfig[habit.difficulty]
                     || difficultyConfig.easy;
              const isAdded = added[i];

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0   }}
                  transition={{ delay: i * 0.07  }}
                  className={`flex items-start gap-3 p-4
                              rounded-xl border transition-all
                              ${isAdded
                                ? 'bg-[#06FFA5]/5 border-[#06FFA5]/20'
                                : 'bg-[#0A0A0F] border-[#1E1E2E] hover:border-[#2E2E4E]'}`}
                >
                  {/* icon */}
                  <div className="w-10 h-10 rounded-xl
                                  bg-violet-600/20
                                  border border-violet-500/30
                                  flex items-center justify-center
                                  text-xl flex-shrink-0">
                    {habit.icon}
                  </div>

                  {/* content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1
                                    flex-wrap">
                      <p className="text-white text-sm font-medium">
                        {habit.name}
                      </p>
                      <span className={`text-xs px-2 py-0.5
                                        rounded-full ${d.bg} ${d.color}`}>
                        {d.label}
                      </span>
                      <span className="text-xs text-[#64748B]
                                       bg-[#1E1E2E] px-2 py-0.5
                                       rounded-full capitalize">
                        {habit.frequency}
                      </span>
                    </div>
                    <p className="text-[#64748B] text-xs
                                  leading-relaxed mb-2">
                      {habit.reason}
                    </p>
                    <div className="flex items-center gap-3
                                    text-xs text-[#64748B]">
                      <span>🎯 {habit.weeklyTarget}x/week</span>
                      {habit.reminderTime && (
                        <span>⏰ {habit.reminderTime}</span>
                      )}
                      {habit.dailyTarget > 1 && (
                        <span>📊 {habit.dailyTarget}x/day</span>
                      )}
                    </div>
                  </div>

                  {/* add button */}
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleAddHabit(habit, i)}
                    disabled={isAdded}
                    className={`w-9 h-9 rounded-xl flex-shrink-0
                                flex items-center justify-center
                                transition-all
                                ${isAdded
                                  ? 'bg-[#06FFA5]/20 text-[#06FFA5]'
                                  : 'bg-violet-600/20 text-violet-400 hover:bg-violet-600 hover:text-white'}`}
                  >
                    {isAdded
                      ? <Check size={16} />
                      : <Plus size={16} />}
                  </motion.button>
                </motion.div>
              );
            })}

            {/* first week tip */}
            <div className="flex items-start gap-3 p-4
                            rounded-xl bg-amber-500/5
                            border border-amber-500/15 mt-2">
              <span className="text-lg flex-shrink-0">💡</span>
              <div>
                <p className="text-amber-400 text-xs font-semibold
                               uppercase tracking-wider mb-1">
                  First Week Tip
                </p>
                <p className="text-[#94A3B8] text-sm">
                  {suggestions.firstWeekTip}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}