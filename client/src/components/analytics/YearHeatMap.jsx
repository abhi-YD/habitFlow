// import { motion } from 'framer-motion';
// import { useState } from 'react';

// const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun',
//                 'Jul','Aug','Sep','Oct','Nov','Dec'];
// const DAYS   = ['S','M','T','W','T','F','S'];

// export default function YearHeatmap({ data = {} }) {
//   const [tooltip, setTooltip] = useState(null);

//   // build 365 days
//   const today  = new Date();
//   const cells  = [];
//   for (let i = 364; i >= 0; i--) {
//     const d    = new Date(today);
//     d.setDate(today.getDate() - i);
//     const date = d.toISOString().split('T')[0];
//     cells.push({ date, count: data[date] || 0, dow: d.getDay() });
//   }

//   // group into weeks
//   const weeks = [];
//   let   week  = [];
//   // pad start
//   const firstDow = cells[0].dow;
//   for (let i = 0; i < firstDow; i++) week.push(null);
//   cells.forEach((cell) => {
//     week.push(cell);
//     if (week.length === 7) { weeks.push(week); week = []; }
//   });
//   if (week.length) {
//     while (week.length < 7) week.push(null);
//     weeks.push(week);
//   }

//   const getColor = (count) => {
//     if (!count) return 'bg-[#1E1E2E]';
//     if (count === 1) return 'bg-violet-900/70';
//     if (count <= 3)  return 'bg-violet-600/70';
//     if (count <= 6)  return 'bg-violet-500';
//     return                  'bg-[#06FFA5]';
//   };

//   // month labels
//   const monthLabels = [];
//   let lastMonth = -1;
//   weeks.forEach((week, wi) => {
//     const firstReal = week.find((c) => c);
//     if (firstReal) {
//       const m = new Date(firstReal.date).getMonth();
//       if (m !== lastMonth) {
//         monthLabels.push({ wi, label: MONTHS[m] });
//         lastMonth = m;
//       }
//     }
//   });

//   const totalDays = cells.filter((c) => c.count > 0).length;
//   const maxCount  = Math.max(...cells.map((c) => c.count), 1);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0  }}
//       transition={{ delay: 0.25 }}
//       className="bg-[#111118] border border-[#1E1E2E]
//                  rounded-2xl p-5"
//     >
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h3 className="text-white font-bold">Year Overview</h3>
//           <p className="text-[#64748B] text-xs mt-0.5">
//             {totalDays} active days in the last year
//           </p>
//         </div>
//         <span className="text-2xl">🗓️</span>
//       </div>

//       <div className="overflow-x-auto pb-2">
//         <div className="min-w-[600px]">
//           {/* month labels */}
//           <div className="flex mb-1 ml-7">
//             {monthLabels.map(({ wi, label }) => (
//               <div
//                 key={`${wi}-${label}`}
//                 className="text-[#64748B] text-xs"
//                 style={{ marginLeft: `${wi === 0 ? 0 : 0}px`,
//                          width: '52px', flexShrink: 0 }}
//               >
//                 {label}
//               </div>
//             ))}
//           </div>

//           <div className="flex gap-1">
//             {/* day labels */}
//             <div className="flex flex-col gap-1 mr-1">
//               {DAYS.map((d, i) => (
//                 <div key={i}
//                   className="w-5 h-3 text-[#64748B] text-[9px]
//                              flex items-center justify-end pr-1">
//                   {i % 2 === 1 ? d : ''}
//                 </div>
//               ))}
//             </div>

//             {/* grid */}
//             {weeks.map((week, wi) => (
//               <div key={wi} className="flex flex-col gap-1">
//                 {week.map((cell, di) => (
//                   <div
//                     key={di}
//                     className={`w-3 h-3 rounded-sm transition-all
//                                 cursor-pointer
//                                 ${cell
//                                   ? getColor(cell.count)
//                                   : 'bg-transparent'}`}
//                     title={cell
//                       ? `${cell.date}: ${cell.count} habits`
//                       : ''}
//                     onMouseEnter={() => cell && setTooltip(cell)}
//                     onMouseLeave={() => setTooltip(null)}
//                   />
//                 ))}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* legend */}
//       <div className="flex items-center gap-2 mt-3
//                       pt-3 border-t border-[#1E1E2E]">
//         <span className="text-[#64748B] text-xs">Less</span>
//         {[
//           'bg-[#1E1E2E]',
//           'bg-violet-900/70',
//           'bg-violet-600/70',
//           'bg-violet-500',
//           'bg-[#06FFA5]'
//         ].map((c, i) => (
//           <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
//         ))}
//         <span className="text-[#64748B] text-xs">More</span>
//         <span className="text-[#64748B] text-xs ml-auto">
//           Max {maxCount} habits/day
//         </span>
//       </div>

