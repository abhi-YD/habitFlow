import { motion } from 'framer-motion';
import { Flame, TrendingUp } from 'lucide-react';

export default function StreakCard({ streak = 0, longest = 0 }) {
  return (
    <div className="bg-[#111118] border border-[#1E1E2E]
                    rounded-2xl p-5 flex flex-col gap-4">

      {/* current streak */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#64748B] text-xs font-medium
                        uppercase tracking-wider mb-1">
            Current Streak
          </p>
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ scale: streak > 0 ? [1, 1.2, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-2xl"
            >
              🔥
            </motion.span>
            <span className="text-3xl font-bold text-white">
              {streak}
            </span>
            <span className="text-[#64748B] text-sm">days</span>
          </div>
        </div>

        {/* glow orb */}
        {streak > 0 && (
          <div className="w-12 h-12 rounded-full
                          bg-orange-500/10 border border-orange-500/20
                          flex items-center justify-center">
            <Flame size={20} className="text-orange-400" />
          </div>
        )}
      </div>

      {/* longest streak */}
      <div className="flex items-center gap-2 pt-3
                      border-t border-[#1E1E2E]">
        <TrendingUp size={14} className="text-[#64748B]" />
        <span className="text-[#64748B] text-xs">
          Best streak:
          <span className="text-white font-semibold ml-1">
            {longest} days
          </span>
        </span>
      </div>
    </div>
  );
}