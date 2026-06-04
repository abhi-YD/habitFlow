
import { motion } from 'framer-motion';
import { Flame, TrendingUp, Target,
         Calendar, Trophy, Zap } from 'lucide-react';

export default function OverviewCards({ overview }) {
  if (!overview) return null;

  const cards = [
    {
      label: 'Overall Rate',
      value: `${overview.overallRate}%`,
      icon:  Target,
      color: '#7C3AED',
      bg:    'bg-violet-600/10',
      border:'border-violet-500/20',
      sub:   `${overview.totalCompleted} habits completed`
    },
    {
      label: 'Avg Daily Score',
      value: `${overview.avgDailyScore}%`,
      icon:  TrendingUp,
      color: '#06FFA5',
      bg:    'bg-[#06FFA5]/10',
      border:'border-[#06FFA5]/20',
      sub:   `Best day: ${overview.bestDay || '—'}`
    },
    {
      label: 'Current Streak',
      value: `${overview.currentStreak}`,
      icon:  Flame,
      color: '#F97316',
      bg:    'bg-orange-500/10',
      border:'border-orange-500/20',
      sub:   `Longest: ${overview.longestStreak} days`
    },
    {
      label: 'Total Habits',
      value: overview.totalHabits,
      icon:  Calendar,
      color: '#3B82F6',
      bg:    'bg-blue-500/10',
      border:'border-blue-500/20',
      sub:   `Worst day: ${overview.worstDay || '—'}`
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: i * 0.08 }}
            className={`${card.bg} border ${card.border}
                        rounded-2xl p-5`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[#64748B] text-xs font-medium
                            uppercase tracking-wider">
                {card.label}
              </p>
              <div className="w-8 h-8 rounded-lg flex items-center
                              justify-center bg-black/20">
                <Icon size={15} style={{ color: card.color }} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              {card.value}
            </p>
            <p className="text-[#64748B] text-xs">{card.sub}</p>
          </motion.div>
        );
      })}

      {/* best + worst habit */}
      {overview.bestHabit && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.35 }}
          className="bg-[#06FFA5]/5 border border-[#06FFA5]/15
                     rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={14} className="text-[#06FFA5]" />
            <p className="text-[#06FFA5] text-xs font-semibold
                          uppercase tracking-wider">
              Best Habit
            </p>
          </div>
          <p className="text-2xl mb-1">{overview.bestHabit.icon}</p>
          <p className="text-white font-semibold text-sm">
            {overview.bestHabit.name}
          </p>
          <p className="text-[#06FFA5] text-xs mt-1">
            {overview.bestHabit.rate}% completion
          </p>
        </motion.div>
      )}

      {overview.worstHabit &&
       overview.worstHabit.name !== overview.bestHabit?.name && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.4 }}
          className="bg-red-500/5 border border-red-500/15
                     rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-red-400" />
            <p className="text-red-400 text-xs font-semibold
                          uppercase tracking-wider">
              Needs Work
            </p>
          </div>
          <p className="text-2xl mb-1">{overview.worstHabit.icon}</p>
          <p className="text-white font-semibold text-sm">
            {overview.worstHabit.name}
          </p>
          <p className="text-red-400 text-xs mt-1">
            {overview.worstHabit.rate}% completion
          </p>
        </motion.div>
      )}
    </div>
  );
}