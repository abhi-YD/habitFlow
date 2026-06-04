import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export default function HabitStatsList({ data = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ delay: 0.3 }}
      className="bg-[#111118] border border-[#1E1E2E]
                 rounded-2xl p-5"
    >
      <div className="mb-4">
        <h3 className="text-white font-bold">Habit Breakdown</h3>
        <p className="text-[#64748B] text-xs mt-0.5">
          Ranked by completion rate
        </p>
      </div>

      <div className="space-y-3">
        {data.map((habit, i) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0   }}
            transition={{ delay: i * 0.05  }}
            className="flex items-center gap-3"
          >
            {/* rank */}
            <span className="text-[#2E2E4E] text-xs
                             font-mono w-4 flex-shrink-0">
              {i + 1}
            </span>

            {/* icon */}
            <span className="text-lg flex-shrink-0">{habit.icon}</span>

            {/* name + bar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center
                              justify-between mb-1">
                <span className="text-white text-xs
                                 font-medium truncate">
                  {habit.name}
                </span>
                <span className="text-xs font-bold ml-2
                                 flex-shrink-0"
                  style={{ color: habit.color || '#7C3AED' }}>
                  {habit.completionRate}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#1E1E2E]
                              rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${habit.completionRate}%` }}
                  transition={{ duration: 0.8, delay: i * 0.05,
                                ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: habit.color || '#7C3AED' }}
                />
              </div>
            </div>

            {/* streak */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Flame size={12} className="text-orange-400" />
              <span className="text-white text-xs font-bold">
                {habit.streak}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}