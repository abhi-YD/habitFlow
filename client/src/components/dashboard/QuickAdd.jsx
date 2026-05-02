import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Target, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import useHabitStore from '../../store/habitStore';
import useTaskStore from '../../store/taskStore';

export default function QuickAdd({ onAdded }) {
  const [open, setOpen]   = useState(false);
  const [type, setType]   = useState('task'); // 'habit' | 'task'
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const { createHabit } = useHabitStore();
  const { createTask }  = useTaskStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    setLoading(true);

    let result;
    if (type === 'habit') {
      result = await createHabit({ name: value, icon: '⭐' });
    } else {
      const today = new Date().toISOString().split('T')[0];
      result = await createTask({
        title: value,
        priority: 'medium',
        dueDate: today
      });
    }

    if (result.success) {
      toast.success(`${type === 'habit' ? 'Habit' : 'Task'} added!`);
      setValue('');
      setOpen(false);
      if (onAdded) onAdded();
    } else {
      toast.error('Something went wrong');
    }
    setLoading(false);
  };

  return (
    <>
      {/* FAB button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8
                   w-14 h-14 bg-violet-600 hover:bg-violet-500
                   rounded-2xl shadow-lg shadow-violet-600/30
                   flex items-center justify-center
                   text-white z-50 transition-colors"
      >
        <Plus size={24} />
      </motion.button>

      {/* modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60
                         backdrop-blur-sm z-50"
            />

            {/* modal card */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed bottom-0 left-0 right-0 md:relative
                         md:bottom-auto md:left-auto md:right-auto
                         md:top-1/2 md:left-1/2
                         md:-translate-x-1/2 md:-translate-y-1/2
                         md:fixed md:w-96
                         bg-[#111118] border border-[#1E1E2E]
                         rounded-t-3xl md:rounded-2xl
                         p-6 z-50 shadow-2xl"
            >
              {/* header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg">
                  Quick Add
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-xl bg-[#1E1E2E]
                             flex items-center justify-center
                             text-[#64748B] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* type toggle */}
              <div className="flex gap-2 mb-4 p-1
                              bg-[#0A0A0F] rounded-xl">
                {[
                  { val: 'task',  icon: CheckSquare, label: 'Task'  },
                  { val: 'habit', icon: Target,      label: 'Habit' },
                ].map(({ val, icon: Icon, label }) => (
                  <button
                    key={val}
                    onClick={() => setType(val)}
                    className={`flex-1 flex items-center justify-center
                                gap-2 py-2.5 rounded-lg text-sm font-medium
                                transition-all
                                ${type === val
                                  ? 'bg-violet-600 text-white'
                                  : 'text-[#64748B] hover:text-white'}`}
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                ))}
              </div>

              {/* input */}
              <form onSubmit={handleSubmit}>
                <input
                  autoFocus
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={type === 'habit'
                    ? 'e.g. Meditate, Read, Exercise...'
                    : 'e.g. Review project plan...'}
                  className="w-full bg-[#0A0A0F] border border-[#1E1E2E]
                             text-white placeholder-[#64748B]
                             rounded-xl px-4 py-3.5 mb-4
                             focus:outline-none focus:border-violet-500
                             focus:ring-1 focus:ring-violet-500"
                />

                <motion.button
                  type="submit"
                  disabled={loading || !value.trim()}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-violet-600 hover:bg-violet-500
                             disabled:opacity-40 disabled:cursor-not-allowed
                             text-white font-semibold rounded-xl py-3
                             transition-all"
                >
                  {loading ? 'Adding...' : `Add ${type}`}
                </motion.button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}