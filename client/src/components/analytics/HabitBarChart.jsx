import { motion } from 'framer-motion';
import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-[#111118] border border-[#1E1E2E]
                    rounded-xl px-3 py-2 shadow-xl">
      <p className="text-white font-medium text-sm mb-1">
        {d.icon} {d.name}
      </p>
      <p className="text-[#64748B] text-xs">
        {d.completionRate}% completion
      </p>
      <p className="text-[#64748B] text-xs">
        🔥 {d.streak} day streak
      </p>
    </div>
  );
};

export default function HabitBarChart({ data = [] }) {
  const chartData = data.slice(0, 8); // max 8 habits

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ delay: 0.15 }}
      className="bg-[#111118] border border-[#1E1E2E]
                 rounded-2xl p-5"
    >
      <div className="mb-5">
        <h3 className="text-white font-bold">Habit Performance</h3>
        <p className="text-[#64748B] text-xs mt-0.5">
          Completion rate per habit
        </p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData}
          margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3"
            stroke="#1E1E2E" horizontal={true} vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#64748B', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) =>
              v.length > 8 ? v.slice(0, 8) + '…' : v}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#64748B', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="completionRate" radius={[6, 6, 0, 0]}
               maxBarSize={40}>
            {chartData.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.color || '#7C3AED'}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}