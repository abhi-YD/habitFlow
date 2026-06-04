import { motion } from 'framer-motion';
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111118] border border-[#1E1E2E]
                    rounded-xl px-3 py-2 shadow-xl">
      <p className="text-[#64748B] text-xs mb-1">{label}</p>
      <p className="text-white font-bold text-sm">
        {payload[0].value}% score
      </p>
      <p className="text-[#64748B] text-xs">
        {payload[0].payload.completed}/{payload[0].payload.total} habits
      </p>
    </div>
  );
};

export default function TrendChart({ data = [] }) {
  // show every Nth label based on data length
  const labelInterval = data.length > 14 ? 6 : 2;

  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('en-IN', {
      month: 'short', day: 'numeric'
    })
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ delay: 0.1 }}
      className="bg-[#111118] border border-[#1E1E2E]
                 rounded-2xl p-5 mb-4"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white font-bold">Completion Trend</h3>
          <p className="text-[#64748B] text-xs mt-0.5">
            Daily score over selected period
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={formatted}
          margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0"
                            x2="0" y2="1">
              <stop offset="5%"  stopColor="#7C3AED"
                    stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7C3AED"
                    stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3"
            stroke="#1E1E2E" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: '#64748B', fontSize: 11 }}
            interval={labelInterval}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#64748B', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#7C3AED"
            strokeWidth={2}
            fill="url(#scoreGrad)"
            dot={false}
            activeDot={{
              r: 5, fill: '#7C3AED',
              stroke: '#111118', strokeWidth: 2
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}