import { motion } from 'framer-motion';

export default function ScoreRing({ score = 0, size = 120 }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return '#06FFA5';
    if (score >= 50) return '#7C3AED';
    return '#F59E0B';
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* background ring */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="#1E1E2E"
            strokeWidth="8"
          />
          {/* progress ring */}
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{
              filter: `drop-shadow(0 0 6px ${getColor()}80)`
            }}
          />
        </svg>

        {/* center text */}
        <div className="absolute inset-0 flex flex-col
                        items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold text-white"
          >
            {score}%
          </motion.span>
          <span className="text-[#64748B] text-xs">today</span>
        </div>
      </div>
    </div>
  );
}