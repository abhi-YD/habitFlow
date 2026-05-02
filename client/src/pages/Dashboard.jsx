import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import useHabitStore from '../store/habitStore';
import useTaskStore  from '../store/taskStore';
import useGoalStore  from '../store/goalStore';

import ScoreRing     from '../components/dashboard/ScoreRing';
import StreakCard     from '../components/dashboard/StreakCard';
import WeeklyHeatmap from '../components/dashboard/WeeklyHeatmap';
import HabitItem     from '../components/dashboard/HabitItem';
import TaskItem      from '../components/dashboard/TaskItem';
import QuickAdd      from '../components/dashboard/QuickAdd';

export default function Dashboard() {
  const today = new Date().toISOString().split('T')[0];

  const { habits, logs, fetchHabits,
          fetchLogsForDate, logHabit } = useHabitStore();
  const { tasks, fetchTasks, completeTask } = useTaskStore();
  const { goals, fetchGoals } = useGoalStore();

  const [dailyScore,  setDailyScore]  = useState(0);
  const [todayLogs,   setTodayLogs]   = useState([]);
  const [isLoading,   setIsLoading]   = useState(true);

  // load all data
  const loadData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchHabits(),
      fetchTasks({ date: today }),
      fetchGoals(),
    ]);
    const result = await fetchLogsForDate(today);
    if (result) {
      setDailyScore(result.score);
      setTodayLogs(result.logs);
    }
    setIsLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  // check if habit is completed today
  const isHabitCompleted = (habitId) => {
    return todayLogs.some(
      (l) => l.habitId?._id === habitId && l.completed
    );
  };

  // toggle habit completion
  const handleToggleHabit = async (habitId) => {
    const currentlyDone = isHabitCompleted(habitId);
    const result = await logHabit(
      habitId, today, !currentlyDone
    );
    if (result.success) {
      const updated = await fetchLogsForDate(today);
      if (updated) {
        setDailyScore(updated.score);
        setTodayLogs(updated.logs);
      }
      toast.success(
        currentlyDone ? 'Habit unmarked' : '🎉 Habit completed!'
      );
    }
  };

  // toggle task
  const handleToggleTask = async (taskId) => {
    const result = await completeTask(taskId);
    if (result.success) {
      toast.success('Task updated!');
    }
  };

  // today's tasks only
  const todayTasks = tasks.filter((t) => t.dueDate === today);

  // calculate streak (simplified — longest current streak)
  const currentStreak = habits.length > 0 ? 5 : 0; // placeholder

  if (isLoading) {
    return (
      <div className="flex items-center justify-center
                      min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-600
                          border-t-transparent rounded-full animate-spin" />
          <p className="text-[#64748B] text-sm">
            Loading your day...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">

      {/* ── TOP STATS ROW ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        {/* daily score */}
        <div className="bg-[#111118] border border-[#1E1E2E]
                        rounded-2xl p-5 flex items-center gap-5">
          <ScoreRing score={dailyScore} size={100} />
          <div>
            <p className="text-[#64748B] text-xs font-medium
                          uppercase tracking-wider mb-1">
              Daily Score
            </p>
            <p className="text-white text-sm">
              {todayLogs.filter((l) => l.completed).length} of{' '}
              {habits.length} habits done
            </p>
            <p className="text-[#64748B] text-xs mt-1">
              {dailyScore >= 80
                ? '🔥 Crushing it!'
                : dailyScore >= 50
                ? '💪 Keep going!'
                : '⚡ Let\'s get started!'}
            </p>
          </div>
        </div>

        {/* streak */}
        <StreakCard streak={currentStreak} longest={12} />

        {/* goals summary */}
        <div className="bg-[#111118] border border-[#1E1E2E]
                        rounded-2xl p-5">
          <p className="text-[#64748B] text-xs font-medium
                        uppercase tracking-wider mb-3">
            Active Goals
          </p>
          {goals.length === 0 ? (
            <div className="flex flex-col items-center
                            justify-center h-16 gap-2">
              <p className="text-[#64748B] text-sm">
                No goals yet
              </p>
              <Link to="/goals"
                className="text-violet-400 text-xs
                           hover:text-violet-300">
                + Add a goal
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {goals.slice(0, 2).map((goal) => {
                const progress = Math.min(
                  Math.round(
                    (goal.currentValue / goal.targetValue) * 100
                  ), 100
                );
                return (
                  <div key={goal._id}>
                    <div className="flex items-center
                                    justify-between mb-1">
                      <span className="text-white text-xs
                                       font-medium truncate">
                        {goal.icon} {goal.title}
                      </span>
                      <span className="text-[#64748B] text-xs
                                       ml-2 flex-shrink-0">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1E1E2E]
                                    rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-violet-600 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
              {goals.length > 2 && (
                <Link to="/goals"
                  className="text-[#64748B] text-xs
                             hover:text-violet-400 transition-colors">
                  +{goals.length - 2} more goals →
                </Link>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* ── MAIN CONTENT ROW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

        {/* HABITS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-white font-semibold">
              Today's Habits
            </p>
            <Link to="/habits"
              className="flex items-center gap-1 text-violet-400
                         text-xs hover:text-violet-300 transition-colors">
              Manage
              <ArrowRight size={12} />
            </Link>
          </div>

          {habits.length === 0 ? (
            <div className="flex flex-col items-center
                            justify-center py-10 gap-3">
              <span className="text-4xl">🎯</span>
              <p className="text-[#64748B] text-sm text-center">
                No habits yet.
                <br />Add your first habit to get started!
              </p>
              <Link to="/habits"
                className="text-violet-400 text-sm font-medium
                           hover:text-violet-300 transition-colors">
                + Add Habit
              </Link>
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto
                            scrollbar-hide">
              {habits.map((habit) => (
                <HabitItem
                  key={habit._id}
                  habit={habit}
                  isCompleted={isHabitCompleted(habit._id)}
                  onToggle={() => handleToggleHabit(habit._id)}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* TASKS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-white font-semibold">
              Today's Tasks
            </p>
            <Link to="/tasks"
              className="flex items-center gap-1 text-violet-400
                         text-xs hover:text-violet-300 transition-colors">
              All tasks
              <ArrowRight size={12} />
            </Link>
          </div>

          {todayTasks.length === 0 ? (
            <div className="flex flex-col items-center
                            justify-center py-10 gap-3">
              <span className="text-4xl">✅</span>
              <p className="text-[#64748B] text-sm text-center">
                No tasks for today.
                <br />Add tasks to stay on track!
              </p>
              <Link to="/tasks"
                className="text-violet-400 text-sm font-medium
                           hover:text-violet-300 transition-colors">
                + Add Task
              </Link>
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto
                            scrollbar-hide">
              {todayTasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onToggle={() => handleToggleTask(task._id)}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── WEEKLY HEATMAP ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <WeeklyHeatmap habits={habits} logs={logs} />
      </motion.div>

      {/* ── QUICK ADD FAB ── */}
      <QuickAdd onAdded={loadData} />
    </div>
  );
}