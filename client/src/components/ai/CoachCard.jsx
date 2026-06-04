import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, Quote } from 'lucide-react';

const energyConfig = {
  high:   { color: '#06FFA5', bg: 'bg-[#06FFA5]/10',
            border: 'border-[#06FFA5]/20', label: 'High Energy' },
  medium: { color: '#F59E0B', bg: 'bg-amber-500/10',
            border: 'border-amber-500/20', label: 'Medium Energy' },
  low:    { color: '#EF4444', bg: 'bg-red-500/10',
            border: 'border-red-500/20', label: 'Rest Day'       },
};

export default function CoachCard({ coach, onRefresh, isLoading }) {
  if (isLoading) return <CoachSkeleton />;

  if (!coach) return (
    <div className="bg-[#111118] border border-[#1E1E2E]
                    rounded-2xl p-6 flex flex-col
                    items-center justify-center gap-4
                    min-h-[200px]">
      <Sparkles size={32} className="text-[#2E2E4E]" />
      <p className="text-[#64748B] text-sm text-center">
        Get your personalized morning message
      </p>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onRefresh}
        className="flex items-center gap-2 bg-violet-600
                   hover:bg-violet-500 text-white text-sm
                   font-medium rounded-xl px-4 py-2.5
                   transition-all"
      >
        <Sparkles size={14} />
        Get Coach Message
      </motion.button>
    </div>
  );

  const energy = energyConfig[coach.energyLevel] || energyConfig.medium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0  }}
      className="bg-[#111118] border border-[#1E1E2E]
                 rounded-2xl p-6 relative overflow-hidden"
    >
      {/* background glow */}
      <div className="absolute top-0 right-0 w-40 h-40
                      rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: energy.color }} />

      {/* header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-violet-600/20
                          border border-violet-500/30
                          flex items-center justify-center text-2xl">
            {coach.emoji}
          </div>
          <div>
            <h3 className="text-white font-bold text-lg leading-tight">
              {coach.greeting}
            </h3>
            <span className={`text-xs font-medium px-2 py-0.5
                              rounded-full ${energy.bg}
                              ${energy.border} border`}
              style={{ color: energy.color }}>
              {energy.label}
            </span>
          </div>
        </div>

        {/* refresh */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onRefresh}
          className="w-8 h-8 rounded-xl bg-[#1E1E2E]
                     flex items-center justify-center
                     text-[#64748B] hover:text-white
                     transition-colors"
        >
          <RefreshCw size={14} />
        </motion.button>
      </div>

      {/* message */}
      <p className="text-[#94A3B8] text-sm leading-relaxed mb-4">
        {coach.message}
      </p>

      {/* focus habit */}
      <div className="flex items-start gap-3 p-3 rounded-xl
                      bg-violet-600/10 border border-violet-500/20
                      mb-4">
        <Sparkles size={16} className="text-violet-400
                                        flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-violet-300 text-xs font-semibold
                        uppercase tracking-wider mb-1">
            Today's Focus
          </p>
          <p className="text-white text-sm">{coach.focusHabit}</p>
        </div>
      </div>

      {/* quote */}
      <div className="flex items-start gap-2 pt-4
                      border-t border-[#1E1E2E]">
        <Quote size={14} className="text-[#2E2E4E]
                                    flex-shrink-0 mt-0.5" />
        <p className="text-[#64748B] text-xs italic">
          "{coach.dailyQuote}"
        </p>
      </div>
    </motion.div>
  );
}

function CoachSkeleton() {
  return (
    <div className="bg-[#111118] border border-[#1E1E2E]
                    rounded-2xl p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-[#1E1E2E]" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-[#1E1E2E] rounded-lg" />
          <div className="h-3 w-20 bg-[#1E1E2E] rounded-full" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full bg-[#1E1E2E] rounded" />
        <div className="h-3 w-4/5  bg-[#1E1E2E] rounded" />
        <div className="h-3 w-3/4  bg-[#1E1E2E] rounded" />
      </div>
      <div className="h-16 bg-[#1E1E2E] rounded-xl" />
    </div>
  );
}