//       {/* tooltip */}
//       {tooltip && (
//         <div className="fixed z-50 bg-[#111118] border
//                         border-[#1E1E2E] rounded-xl px-3 py-2
//                         text-xs text-white shadow-xl
//                         pointer-events-none"
//           style={{ bottom: '20px', right: '20px' }}>
//           <p className="text-[#64748B]">{tooltip.date}</p>
//           <p className="font-bold">{tooltip.count} habits completed</p>
//         </div>
//       )}
//     </motion.div>
//   );
// }

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef }        from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun',
                      'Jul','Aug','Sep','Oct','Nov','Dec'];

const getColor = (count) => {
  if (!count) return 'bg-[#1E1E2E]';
  if (count === 1) return 'bg-violet-900/70';
  if (count <= 3)  return 'bg-violet-600/70';
  if (count <= 6)  return 'bg-violet-500';
  return                  'bg-[#06FFA5]';
};

// build calendar grid for a given month/year
const buildMonthGrid = (year, month) => {
  const firstDay  = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  // empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    cells.push(null);
  }
  // actual days
  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    cells.push({ date, day: d });
  }
  // pad to complete last week
  while (cells.length % 7 !== 0) cells.push(null);

  // split into weeks
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
};

export default function MonthHeatmap({ data = {} }) {
  const today    = new Date();
  const [year,   setYear]   = useState(today.getFullYear());
  const [month,  setMonth]  = useState(today.getMonth());
  const [tooltip, setTooltip] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [direction, setDirection]   = useState(1); // 1=forward -1=back
  const dragStartX = useRef(null);

  const weeks    = buildMonthGrid(year, month);
  const todayStr = today.toISOString().split('T')[0];

  // month stats
  const monthDays = weeks.flat().filter(Boolean);
  const activeDays   = monthDays.filter((c) => data[c.date] > 0).length;
  const totalHabits  = monthDays.reduce((s, c) => s + (data[c.date] || 0), 0);
  const bestDay      = monthDays.reduce((best, c) =>
    (data[c.date] || 0) > (data[best?.date] || 0) ? c : best, null);

  // navigation
  const goBack = () => {
    setDirection(-1);
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const goForward = () => {
    setDirection(1);
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const goToToday = () => {
    setDirection(1);
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  };

  const isCurrentMonth = year === today.getFullYear() &&
                         month === today.getMonth();
  const isFuture = new Date(year, month) > new Date(today.getFullYear(), today.getMonth());

  // swipe handlers
  const handleDragStart = (e) => {
    dragStartX.current = e.touches?.[0]?.clientX ?? e.clientX;
  };

  const handleDragEnd = (e) => {
    const endX = e.changedTouches?.[0]?.clientX ?? e.clientX;
    const diff  = dragStartX.current - endX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goForward() : goBack();
    }
    dragStartX.current = null;
  };

  // year picker
  const availableYears = Array.from(
    { length: 5 },
    (_, i) => today.getFullYear() - 4 + i
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ delay: 0.25 }}
      className="bg-[#111118] border border-[#1E1E2E]
                 rounded-2xl p-5"
    >
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white font-bold">Monthly Overview</h3>
          <p className="text-[#64748B] text-xs mt-0.5">
            {activeDays} active days · {totalHabits} total completions
          </p>
        </div>

        {/* today button */}
        {!isCurrentMonth && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={goToToday}
            className="text-xs text-violet-400 hover:text-violet-300
                       bg-violet-600/10 border border-violet-500/20
                       px-3 py-1.5 rounded-lg transition-all mr-2"
          >
            Today
          </motion.button>
        )}

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowPicker(!showPicker)}
          className="w-9 h-9 rounded-xl bg-[#0A0A0F]
                     border border-[#1E1E2E]
                     flex items-center justify-center
                     text-[#64748B] hover:text-violet-400
                     hover:border-violet-500/40 transition-all"
          title="Pick month/year"
        >
          <CalendarDays size={16} />
        </motion.button>
      </div>

      {/* ── YEAR/MONTH PICKER ── */}
      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{    opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="bg-[#0A0A0F] border border-[#1E1E2E]
                            rounded-xl p-4">
              {/* year selector */}
              <p className="text-[#64748B] text-xs font-semibold
                             uppercase tracking-wider mb-3">
                Year
              </p>
              <div className="flex gap-2 flex-wrap mb-4">
                {availableYears.map((y) => (
                  <button
                    key={y}
                    onClick={() => { setYear(y); setShowPicker(false); }}
                    className={`px-3 py-1.5 rounded-lg text-sm
                                font-medium transition-all
                                ${year === y
                                  ? 'bg-violet-600 text-white'
                                  : 'bg-[#1E1E2E] text-[#64748B] hover:text-white'}`}
                  >
                    {y}
                  </button>
                ))}
              </div>

              {/* month selector */}
              <p className="text-[#64748B] text-xs font-semibold
                             uppercase tracking-wider mb-3">
                Month
              </p>
              <div className="grid grid-cols-4 gap-2">
                {SHORT_MONTHS.map((m, i) => (
                  <button
                    key={m}
                    onClick={() => { setMonth(i); setShowPicker(false); }}
                    className={`py-1.5 rounded-lg text-xs
                                font-medium transition-all
                                ${month === i
                                  ? 'bg-violet-600 text-white'
                                  : 'bg-[#1E1E2E] text-[#64748B] hover:text-white'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MONTH NAVIGATION ── */}
      <div className="flex items-center justify-between mb-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={goBack}
          className="w-8 h-8 rounded-xl bg-[#0A0A0F]
                     border border-[#1E1E2E]
                     flex items-center justify-center
                     text-[#64748B] hover:text-white
                     transition-all"
        >
          <ChevronLeft size={16} />
        </motion.button>

        <motion.h4
          key={`${year}-${month}`}
          initial={{ opacity: 0, y: direction > 0 ? -10 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white font-bold text-lg"
        >
          {MONTHS[month]} {year}
        </motion.h4>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={goForward}
          disabled={isFuture}
          className="w-8 h-8 rounded-xl bg-[#0A0A0F]
                     border border-[#1E1E2E]
                     flex items-center justify-center
                     text-[#64748B] hover:text-white
                     disabled:opacity-30 transition-all"
        >
          <ChevronRight size={16} />
        </motion.button>
      </div>

      {/* ── SWIPEABLE CALENDAR GRID ── */}
      <div
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
        className="select-none cursor-grab active:cursor-grabbing"
      >
        {/* day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((d) => (
            <div key={d}
              className="text-center text-[#64748B] text-[10px]
                        font-medium py-1">
              {d}
            </div>
          ))}
        </div>

        {/* calendar cells */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${year}-${month}`}
            initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{    opacity: 0, x: direction > 0 ? -30 : 30 }}
            transition={{ duration: 0.2 }}
            className="space-y-1"
          >
            {weeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-1">
                {week.map((cell, di) => {
                  if (!cell) {
                    return (
                      <div key={di}
                        className="h-8 rounded-md" />
                    );
                  }

                  const count     = data[cell.date] || 0;
                  const isToday   = cell.date === todayStr;
                  const isFutureD = cell.date > todayStr;
                  const isBest    = bestDay?.date === cell.date && count > 0;

                  return (
                    <motion.div
                      key={cell.date}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onMouseEnter={() => setTooltip(cell)}
                      onMouseLeave={() => setTooltip(null)}
                      className={`h-8 rounded-md
                                  flex items-center justify-center
                                  relative transition-all cursor-pointer
                                  ${isFutureD
                                    ? 'opacity-25 bg-[#1E1E2E]'
                                    : getColor(count)}
                                  ${isToday
                                    ? 'ring-2 ring-violet-400 ring-offset-1 ring-offset-[#111118]'
                                    : ''}
                                  ${isBest && !isToday
                                    ? 'ring-1 ring-[#06FFA5]/60'
                                    : ''}`}
                    >
                      <span className={`text-[11px] font-medium
                        ${count > 0
                          ? 'text-white'
                          : isToday
                          ? 'text-violet-300'
                          : 'text-[#64748B]'}`}>
                        {cell.day}
                      </span>

                      {/* completion dot */}
                      {count > 0 && (
                        <div className="absolute bottom-0.5 right-0.5
                                        w-1 h-1 rounded-full bg-white/40" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── MONTH STATS ── */}
      <div className="grid grid-cols-3 gap-3 mt-4
                      pt-4 border-t border-[#1E1E2E]">
        <div className="text-center">
          <p className="text-white font-bold text-lg">{activeDays}</p>
          <p className="text-[#64748B] text-xs">Active Days</p>
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-lg">{totalHabits}</p>
          <p className="text-[#64748B] text-xs">Completions</p>
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-lg">
            {bestDay ? `${data[bestDay.date]}` : '—'}
          </p>
          <p className="text-[#64748B] text-xs">Best Day</p>
        </div>
      </div>

      {/* ── LEGEND ── */}
      <div className="flex items-center gap-2 mt-3">
        <span className="text-[#64748B] text-xs">Less</span>
        {[
          'bg-[#1E1E2E]',
          'bg-violet-900/70',
          'bg-violet-600/70',
          'bg-violet-500',
          'bg-[#06FFA5]'
        ].map((c, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
        ))}
        <span className="text-[#64748B] text-xs">More</span>
      </div>

      {/* ── TOOLTIP ── */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: 5 }}
            className="fixed z-50 bg-[#111118] border
                       border-[#1E1E2E] rounded-xl px-3 py-2
                       text-xs text-white shadow-xl
                       pointer-events-none bottom-5 right-5"
          >
            <p className="text-[#64748B] mb-1">{tooltip.date}</p>
            {data[tooltip.date] > 0 ? (
              <p className="font-bold text-[#06FFA5]">
                ✅ {data[tooltip.date]} habits completed
              </p>
            ) : (
              <p className="text-[#64748B]">No habits logged</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

