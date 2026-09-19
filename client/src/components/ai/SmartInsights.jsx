import { motion, AnimatePresence } from 'framer-motion';
import { Brain, RefreshCw, TrendingUp,
         TrendingDown, Minus, Zap } from 'lucide-react';

const typeConfig = {
  strength: { icon: '💪', color: 'text-[#06FFA5]',
              bg: 'bg-[#06FFA5]/10', border: 'border-[#06FFA5]/20' },
  weakness: { icon: '⚠️', color: 'text-red-400',
              bg: 'bg-red-500/10',   border: 'border-red-500/20'   },
  pattern:  { icon: '🔍', color: 'text-blue-400',
              bg: 'bg-blue-500/10',  border: 'border-blue-500/20'  },
  tip:      { icon: '💡', color: 'text-amber-400',
              bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
};

const trendConfig = {
  improving: { icon: TrendingUp,   color: 'text-[#06FFA5]',
               label: 'Improving'  },
  declining: { icon: TrendingDown, color: 'text-red-400',
               label: 'Declining'  },
  stable:    { icon: Minus,        color: 'text-amber-400',
               label: 'Stable'     },
};

export default function SmartInsights({
  insights, isLoading, onRefresh
}) {
  if (isLoading) return <InsightsSkeleton />;

  if (!insights) return (
    <div className="bg-[#111118] border border-[#1E1E2E]
                    rounded-2xl p-6 flex flex-col
                    items-center justify-center gap-4
                    min-h-[200px]">
      <Brain size={32} className="text-[#2E2E4E]" />
      <p className="text-[#64748B] text-sm text-center">
        Analyze your habit patterns with AI
      </p>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onRefresh}
        className="flex items-center gap-2 bg-violet-600
                   hover:bg-violet-500 text-white text-sm
                   font-medium rounded-xl px-4 py-2.5
                   transition-all"
      >
        <Brain size={14} />
        Analyze My Habits
      </motion.button>
    </div>
  );

  const trend = trendConfig[insights.trend] || trendConfig.stable;
  const TrendIcon = trend.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0  }}
      className="bg-[#111118] border border-[#1E1E2E]
                 rounded-2xl p-6"
    >
      {/* header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-600/20
                          border border-violet-500/30
                          flex items-center justify-center">
            <Brain size={16} className="text-violet-400" />
          </div>
          <h3 className="text-white font-bold">Smart Insights</h3>
        </div>
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

      {/* overall score + trend */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-[#0A0A0F] border border-[#1E1E2E]
                        rounded-xl p-4 text-center">
          <p className="text-3xl font-bold mb-1"
            style={{
              color: insights.overallScore >= 70 ? '#06FFA5'
                   : insights.overallScore >= 40 ? '#F59E0B'
                   : '#EF4444'
            }}>
            {insights.overallScore}%
          </p>
          <p className="text-[#64748B] text-xs">Overall Score</p>
        </div>

        <div className="bg-[#0A0A0F] border border-[#1E1E2E]
                        rounded-xl p-4 flex flex-col
                        items-center justify-center gap-1">
          <TrendIcon size={24} className={trend.color} />
          <p className={`text-sm font-semibold ${trend.color}`}>
            {trend.label}
          </p>
          <p className="text-[#64748B] text-xs">Trend</p>
        </div>
      </div>

      {/* best/worst days */}
      {(insights.bestDayOfWeek || insights.worstDayOfWeek) && (
        <div className="grid grid-cols-2 gap-3 mb-5">
          {insights.bestDayOfWeek && (
            <div className="bg-[#06FFA5]/5 border border-[#06FFA5]/15
                            rounded-xl p-3">
              <p className="text-[#06FFA5] text-xs font-semibold
                             uppercase tracking-wider mb-1">
                Best Day
              </p>
              <p className="text-white font-bold">
                {insights.bestDayOfWeek}
              </p>
            </div>
          )}
          {insights.worstDayOfWeek && (
            <div className="bg-red-500/5 border border-red-500/15
                            rounded-xl p-3">
              <p className="text-red-400 text-xs font-semibold
                             uppercase tracking-wider mb-1">
                Needs Work
              </p>
              <p className="text-white font-bold">
                {insights.worstDayOfWeek}
              </p>
            </div>
          )}
        </div>
      )}

      {/* insights list */}
      <div className="space-y-3 mb-4">
        {insights.insights?.map((insight, i) => {
          const t = typeConfig[insight.type] || typeConfig.tip;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0   }}
              transition={{ delay: i * 0.08  }}
              className={`p-4 rounded-xl border ${t.bg} ${t.border}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{t.icon}</span>
                <p className={`text-xs font-semibold
                               uppercase tracking-wider ${t.color}`}>
                  {insight.title}
                </p>
              </div>
              <p className="text-[#94A3B8] text-sm
                            leading-relaxed mb-2">
                {insight.description}
              </p>
              <div className="flex items-start gap-2">
                <Zap size={12} className={`${t.color}
                                           flex-shrink-0 mt-0.5`} />
                <p className={`text-xs font-medium ${t.color}`}>
                  {insight.actionable}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* prediction + weekly challenge */}
      {insights.prediction && (
        <div className="p-3 rounded-xl bg-[#0A0A0F]
                        border border-[#1E1E2E] mb-3">
          <p className="text-[#64748B] text-xs font-semibold
                         uppercase tracking-wider mb-1">
            Prediction
          </p>
          <p className="text-[#94A3B8] text-sm">
            {insights.prediction}
          </p>
        </div>
      )}

      {insights.weeklyChallenge && (
        <div className="p-3 rounded-xl bg-violet-600/10
                        border border-violet-500/20">
          <p className="text-violet-400 text-xs font-semibold
                         uppercase tracking-wider mb-1">
            🏆 Weekly Challenge
          </p>
          <p className="text-white text-sm">
            {insights.weeklyChallenge}
          </p>
        </div>
      )}
    </motion.div>
  );
}

function InsightsSkeleton() {
  return (
    <div className="bg-[#111118] border border-[#1E1E2E]
                    rounded-2xl p-6 animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#1E1E2E]" />
        <div className="h-4 w-32 bg-[#1E1E2E] rounded" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-20 bg-[#1E1E2E] rounded-xl" />
        <div className="h-20 bg-[#1E1E2E] rounded-xl" />
      </div>
      {[1,2,3].map((i) => (
        <div key={i} className="h-24 bg-[#1E1E2E] rounded-xl" />
      ))}
    </div>
  );
}