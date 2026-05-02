import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function HabitItem({ habit, isCompleted, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-3 p-3 rounded-xl
                  border transition-all duration-200 cursor-pointer
                  ${isCompleted
                    ? 'bg-[#06FFA5]/5 border-[#06FFA5]/20'
                    : 'bg-[#0A0A0F] border-[#1E1E2E] hover:border-[#2E2E4E]'
                  }`}
      onClick={onToggle}
    >
      {/* checkbox */}
      <motion.div
        whileTap={{ scale: 0.85 }}
        className={`w-7 h-7 rounded-lg border-2 flex-shrink-0
                    flex items-center justify-center transition-all
                    ${isCompleted
                      ? 'bg-[#06FFA5] border-[#06FFA5]'
                      : 'border-[#2E2E4E] hover:border-violet-500'
                    }`}
      >
        {isCompleted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
          >
            <Check size={14} className="text-black font-bold" />
          </motion.div>
        )}
      </motion.div>

      {/* icon + name */}
      <span className="text-lg">{habit.icon}</span>
      <span className={`text-sm font-medium flex-1
        ${isCompleted
          ? 'text-[#64748B] line-through'
          : 'text-white'}`}>
        {habit.name}
      </span>

      {/* frequency badge */}
      <span className="text-xs text-[#64748B] bg-[#1E1E2E]
                       px-2 py-0.5 rounded-full">
        {habit.frequency}
      </span>
    </motion.div>
  );
}