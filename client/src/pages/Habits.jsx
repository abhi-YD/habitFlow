import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Target } from 'lucide-react';
import toast from 'react-hot-toast';

import useHabitStore from '../store/habitStore';
import HabitCard     from '../components/habits/HabitCard';
import HabitForm     from '../components/habits/HabitForm';

const FILTERS = ['all', 'daily', 'weekly', 'custom'];

export default function Habits() {
  const { habits, fetchHabits,
          deleteHabit, fetchHabitLogs,
          streaks } = useHabitStore();

  const [formOpen,    setFormOpen]    = useState(false);
  const [editHabit,   setEditHabit]   = useState(null);
  const [search,      setSearch]      = useState('');
  const [filter,      setFilter]      = useState('all');
  const [rates,       setRates]       = useState({});
  const [isLoading,   setIsLoading]   = useState(true);

  // load habits + their logs
  const loadData = async () => {
    setIsLoading(true);
    await fetchHabits();
    setIsLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  // fetch streaks + completion rates per habit
  useEffect(() => {
    if (!habits.length) return;
    habits.forEach(async (h) => {
      const data = await fetchHabitLogs(h._id);
      if (data?.logs) {
        const total     = data.logs.length;
        const completed = data.logs.filter((l) => l.completed).length;
        const rate = total > 0
          ? Math.round((completed / total) * 100)
          : 0;
        setRates((prev) => ({ ...prev, [h._id]: rate }));
      }
    });
  }, [habits]);

  // filter + search
  const filtered = habits.filter((h) => {
    const matchSearch = h.name.toLowerCase()
      .includes(search.toLowerCase());
    const matchFilter = filter === 'all' || h.frequency === filter;
    return matchSearch && matchFilter;
  });

  const handleEdit = (habit) => {
    setEditHabit(habit);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await deleteHabit(id);
    if (result.success) {
      toast.success('Habit deleted');
    }
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditHabit(null);
    loadData();
  };

  return (
    <div className="max-w-6xl mx-auto">

      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0  }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-white text-2xl font-bold">
            My Habits
          </h1>
          <p className="text-[#64748B] text-sm mt-0.5">
            {habits.length} habit{habits.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditHabit(null);
            setFormOpen(true);
          }}
          className="flex items-center gap-2 bg-violet-600
                     hover:bg-violet-500 text-white font-medium
                     rounded-xl px-4 py-2.5 transition-all
                     shadow-lg shadow-violet-600/25 text-sm"
        >
          <Plus size={16} />
          New Habit
        </motion.button>
      </motion.div>

      {/* ── SEARCH + FILTER BAR ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        {/* search */}
        <div className="relative flex-1">
          <Search size={16}
            className="absolute left-4 top-1/2
                       -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search habits..."
            className="w-full bg-[#111118] border border-[#1E1E2E]
                       text-white placeholder-[#64748B]
                       rounded-xl pl-11 pr-4 py-3
                       focus:outline-none focus:border-violet-500
                       focus:ring-1 focus:ring-violet-500 text-sm"
          />
        </div>

        {/* frequency filter */}
        <div className="flex items-center gap-2 bg-[#111118]
                        border border-[#1E1E2E] rounded-xl p-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs
                          font-medium capitalize transition-all
                          ${filter === f
                            ? 'bg-violet-600 text-white'
                            : 'text-[#64748B] hover:text-white'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── HABITS GRID ── */}
      {isLoading ? (
        <div className="flex items-center justify-center
                        min-h-[40vh]">
          <div className="w-8 h-8 border-2 border-violet-600
                          border-t-transparent rounded-full
                          animate-spin" />
        </div>

      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center
                     min-h-[40vh] gap-4"
        >
          <div className="w-20 h-20 rounded-2xl bg-[#111118]
                          border border-[#1E1E2E]
                          flex items-center justify-center">
            <Target size={32} className="text-[#2E2E4E]" />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold mb-1">
              {search ? 'No habits found' : 'No habits yet'}
            </p>
            <p className="text-[#64748B] text-sm">
              {search
                ? 'Try a different search term'
                : 'Create your first habit to start tracking'}
            </p>
          </div>
          {!search && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setFormOpen(true)}
              className="flex items-center gap-2 bg-violet-600
                         hover:bg-violet-500 text-white font-medium
                         rounded-xl px-5 py-2.5 transition-all text-sm"
            >
              <Plus size={16} />
              Create First Habit
            </motion.button>
          )}
        </motion.div>

      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2
                     lg:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {filtered.map((habit) => (
              <HabitCard
                key={habit._id}
                habit={habit}
                streak={streaks[habit._id] || 0}
                completionRate={rates[habit._id] || 0}
                onEdit={() => handleEdit(habit)}
                onDelete={() => handleDelete(habit._id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ── HABIT FORM MODAL ── */}
      <HabitForm
        open={formOpen}
        onClose={handleCloseForm}
        editHabit={editHabit}
      />
    </div>
  );
}