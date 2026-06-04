import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, CheckSquare,
         Trash2, Edit2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import useTaskStore  from '../store/taskStore';
import useHabitStore from '../store/habitStore';
import TaskForm      from '../components/tasks/TaskForm';

const FILTERS = ['all', 'today', 'upcoming', 'completed'];

const priorityConfig = {
  high:   { color: 'text-red-400',
            bg:    'bg-red-500/10',
            border:'border-red-500/20',
            dot:   'bg-red-400'         },
  medium: { color: 'text-amber-400',
            bg:    'bg-amber-500/10',
            border:'border-amber-500/20',
            dot:   'bg-amber-400'       },
  low:    { color: 'text-blue-400',
            bg:    'bg-blue-500/10',
            border:'border-blue-500/20',
            dot:   'bg-blue-400'        },
};

export default function Tasks() {
  const { tasks, fetchTasks,
          completeTask, deleteTask } = useTaskStore();
  const { habits, fetchHabits }      = useHabitStore();

  const [formOpen,  setFormOpen]  = useState(false);
  const [editTask,  setEditTask]  = useState(null);
  const [search,    setSearch]    = useState('');
  const [filter,    setFilter]    = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  const loadData = async () => {
    setIsLoading(true);
    await Promise.all([fetchTasks(), fetchHabits()]);
    setIsLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  // filter logic
  const filtered = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase()
      .includes(search.toLowerCase());

    let matchFilter = true;
    if (filter === 'today')
      matchFilter = t.dueDate === today && !t.completed;
    else if (filter === 'upcoming')
      matchFilter = t.dueDate > today && !t.completed;
    else if (filter === 'completed')
      matchFilter = t.completed;
    else
      matchFilter = !t.completed;

    return matchSearch && matchFilter;
  });

  // group by priority
  const grouped = {
    high:   filtered.filter((t) => t.priority === 'high'),
    medium: filtered.filter((t) => t.priority === 'medium'),
    low:    filtered.filter((t) => t.priority === 'low'),
  };

  const handleComplete = async (id) => {
    await completeTask(id);
    toast.success('Task updated! ✅');
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    toast.success('Task deleted');
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditTask(null);
    loadData();
  };

  // stats
  const totalToday     = tasks.filter((t) =>
    t.dueDate === today).length;
  const completedToday = tasks.filter((t) =>
    t.dueDate === today && t.completed).length;
  const totalAll       = tasks.length;
  const completedAll   = tasks.filter((t) => t.completed).length;

  return (
    <div className="max-w-4xl mx-auto">

      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0  }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-white text-2xl font-bold">Tasks</h1>
          <p className="text-[#64748B] text-sm mt-0.5">
            {completedToday}/{totalToday} done today
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditTask(null);
            setFormOpen(true);
          }}
          className="flex items-center gap-2 bg-violet-600
                     hover:bg-violet-500 text-white font-medium
                     rounded-xl px-4 py-2.5 text-sm transition-all
                     shadow-lg shadow-violet-600/25"
        >
          <Plus size={16} />
          New Task
        </motion.button>
      </motion.div>

      {/* ── STATS ROW ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        {[
          { label: 'Total',     value: totalAll,       color: 'text-white'        },
          { label: 'Completed', value: completedAll,   color: 'text-[#06FFA5]'   },
          { label: 'Pending',   value: totalAll - completedAll,
            color: 'text-amber-400' },
        ].map((s) => (
          <div key={s.label}
            className="bg-[#111118] border border-[#1E1E2E]
                       rounded-2xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>
              {s.value}
            </p>
            <p className="text-[#64748B] text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* ── SEARCH + FILTER ── */}
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
            placeholder="Search tasks..."
            className="w-full bg-[#111118] border border-[#1E1E2E]
                       text-white placeholder-[#64748B]
                       rounded-xl pl-11 pr-4 py-3 text-sm
                       focus:outline-none focus:border-violet-500
                       focus:ring-1 focus:ring-violet-500"
          />
        </div>

        {/* filter tabs */}
        <div className="flex items-center gap-1 bg-[#111118]
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

      {/* ── TASK LIST ── */}
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
            <CheckSquare size={32} className="text-[#2E2E4E]" />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold mb-1">
              {search ? 'No tasks found' : 'No tasks here'}
            </p>
            <p className="text-[#64748B] text-sm">
              {filter === 'completed'
                ? 'Complete some tasks to see them here'
                : search
                ? 'Try a different search term'
                : 'Add a task to get started'}
            </p>
          </div>
          {!search && filter !== 'completed' && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setFormOpen(true)}
              className="flex items-center gap-2 bg-violet-600
                         hover:bg-violet-500 text-white font-medium
                         rounded-xl px-5 py-2.5 text-sm transition-all"
            >
              <Plus size={16} />
              Add First Task
            </motion.button>
          )}
        </motion.div>

      ) : (
        <div className="space-y-6">
          {/* render each priority group */}
          {Object.entries(grouped).map(([priority, groupTasks]) => {
            if (!groupTasks.length) return null;
            const p = priorityConfig[priority];

            return (
              <motion.div
                key={priority}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0  }}
              >
                {/* group header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${p.dot}`} />
                  <span className={`text-xs font-semibold
                                    uppercase tracking-wider ${p.color}`}>
                    {priority} Priority
                  </span>
                  <span className="text-[#64748B] text-xs">
                    ({groupTasks.length})
                  </span>
                </div>

                {/* tasks in group */}
                <div className="space-y-2">
                  <AnimatePresence>
                    {groupTasks.map((task) => (
                      <TaskRow
                        key={task._id}
                        task={task}
                        habits={habits}
                        onComplete={() => handleComplete(task._id)}
                        onEdit={() => handleEdit(task)}
                        onDelete={() => handleDelete(task._id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}

          {/* completed section */}
          {filter === 'all' && (
            <CompletedSection
              tasks={tasks.filter((t) => t.completed)}
              onDelete={handleDelete}
            />
          )}
        </div>
      )}

      {/* form modal */}
      <TaskForm
        open={formOpen}
        onClose={handleCloseForm}
        editTask={editTask}
      />
    </div>
  );
}

// ── TASK ROW COMPONENT ──
function TaskRow({ task, habits, onComplete, onEdit, onDelete }) {
  const p = priorityConfig[task.priority] || priorityConfig.medium;

  const linkedHabit = habits.find((h) =>
    h._id === task.linkedHabitId?._id ||
    h._id === task.linkedHabitId
  );

  const isOverdue = task.dueDate && task.dueDate < 
    new Date().toISOString().split('T')[0] && !task.completed;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0  }}
      exit={{    opacity: 0, x:  10 }}
      className={`flex items-center gap-3 p-4 rounded-xl
                  border transition-all group
                  ${task.completed
                    ? 'bg-[#0A0A0F] border-[#1E1E2E] opacity-60'
                    : 'bg-[#111118] border-[#1E1E2E] hover:border-[#2E2E4E]'}`}
    >
      {/* checkbox */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onComplete}
        className={`w-7 h-7 rounded-lg border-2 flex-shrink-0
                    flex items-center justify-center transition-all
                    ${task.completed
                      ? 'bg-[#06FFA5] border-[#06FFA5]'
                      : 'border-[#2E2E4E] hover:border-violet-500'}`}
      >
        {task.completed && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
            width="14" height="14" viewBox="0 0 14 14"
            fill="none"
          >
            <path d="M2 7l4 4 6-6"
              stroke="#000" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        )}
      </motion.button>

      {/* content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate
          ${task.completed
            ? 'line-through text-[#64748B]'
            : 'text-white'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {/* due date */}
          {task.dueDate && (
            <span className={`flex items-center gap-1 text-xs
              ${isOverdue
                ? 'text-red-400'
                : 'text-[#64748B]'}`}>
              <Calendar size={10} />
              {isOverdue ? 'Overdue · ' : ''}{task.dueDate}
            </span>
          )}
          {/* linked habit */}
          {linkedHabit && (
            <span className="text-xs text-violet-400
                             bg-violet-600/10 px-2 py-0.5 rounded-full">
              {linkedHabit.icon} {linkedHabit.name}
            </span>
          )}
        </div>
      </div>

      {/* priority badge */}
      <span className={`text-xs font-medium px-2 py-1
                        rounded-lg border flex-shrink-0
                        ${p.color} ${p.bg} ${p.border}`}>
        {task.priority}
      </span>

      {/* actions */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100
                      transition-opacity flex-shrink-0">
        <button
          onClick={onEdit}
          className="w-7 h-7 rounded-lg bg-[#1E1E2E]
                     flex items-center justify-center
                     text-[#64748B] hover:text-white transition-colors"
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
    </motion.div>
  );
}

// ── COMPLETED SECTION ──
function CompletedSection({ tasks, onDelete }) {
  const [open, setOpen] = useState(false);
  if (!tasks.length) return null;

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-[#64748B]
                   hover:text-white transition-colors text-sm mb-3"
      >
        <span>{open ? '▼' : '▶'}</span>
        Completed ({tasks.length})
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{    opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {tasks.map((task) => (
              <motion.div
                key={task._id}
                layout
                className="flex items-center gap-3 p-4 rounded-xl
                           border border-[#1E1E2E] bg-[#0A0A0F]
                           opacity-50 group"
              >
                <div className="w-7 h-7 rounded-lg
                                bg-[#06FFA5] border-[#06FFA5]
                                border-2 flex items-center
                                justify-center flex-shrink-0">
                  <svg width="14" height="14"
                    viewBox="0 0 14 14" fill="none">
                    <path d="M2 7l4 4 6-6"
                      stroke="#000" strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm text-[#64748B]
                              line-through flex-1 truncate">
                  {task.title}
                </p>
                <button
                  onClick={() => onDelete(task._id)}
                  className="w-7 h-7 rounded-lg bg-[#1E1E2E]
                             flex items-center justify-center
                             text-[#64748B] hover:text-red-400
                             transition-colors opacity-0
                             group-hover:opacity-100"
                >
                  <Trash2 size={13} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}