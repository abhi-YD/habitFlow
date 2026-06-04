import { useState }            from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListTodo, Sparkles,
         Clock, Target, Zap   } from 'lucide-react';

const quadrantConfig = {
  do_first:  { label: 'Do First',  color: 'text-red-400',
               bg: 'bg-red-500/10',    border: 'border-red-500/20',
               dot: 'bg-red-400',      emoji: '🔥' },
  schedule:  { label: 'Schedule',  color: 'text-amber-400',
               bg: 'bg-amber-500/10',  border: 'border-amber-500/20',
               dot: 'bg-amber-400',    emoji: '📅' },
  delegate:  { label: 'Delegate',  color: 'text-blue-400',
               bg: 'bg-blue-500/10',   border: 'border-blue-500/20',
               dot: 'bg-blue-400',     emoji: '🤝' },
  eliminate: { label: 'Eliminate', color: 'text-[#64748B]',
               bg: 'bg-[#1E1E2E]',    border: 'border-[#2E2E4E]',
               dot: 'bg-[#64748B]',   emoji: '🗑️' },
};

const timeConfig = {
  morning:   { label: 'Morning',   emoji: '🌅' },
  afternoon: { label: 'Afternoon', emoji: '☀️' },
  evening:   { label: 'Evening',   emoji: '🌙' },
};

export default function TaskPrioritizer({
  priorities, isLoading, onPrioritize
}) {
  const [context, setContext] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onPrioritize(context);
  };

  return (
    <div className="bg-[#111118] border border-[#1E1E2E]
                    rounded-2xl p-6">

      {/* header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-violet-600/20
                        border border-violet-500/30
                        flex items-center justify-center">
          <ListTodo size={16} className="text-violet-400" />
        </div>
        <div>
          <h3 className="text-white font-bold">
            AI Task Prioritizer
          </h3>
          <p className="text-[#64748B] text-xs">
            Eisenhower Matrix powered by AI
          </p>
        </div>
      </div>

      {/* context input */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-5">
        <input
          type="text"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Any context? e.g. big presentation tomorrow..."
          className="flex-1 bg-[#0A0A0F] border border-[#1E1E2E]
                     text-white placeholder-[#64748B]
                     rounded-xl px-4 py-3 text-sm
                     focus:outline-none focus:border-violet-500
                     focus:ring-1 focus:ring-violet-500"
        />
        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
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
          ) : <Sparkles size={14} />}
          {isLoading ? 'Analyzing...' : 'Prioritize'}
        </motion.button>
      </form>

      {/* loading */}
      {isLoading && (
        <div className="space-y-3 animate-pulse">
          {[1,2,3].map((i) => (
            <div key={i} className="h-16 bg-[#0A0A0F]
                                    rounded-xl border border-[#1E1E2E]" />
          ))}
        </div>
      )}

      {/* results */}
      <AnimatePresence>
        {priorities && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {/* focus task */}
            <div className="flex items-start gap-3 p-4
                            rounded-xl bg-violet-600/10
                            border border-violet-500/20 mb-4">
              <Target size={16} className="text-violet-400
                                           flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-violet-300 text-xs font-semibold
                               uppercase tracking-wider mb-1">
                  Focus Right Now
                </p>
                <p className="text-white text-sm font-medium">
                  {priorities.focusTask}
                </p>
              </div>
            </div>

            {/* prioritized tasks */}
            {priorities.prioritized?.map((task, i) => {
              const q = quadrantConfig[task.eisenhowerQuadrant]
                     || quadrantConfig.schedule;
              const t = timeConfig[task.suggestedTime]
                     || timeConfig.morning;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0   }}
                  transition={{ delay: i * 0.07  }}
                  className={`p-4 rounded-xl border ${q.bg} ${q.border}`}
                >
                  <div className="flex items-start
                                  justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center
                                      gap-2 mb-1 flex-wrap">
                        <span className="text-base">{q.emoji}</span>
                        <p className="text-white text-sm font-medium">
                          {task.title}
                        </p>
                        <span className={`text-xs px-2 py-0.5
                                          rounded-full bg-[#0A0A0F]
                                          ${q.color}`}>
                          {q.label}
                        </span>
                      </div>
                      <p className="text-[#64748B] text-xs mb-2">
                        {task.reason}
                      </p>
                      <div className="flex items-center
                                      gap-3 text-xs text-[#64748B]">
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {task.estimatedMinutes} min
                        </span>
                        <span>
                          {t.emoji} {t.label}
                        </span>
                      </div>
                    </div>

                    {/* priority score */}
                    <div className="flex-shrink-0 w-10 h-10
                                    rounded-xl bg-[#0A0A0F]
                                    flex items-center justify-center">
                      <span className={`text-sm font-bold ${q.color}`}>
                        {task.priorityScore}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* productivity tip */}
            {priorities.productivityTip && (
              <div className="flex items-start gap-3 p-4
                              rounded-xl bg-[#06FFA5]/5
                              border border-[#06FFA5]/15 mt-2">
                <Zap size={14} className="text-[#06FFA5]
                                          flex-shrink-0 mt-0.5" />
                <p className="text-[#94A3B8] text-sm">
                  {priorities.productivityTip}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* empty state */}
      {!priorities && !isLoading && (
        <div className="flex flex-col items-center
                        justify-center py-8 gap-3">
          <ListTodo size={32} className="text-[#2E2E4E]" />
          <p className="text-[#64748B] text-sm text-center">
            Your pending tasks will be analyzed
            <br />and sorted by importance
          </p>
        </div>
      )}
    </div>
  );
}