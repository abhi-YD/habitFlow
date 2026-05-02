import { motion } from 'framer-motion';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function WeeklyHeatmap({ habits = [], logs = {} }) {
  // get last 7 days
  const getLast7Days = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        date: d.toISOString().split('T')[0],
        day:  DAYS[d.getDay()],
        isToday: i === 6
      };
    });
  };

  const days = getLast7Days();

  // calculate completion % for each day
  const getDayScore = (date) => {
    const dayLogs = logs[date] || [];
    if (!dayLogs.length) return 0;
    const completed = dayLogs.filter((l) => l.completed).length;
    return Math.round((completed / dayLogs.length) * 100);
  };

  const getColor = (score) => {
    if (score === 0)   return 'bg-[#1E1E2E]';
    if (score < 40)    return 'bg-violet-900/60';
    if (score < 70)    return 'bg-violet-600/70';
    return                    'bg-[#06FFA5]/80';
  };

  return (
    <div className="bg-[#111118] border border-[#1E1E2E]
                    rounded-2xl p-5">
      <p className="text-[#64748B] text-xs font-medium
                    uppercase tracking-wider mb-4">
        This Week
      </p>

      <div className="grid grid-cols-7 gap-2">
        {days.map(({ date, day, isToday }, i) => {
          const score = getDayScore(date);
          return (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center gap-2"
            >
              <span className={`text-xs font-medium
                ${isToday ? 'text-white' : 'text-[#64748B]'}`}>
                {day}
              </span>
              <div className={`w-8 h-8 rounded-lg ${getColor(score)}
                              flex items-center justify-center
                              ${isToday
                                ? 'ring-2 ring-violet-500 ring-offset-1 ring-offset-[#111118]'
                                : ''}`}>
                <span className="text-xs text-white/70 font-medium">
                  {score > 0 ? `${score}` : ''}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* legend */}
      <div className="flex items-center gap-2 mt-4 pt-3
                      border-t border-[#1E1E2E]">
        <span className="text-[#64748B] text-xs">Less</span>
        {['bg-[#1E1E2E]', 'bg-violet-900/60',
          'bg-violet-600/70', 'bg-[#06FFA5]/80'].map((c) => (
          <div key={c} className={`w-4 h-4 rounded ${c}`} />
        ))}
        <span className="text-[#64748B] text-xs">More</span>
      </div>
    </div>
  );
}