import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Link } from 'lucide-react';
import toast from 'react-hot-toast';
import useTaskStore from '../../store/taskStore';
import useHabitStore from '../../store/habitStore';

const defaultForm = {
  title:         '',
  priority:      'medium',
  dueDate:       '',
  linkedHabitId: null,
};

export default function TaskForm({ open, onClose, editTask = null }) {
  const { createTask, updateTask } = useTaskStore();
  const { habits }                 = useHabitStore();
  const [form, setForm]            = useState(defaultForm);
  const [loading, setLoading]      = useState(false);

  useEffect(() => {
    if (editTask) {
      setForm({
        title:         editTask.title         || '',
        priority:      editTask.priority      || 'medium',
        dueDate:       editTask.dueDate       || '',
        linkedHabitId: editTask.linkedHabitId || null,
      });
    } else {
      // default due date = today
      const today = new Date().toISOString().split('T')[0];
      setForm({ ...defaultForm, dueDate: today });
    }
  }, [editTask, open]);

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error('Task title is required');
      return;
    }
    setLoading(true);

    const result = editTask
      ? await updateTask(editTask._id, form)
      : await createTask(form);

    if (result.success) {
      toast.success(editTask ? 'Task updated!' : '✅ Task created!');
      onClose();
    } else {
      toast.error('Something went wrong');
    }
    setLoading(false);
  };

  const priorities = [
    { value: 'high',   label: 'High',   color: 'text-red-400',
      bg: 'bg-red-500/20',   border: 'border-red-500/40'   },
    { value: 'medium', label: 'Medium', color: 'text-amber-400',
      bg: 'bg-amber-500/20', border: 'border-amber-500/40' },
    { value: 'low',    label: 'Low',    color: 'text-blue-400',
      bg: 'bg-blue-500/20',  border: 'border-blue-500/40'  },
  ];

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
              top: -200, left: -350,
              right: 350, bottom: 200
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1    }}
            exit={{    opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-1/2 left-1/2
                       -translate-x-1/2 -translate-y-1/2
                       w-[90vw] md:w-[440px]
                       bg-[#111118] border border-[#1E1E2E]
                       rounded-2xl z-50 shadow-2xl flex flex-col"
            style={{ maxHeight: '90vh' }}
          >

            {/* header */}
            <div className="flex-shrink-0 px-6 pt-4 pb-4
                            border-b border-[#1E1E2E]
                            cursor-grab active:cursor-grabbing
                            rounded-t-2xl">
              <div className="flex justify-center mb-3">
                <div className="w-10 h-1 bg-[#2E2E4E] rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-xl">
                  {editTask ? 'Edit Task' : 'New Task'}
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

            {/* scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="space-y-5">

                {/* title */}
                <div>
                  <label className="block text-sm font-medium
                                    text-[#94A3B8] mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Review project plan..."
                    className="w-full bg-[#0A0A0F] border border-[#1E1E2E]
                               text-white placeholder-[#64748B]
                               rounded-xl px-4 py-3 focus:outline-none
                               focus:border-violet-500
                               focus:ring-1 focus:ring-violet-500"
                  />
                </div>

                {/* priority */}
                <div>
                  <label className="block text-sm font-medium
                                    text-[#94A3B8] mb-2">
                    Priority
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {priorities.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() =>
                          setForm({ ...form, priority: p.value })}
                        className={`py-2.5 rounded-xl text-sm
                                    font-medium transition-all border
                                    ${form.priority === p.value
                                      ? `${p.bg} ${p.color} ${p.border}`
                                      : 'bg-[#0A0A0F] text-[#64748B] border-[#1E1E2E] hover:text-white'}`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* due date */}
                <div>
                  <label className="block text-sm font-medium
                                    text-[#94A3B8] mb-2">
                    Due Date
                  </label>
                  <div className="relative">
                    <Calendar size={16}
                      className="absolute left-4 top-1/2
                                 -translate-y-1/2 text-[#64748B]" />
                    <input
                      type="date"
                      value={form.dueDate}
                      onChange={(e) =>
                        setForm({ ...form, dueDate: e.target.value })}
                      className="w-full bg-[#0A0A0F] border border-[#1E1E2E]
                                 text-white rounded-xl pl-11 pr-4 py-3
                                 focus:outline-none focus:border-violet-500
                                 focus:ring-1 focus:ring-violet-500
                                 [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* link to habit (optional) */}
                {habits.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium
                                      text-[#94A3B8] mb-2">
                      Link to Habit{' '}
                      <span className="text-[#64748B]">(optional)</span>
                    </label>
                    <div className="relative">
                      <Link size={16}
                        className="absolute left-4 top-1/2
                                   -translate-y-1/2 text-[#64748B]" />
                      <select
                        value={form.linkedHabitId || ''}
                        onChange={(e) => setForm({
                          ...form,
                          linkedHabitId: e.target.value || null
                        })}
                        className="w-full bg-[#0A0A0F] border border-[#1E1E2E]
                                   text-white rounded-xl pl-11 pr-4 py-3
                                   focus:outline-none focus:border-violet-500
                                   focus:ring-1 focus:ring-violet-500
                                   appearance-none"
                      >
                        <option value="">No linked habit</option>
                        {habits.map((h) => (
                          <option key={h._id} value={h._id}>
                            {h.icon} {h.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* fixed footer */}
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
                ) : editTask ? 'Save Changes' : 'Create Task'}
              </motion.button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}