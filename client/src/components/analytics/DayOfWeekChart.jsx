import { motion } from 'framer-motion';
import {
  ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, Tooltip
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111118] border border-[#1E1E2E]
                    rounded-xl px-3 py-2 shadow-xl">
      <p className="text-white font-medium text-sm">
        {payload[0].payload.day}
      </p>
      <p className="text-violet-400 text-xs">
        {payload[0].value}% avg score
      </p>
    </div>
  );
};

export default function DayOfWeekChart({ data = [] }) {
  const best  = [...data].sort((a, b) => b.score - a.score)[0];
  const worst = [...data].sort((a, b) => a.score - b.score)[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ delay: 0.2 }}
      className="bg-[#111118] border border-[#1E1E2E]
                 rounded-2xl p-5"
    >
      <div className="mb-5">
        <h3 className="text-white font-bold">Best Days</h3>
        <p className="text-[#64748B] text-xs mt-0.5">
          Performance by day of week
        </p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={data}>
          <PolarGrid stroke="#1E1E2E" />
          <PolarAngleAxis
            dataKey="day"
            tick={{ fill: '#64748B', fontSize: 11 }}
          />
          <Radar
            dataKey="score"
            stroke="#7C3AED"
            fill="#7C3AED"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>

      {/* best/worst summary */}
      <div className="grid grid-cols-2 gap-3 mt-3
                      pt-3 border-t border-[#1E1E2E]">
        <div className="text-center">
          <p className="text-[#06FFA5] text-xs font-semibold
                         uppercase tracking-wider mb-1">
            Best
          </p>
          <p className="text-white font-bold">{best?.day}</p>
          <p className="text-[#64748B] text-xs">{best?.score}%</p>
        </div>
        <div className="text-center">
          <p className="text-red-400 text-xs font-semibold
                         uppercase tracking-wider mb-1">
            Toughest
          </p>
          <p className="text-white font-bold">{worst?.day}</p>
          <p className="text-[#64748B] text-xs">{worst?.score}%</p>
        </div>
      </div>
    </motion.div>
  );
}