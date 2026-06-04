// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X, Clock } from 'lucide-react';
// import toast from 'react-hot-toast';
// import useHabitStore from '../../store/habitStore';

// const ICONS = ['⭐','🧘','📚','💧','🏃','💪','🥗','😴','✍️',
//                '🎯','🎨','🎵','🧹','💊','🌿','☀️','🧠','❤️'];

// const COLORS = ['#7C3AED','#06FFA5','#F59E0B','#EF4444','#3B82F6',
//                 '#EC4899','#10B981','#F97316','#8B5CF6','#06B6D4'];

// const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// const defaultForm = {
//   name:         '',
//   icon:         '⭐',
//   color:        '#7C3AED',
//   frequency:    'daily',
//   customDays:   [],
//   reminderTime: '',
//   weeklyTarget: 7,
//   dailyTarget:  1,
// };

// export default function HabitForm({ open, onClose, editHabit = null }) {
//   const { createHabit, updateHabit } = useHabitStore();
//   const [form, setForm]       = useState(defaultForm);
//   const [loading, setLoading] = useState(false);

//   // populate form if editing
//   useEffect(() => {
//     if (editHabit) {
//       setForm({
//         name:         editHabit.name         || '',
//         icon:         editHabit.icon         || '⭐',
//         color:        editHabit.color        || '#7C3AED',
//         frequency:    editHabit.frequency    || 'daily',
//         customDays:   editHabit.customDays   || [],
//         reminderTime: editHabit.reminderTime || '',
//         weeklyTarget: editHabit.weeklyTarget || 7,
//         dailyTarget:  editHabit.dailyTarget  || 1,
//       });
//     } else {
//       setForm(defaultForm);
//     }
//   }, [editHabit, open]);

