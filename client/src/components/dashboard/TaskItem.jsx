import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const priorityConfig = {
  high:   { color: 'text-red-400',   bg: 'bg-red-500/10',   dot: 'bg-red-400'   },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/10', dot: 'bg-amber-400' },
  low:    { color: 'text-blue-400',  bg: 'bg-blue-500/10',  dot: 'bg-blue-400'  },
};

export default function TaskItem({ task, onToggle }) {
  const p = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-3 p-3 rounded-xl
                  border transition-all duration-200
                  ${task.completed
                    ? 'bg-[#0A0A0F] border-[#1E1E2E] opacity-50'
                    : 'bg-[#0A0A0F] border-[#1E1E2E] hover:border-[#2E2E4E]'
                  }`}
    >
      {/* checkbox */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onToggle}
        className={`w-7 h-7 rounded-lg border-2 flex-shrink-0
                    flex items-center justify-center transition-all
                    ${task.completed
                      ? 'bg-violet-600 border-violet-600'
                      : 'border-[#2E2E4E] hover:border-violet-500'
                    }`}
      >
        {task.completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
          >
            <Check size={14} className="text-white" />
          </motion.div>
        )}
      </motion.button>

      {/* title */}
      <span className={`text-sm font-medium flex-1
        ${task.completed ? 'line-through text-[#64748B]' : 'text-white'}`}>
        {task.title}
      </span>

      {/* priority badge */}
      <span className={`text-xs font-medium px-2 py-0.5
                        rounded-full ${p.color} ${p.bg}`}>
        {task.priority}
      </span>
    </motion.div>
  );
}