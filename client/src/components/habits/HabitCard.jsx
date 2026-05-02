import { motion } from 'framer-motion';
import { Flame, Edit2, Trash2, Clock } from 'lucide-react';

export default function HabitCard({ habit, streak = 0,
                                    completionRate = 0,
                                    onEdit, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1  }}
      exit={{    opacity: 0, scale: 0.95 }}
      className="bg-[#111118] border border-[#1E1E2E]
                 rounded-2xl p-5 flex flex-col gap-4
                 hover:border-[#2E2E4E] transition-all group"
    >
      {/* top row */}
      <div className="flex items-start justify-between">

        {/* icon + name */}
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center
                       justify-center text-2xl flex-shrink-0"
            style={{
              backgroundColor: `${habit.color}20`,
              border: `1px solid ${habit.color}40`
            }}
          >
            {habit.icon}
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">
              {habit.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[#64748B] text-xs capitalize">
                {habit.frequency}
              </span>
              {habit.reminderTime && (
                <span className="flex items-center gap-1
                                 text-[#64748B] text-xs">
                  <Clock size={10} />
                  {habit.reminderTime}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* actions — show on hover */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100
                        transition-opacity">
          <button
            onClick={onEdit}
            className="w-7 h-7 rounded-lg bg-[#1E1E2E]
                       flex items-center justify-center
                       text-[#64748B] hover:text-white
                       transition-colors"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={onDelete}
            className="w-7 h-7 rounded-lg bg-[#1E1E2E]
                       flex items-center justify-center
                       text-[#64748B] hover:text-red-400
                       transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* completion progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[#64748B] text-xs">
            Completion rate
          </span>
          <span className="text-white text-xs font-semibold">
            {completionRate}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#1E1E2E]
                        rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: habit.color }}
          />
        </div>
      </div>

      {/* bottom stats */}
      <div className="flex items-center justify-between
                      pt-3 border-t border-[#1E1E2E]">

        {/* streak */}
        <div className="flex items-center gap-1.5">
          <span className="text-base">🔥</span>
          <span className="text-white text-sm font-bold">
            {streak}
          </span>
          <span className="text-[#64748B] text-xs">
            day streak
          </span>
        </div>

        {/* weekly target */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 7 }, (_, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: i < habit.weeklyTarget
                  ? `${habit.color}60`
                  : '#1E1E2E'
              }}
            />
          ))}
          <span className="text-[#64748B] text-xs ml-1">
            {habit.weeklyTarget}x/wk
          </span>
        </div>
      </div>
    </motion.div>
  );
}