//   const toggleDay = (i) => {
//     setForm((f) => ({
//       ...f,
//       customDays: f.customDays.includes(i)
//         ? f.customDays.filter((d) => d !== i)
//         : [...f.customDays, i]
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.name.trim()) {
//       toast.error('Habit name is required');
//       return;
//     }
//     setLoading(true);

//     const result = editHabit
//       ? await updateHabit(editHabit._id, form)
//       : await createHabit(form);

//     if (result.success) {
//       toast.success(editHabit ? 'Habit updated!' : '🎯 Habit created!');
//       onClose();
//     } else {
//       toast.error('Something went wrong');
//     }
//     setLoading(false);
//   };

//   return (
//     <AnimatePresence>
//       {open && (
//         <>
//           {/* backdrop */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//             className="fixed inset-0 bg-black/60
//                        backdrop-blur-sm z-50"
//           />

//           {/* modal */}
// <motion.div
//   drag
//   dragMomentum={false}
//   dragElastic={0}
//   dragConstraints={{
//     top: -180,
//     left: -350,
//     right: 350,
//     bottom: 180
//   }}
//   initial={{ opacity: 0, scale: 0.95 }}
//   animate={{ opacity: 1, scale: 1    }}
//   exit={{    opacity: 0, scale: 0.95 }}
//   transition={{ type: 'spring', damping: 25 }}
//   className="fixed top-1/2 left-1/2
//              -translate-x-1/2 -translate-y-1/2
//              w-[90vw] md:w-[480px]
//              bg-[#111118] border border-[#1E1E2E]
//              rounded-2xl z-50 shadow-2xl
//              flex flex-col"
//   style={{ height: '85vh', maxHeight: '640px' }}
// >
//   {/* ── DRAG HANDLE + HEADER (fixed, not scrollable) ── */}
//   <div className="flex-shrink-0 px-6 pt-4 pb-4
//                   border-b border-[#1E1E2E]
//                   cursor-grab active:cursor-grabbing">

//     {/* drag handle bar */}
//     <div className="flex justify-center mb-3">
//       <div className="w-10 h-1 bg-[#2E2E4E] rounded-full" />
//     </div>

//     <div className="flex items-center justify-between">
//       <h3 className="text-white font-bold text-xl">
//         {editHabit ? 'Edit Habit' : 'New Habit'}
//       </h3>
//       <button
//         onClick={onClose}
//         className="w-8 h-8 rounded-xl bg-[#1E1E2E]
//                    flex items-center justify-center
//                    text-[#64748B] hover:text-white"
//       >
//         <X size={16} />
//       </button>
//     </div>
//   </div>

//   {/* ── SCROLLABLE FORM CONTENT ── */}
//   <div className="flex-1 overflow-y-auto px-6 py-5
//                   scrollbar-thin scrollbar-track-[#0A0A0F]
//                   scrollbar-thumb-[#2E2E4E]">
//     <form onSubmit={handleSubmit} className="space-y-5">

//       {/* preview */}
//       <div className="flex items-center gap-3 p-4
//                       rounded-xl bg-[#0A0A0F]
//                       border border-[#1E1E2E]">
//         <div className="w-12 h-12 rounded-xl flex items-center
//                         justify-center text-2xl flex-shrink-0"
//           style={{
//             backgroundColor: `${form.color}20`,
//             border: `1px solid ${form.color}40`
//           }}>
//           {form.icon}
//         </div>
//         <div>
//           <p className="text-white font-medium">
//             {form.name || 'Habit name'}
//           </p>
//           <p className="text-[#64748B] text-xs capitalize">
//             {form.frequency} · target {form.weeklyTarget}x/week
//           </p>
//         </div>
//       </div>

//       {/* name */}
//       <div>
//         <label className="block text-sm font-medium
//                           text-[#94A3B8] mb-2">
//           Habit Name
//         </label>
//         <input
//           type="text"
//           value={form.name}
//           onChange={(e) =>
//             setForm({ ...form, name: e.target.value })}
//           placeholder="e.g. Meditate, Read, Exercise..."
//           className="w-full bg-[#0A0A0F] border border-[#1E1E2E]
//                      text-white placeholder-[#64748B]
//                      rounded-xl px-4 py-3
//                      focus:outline-none focus:border-violet-500
//                      focus:ring-1 focus:ring-violet-500"
//         />
//       </div>

//       {/* icon picker */}
//       <div>
//         <label className="block text-sm font-medium
//                           text-[#94A3B8] mb-2">
//           Icon
//         </label>
//         <div className="grid grid-cols-9 gap-2">
//           {ICONS.map((icon) => (
//             <button
//               key={icon}
//               type="button"
//               onClick={() => setForm({ ...form, icon })}
//               className={`w-9 h-9 rounded-lg text-lg
//                           flex items-center justify-center
//                           transition-all
//                           ${form.icon === icon
//                             ? 'bg-violet-600/30 ring-2 ring-violet-500'
//                             : 'bg-[#0A0A0F] hover:bg-[#1E1E2E]'}`}
//             >
//               {icon}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* color picker */}
//       <div>
//         <label className="block text-sm font-medium
//                           text-[#94A3B8] mb-2">
//           Color
//         </label>
//         <div className="flex gap-2 flex-wrap">
//           {COLORS.map((color) => (
//             <button
//               key={color}
//               type="button"
//               onClick={() => setForm({ ...form, color })}
//               className={`w-8 h-8 rounded-full transition-all
//                           ${form.color === color
//                             ? 'ring-2 ring-white ring-offset-2 ring-offset-[#111118] scale-110'
//                             : 'hover:scale-105'}`}
//               style={{ backgroundColor: color }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* frequency */}
//       <div>
//         <label className="block text-sm font-medium
//                           text-[#94A3B8] mb-2">
//           Frequency
//         </label>
//         <div className="grid grid-cols-3 gap-2">
//           {['daily','weekly','custom'].map((f) => (
//             <button
//               key={f}
//               type="button"
//               onClick={() => setForm({ ...form, frequency: f })}
//               className={`py-2 rounded-xl text-sm font-medium
//                           capitalize transition-all
//                           ${form.frequency === f
//                             ? 'bg-violet-600 text-white'
//                             : 'bg-[#0A0A0F] text-[#64748B] hover:text-white border border-[#1E1E2E]'}`}
//             >
//               {f}
//             </button>
//           ))}
//         </div>

//         {form.frequency === 'custom' && (
//           <div className="flex gap-2 mt-3 flex-wrap">
//             {DAYS.map((day, i) => (
//               <button
//                 key={day}
//                 type="button"
//                 onClick={() => toggleDay(i)}
//                 className={`w-10 h-10 rounded-xl text-xs
//                             font-medium transition-all
//                             ${form.customDays.includes(i)
//                               ? 'bg-violet-600 text-white'
//                               : 'bg-[#0A0A0F] text-[#64748B] border border-[#1E1E2E]'}`}
//               >
//                 {day}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* weekly target */}
//       <div>
//         <label className="block text-sm font-medium
//                           text-[#94A3B8] mb-2">
//           Weekly Target —{' '}
//           <span className="text-violet-400">
//             {form.weeklyTarget}x per week
//           </span>
//         </label>
//         <input
//           type="range" min="1" max="7"
//           value={form.weeklyTarget}
//           onChange={(e) => setForm({
//             ...form, weeklyTarget: Number(e.target.value)
//           })}
//           className="w-full accent-violet-600"
//         />
//         <div className="flex justify-between text-xs
//                         text-[#64748B] mt-1">
//           <span>1x</span>
//           <span>7x (daily)</span>
//         </div>
//       </div>

//       {/* daily target */}
//       <div>
//         <label className="block text-sm font-medium
//                           text-[#94A3B8] mb-2">
//           Daily Target —{' '}
//           <span className="text-violet-400">
//             {form.dailyTarget}x per day
//           </span>
//         </label>
//         <input
//           type="range" min="1" max="10"
//           value={form.dailyTarget}
//           onChange={(e) => setForm({
//             ...form, dailyTarget: Number(e.target.value)
//           })}
//           className="w-full accent-violet-600"
//         />
//         <div className="flex justify-between text-xs
//                         text-[#64748B] mt-1">
//           <span>1x</span>
//           <span>10x</span>
//         </div>
//       </div>

//       {/* reminder */}
//       <div>
//         <label className="block text-sm font-medium
//                           text-[#94A3B8] mb-2">
//           Reminder Time{' '}
//           <span className="text-[#64748B]">(optional)</span>
//         </label>
//         <div className="relative">
//           <Clock size={16}
//             className="absolute left-4 top-1/2
//                        -translate-y-1/2 text-[#64748B]" />
//           <input
//             type="time"
//             value={form.reminderTime}
//             onChange={(e) => setForm({
//               ...form, reminderTime: e.target.value
//             })}
//             className="w-full bg-[#0A0A0F] border border-[#1E1E2E]
//                        text-white rounded-xl pl-11 pr-4 py-3
//                        focus:outline-none focus:border-violet-500
//                        focus:ring-1 focus:ring-violet-500
//                        [color-scheme:dark]"
//           />
//         </div>
//       </div>

//       {/* submit */}
//       <motion.button
//         type="submit"
//         disabled={loading}
//         whileTap={{ scale: 0.98 }}
//         className="w-full bg-violet-600 hover:bg-violet-500
//                    disabled:opacity-50 text-white font-semibold
//                    rounded-xl py-3.5 transition-all
//                    shadow-lg shadow-violet-600/25 mb-2"
//       >
//         {loading
//           ? 'Saving...'
//           : editHabit ? 'Save Changes' : 'Create Habit'}
//       </motion.button>

//     </form>
//   </div>
// </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }


import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import useHabitStore from '../../store/habitStore';

import usePlanStore from '../../store/planStore';

const ICONS = ['⭐','🧘','📚','💧','🏃','💪','🥗','😴','✍️',
               '🎯','🎨','🎵','🧹','💊','🌿','☀️','🧠','❤️'];

const COLORS = ['#7C3AED','#06FFA5','#F59E0B','#EF4444','#3B82F6',
                '#EC4899','#10B981','#F97316','#8B5CF6','#06B6D4'];

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const defaultForm = {
  name:         '',
  icon:         '⭐',
  color:        '#7C3AED',
  frequency:    'daily',
  customDays:   [],
  reminderTime: '',
  weeklyTarget: 7,
  dailyTarget:  1,
};

export default function HabitForm({ open, onClose, editHabit = null }) {
  const { createHabit, updateHabit } = useHabitStore();
  const [form, setForm]       = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editHabit) {
      setForm({
        name:         editHabit.name         || '',
        icon:         editHabit.icon         || '⭐',
        color:        editHabit.color        || '#7C3AED',
        frequency:    editHabit.frequency    || 'daily',
        customDays:   editHabit.customDays   || [],
        reminderTime: editHabit.reminderTime || '',
        weeklyTarget: editHabit.weeklyTarget || 7,
        dailyTarget:  editHabit.dailyTarget  || 1,
      });
    } else {
      setForm(defaultForm);
    }
  }, [editHabit, open]);

  const toggleDay = (i) => {
    setForm((f) => ({
      ...f,
      customDays: f.customDays.includes(i)
        ? f.customDays.filter((d) => d !== i)
        : [...f.customDays, i]
    }));
  };
  // updated
  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error('Habit name is required');
      return;
    }
    setLoading(true);

    const result = editHabit
      ? await updateHabit(editHabit._id, form)
      : await createHabit(form);

    if (result.success) {
      toast.success(editHabit ? 'Habit updated!' : '🎯 Habit created!');
      onClose();
    } else if (result.code === 'HABIT_LIMIT_REACHED') {
      // ✅ close form, open upgrade modal
      onClose();
      usePlanStore.getState().openUpgradeModal(
        'You\'ve reached the 5 habit limit on Free plan'
      );
    } else {
      toast.error(result.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60
                       backdrop-blur-sm z-50"
          />

          {/* modal */}
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={{
              top:    -180,
              left:   -350,
              right:   350,
              bottom:  180
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1    }}
            exit={{    opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-1/2 left-1/2
                       -translate-x-1/2 -translate-y-1/2
                       w-[90vw] md:w-[480px]
                       bg-[#111118] border border-[#1E1E2E]
                       rounded-2xl z-50 shadow-2xl
                       flex flex-col"
            style={{ height: '85vh', maxHeight: '640px' }}
          >

            {/* ── FIXED HEADER + DRAG HANDLE ── */}
            <div className="flex-shrink-0 px-6 pt-4 pb-4
                            border-b border-[#1E1E2E]
                            cursor-grab active:cursor-grabbing
                            rounded-t-2xl">
              {/* drag bar */}
              <div className="flex justify-center mb-3">
                <div className="w-10 h-1 bg-[#2E2E4E] rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-xl">
                  {editHabit ? 'Edit Habit' : 'New Habit'}
                </h3>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl bg-[#1E1E2E]
                             flex items-center justify-center
                             text-[#64748B] hover:text-white
                             transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* ── SCROLLABLE CONTENT ── */}
            <div className="flex-1 overflow-y-auto px-6 py-5
                            scrollbar-thin scrollbar-track-[#0A0A0F]
                            scrollbar-thumb-[#2E2E4E]">
              <div className="space-y-5">

                {/* preview */}
                <div className="flex items-center gap-3 p-4
                                rounded-xl bg-[#0A0A0F]
                                border border-[#1E1E2E]">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center
                                justify-center text-2xl flex-shrink-0"
                    style={{
                      backgroundColor: `${form.color}20`,
                      border: `1px solid ${form.color}40`
                    }}
                  >
                    {form.icon}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {form.name || 'Habit name'}
                    </p>
                    <p className="text-[#64748B] text-xs capitalize">
                      {form.frequency} · target {form.weeklyTarget}x/week
                    </p>
                  </div>
                </div>

                {/* name */}
                <div>
                  <label className="block text-sm font-medium
                                    text-[#94A3B8] mb-2">
                    Habit Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Meditate, Read, Exercise..."
                    className="w-full bg-[#0A0A0F] border border-[#1E1E2E]
                               text-white placeholder-[#64748B]
                               rounded-xl px-4 py-3 focus:outline-none
                               focus:border-violet-500
                               focus:ring-1 focus:ring-violet-500"
                  />
                </div>

                {/* icon picker */}
                <div>
                  <label className="block text-sm font-medium
                                    text-[#94A3B8] mb-2">
                    Icon
                  </label>
                  <div className="grid grid-cols-9 gap-2">
                    {ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setForm({ ...form, icon })}
                        className={`w-9 h-9 rounded-lg text-lg
                                    flex items-center justify-center
                                    transition-all
                                    ${form.icon === icon
                                      ? 'bg-violet-600/30 ring-2 ring-violet-500'
                                      : 'bg-[#0A0A0F] hover:bg-[#1E1E2E]'}`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* color picker */}
                <div>
                  <label className="block text-sm font-medium
                                    text-[#94A3B8] mb-2">
                    Color
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setForm({ ...form, color })}
                        className={`w-8 h-8 rounded-full transition-all
                                    ${form.color === color
                                      ? 'ring-2 ring-white ring-offset-2 ring-offset-[#111118] scale-110'
                                      : 'hover:scale-105'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* frequency */}
                <div>
                  <label className="block text-sm font-medium
                                    text-[#94A3B8] mb-2">
                    Frequency
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['daily', 'weekly', 'custom'].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setForm({ ...form, frequency: f })}
                        className={`py-2 rounded-xl text-sm font-medium
                                    capitalize transition-all
                                    ${form.frequency === f
                                      ? 'bg-violet-600 text-white'
                                      : 'bg-[#0A0A0F] text-[#64748B] hover:text-white border border-[#1E1E2E]'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  {/* custom days */}
                  {form.frequency === 'custom' && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {DAYS.map((day, i) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(i)}
                          className={`w-10 h-10 rounded-xl text-xs
                                      font-medium transition-all
                                      ${form.customDays.includes(i)
                                        ? 'bg-violet-600 text-white'
                                        : 'bg-[#0A0A0F] text-[#64748B] border border-[#1E1E2E]'}`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* weekly target */}
                <div>
                  <label className="block text-sm font-medium
                                    text-[#94A3B8] mb-2">
                    Weekly Target —{' '}
                    <span className="text-violet-400">
                      {form.weeklyTarget}x per week
                    </span>
                  </label>
                  <input
                    type="range" min="1" max="7"
                    value={form.weeklyTarget}
                    onChange={(e) => setForm({
                      ...form, weeklyTarget: Number(e.target.value)
                    })}
                    className="w-full accent-violet-600"
                  />
                  <div className="flex justify-between text-xs
                                  text-[#64748B] mt-1">
                    <span>1x</span>
                    <span>7x (daily)</span>
                  </div>
                </div>

                {/* daily target */}
                <div>
                  <label className="block text-sm font-medium
                                    text-[#94A3B8] mb-2">
                    Daily Target —{' '}
                    <span className="text-violet-400">
                      {form.dailyTarget}x per day
                    </span>
                  </label>
                  <input
                    type="range" min="1" max="10"
                    value={form.dailyTarget}
                    onChange={(e) => setForm({
                      ...form, dailyTarget: Number(e.target.value)
                    })}
                    className="w-full accent-violet-600"
                  />
                  <div className="flex justify-between text-xs
                                  text-[#64748B] mt-1">
                    <span>1x</span>
                    <span>10x</span>
                  </div>
                </div>

                {/* reminder time */}
                <div>
                  <label className="block text-sm font-medium
                                    text-[#94A3B8] mb-2">
                    Reminder Time{' '}
                    <span className="text-[#64748B]">(optional)</span>
                  </label>
                  <div className="relative">
                    <Clock size={16}
                      className="absolute left-4 top-1/2
                                 -translate-y-1/2 text-[#64748B]" />
                    <input
                      type="time"
                      value={form.reminderTime}
                      onChange={(e) => setForm({
                        ...form, reminderTime: e.target.value
                      })}
                      className="w-full bg-[#0A0A0F] border border-[#1E1E2E]
                                 text-white rounded-xl pl-11 pr-4 py-3
                                 focus:outline-none focus:border-violet-500
                                 focus:ring-1 focus:ring-violet-500
                                 [color-scheme:dark]"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* ── FIXED FOOTER — ALWAYS VISIBLE ── */}
            <div className="flex-shrink-0 px-6 py-4
                            border-t border-[#1E1E2E]
                            bg-[#111118] rounded-b-2xl">
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-violet-600 hover:bg-violet-500
                           disabled:opacity-50 disabled:cursor-not-allowed
                           text-white font-semibold rounded-xl py-3.5
                           transition-all shadow-lg shadow-violet-600/25"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4"
                      fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12"
                        r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Saving...
                  </span>
                ) : editHabit ? 'Save Changes' : 'Create Habit'}
              </motion.button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}