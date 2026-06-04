import { useEffect, useState, useCallback } from 'react';
import { motion }    from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link }      from 'react-router-dom';
import toast         from 'react-hot-toast';

import useHabitStore from '../store/habitStore';
import useTaskStore  from '../store/taskStore';
import useGoalStore  from '../store/goalStore';

import ScoreRing     from '../components/dashboard/ScoreRing';
import StreakCard     from '../components/dashboard/StreakCard';
import WeeklyHeatmap from '../components/dashboard/WeeklyHeatMap';
import HabitItem     from '../components/dashboard/HabitItem';
import TaskItem      from '../components/dashboard/TaskItem';
import QuickAdd      from '../components/dashboard/QuickAdd';

// ── helpers ──
const getToday = () => new Date().toISOString().split('T')[0];

const getNDaysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};

// calculate current + longest streak from dailyScores map
const calculateStreaks = (dailyScores) => {
  const today   = getToday();
  const entries = Object.entries(dailyScores)
    .filter(([, score]) => score > 0)
    .map(([date]) => date)
    .sort((a, b) => new Date(b) - new Date(a)); // newest first

  let current = 0;
  let longest = 0;
  let temp    = 0;
  let prev    = null;

  // current streak — consecutive days ending today or yesterday
  const sortedDesc = [...entries];
  for (let i = 0; i < sortedDesc.length; i++) {
    const date     = sortedDesc[i];
    const expected = getNDaysAgo(i);
    if (date === expected) {
      current++;
    } else {
      break;
    }
  }

  // longest streak — from all history
  const sortedAsc = [...entries].sort();
  for (const date of sortedAsc) {
    if (!prev) {
      temp = 1;
    } else {
      const diff = Math.round(
        (new Date(date) - new Date(prev)) / (1000 * 60 * 60 * 24)
      );
      temp = diff === 1 ? temp + 1 : 1;
    }
    longest = Math.max(longest, temp);
    prev    = date;
  }

  return { current, longest };
};

export default function Dashboard() {
  const today = getToday();

  const {
    habits, logs,
    fetchHabits, fetchLogsForDate,
    fetchLogsForRange, logHabit
  } = useHabitStore();

  const { tasks, fetchTasks, completeTask } = useTaskStore();
  const { goals, fetchGoals }               = useGoalStore();

  const [dailyScore,   setDailyScore]   = useState(0);
  const [todayLogs,    setTodayLogs]    = useState([]);
  const [dailyScores,  setDailyScores]  = useState({});
  const [streakData,   setStreakData]   = useState({
    current: 0, longest: 0
  });
  const [isLoading,    setIsLoading]    = useState(true);

  // ── LOAD ALL DATA ──
  const loadData = useCallback(async () => {
    setIsLoading(true);

    // 1. fetch habits FIRST so we know total count
    const habitsList = await fetchHabits();
    const totalHabits = habitsList?.length || 0;

    // 2. fetch everything else in parallel
    const [, , rangeData, todayData] = await Promise.all([
      fetchTasks({ date: today }),
      fetchGoals(),
      // last 60 days for streak + heatmap
      fetchLogsForRange(getNDaysAgo(60), today),
      // today's logs separately for accuracy
      fetchLogsForDate(today),
    ]);

    // 3. calculate today's REAL score
    if (todayData) {
      const completedToday = todayData.logs.filter(
        (l) => l.completed
      ).length;

      // ✅ FIXED: score = completed / TOTAL HABITS (not total logs)
      const realScore = totalHabits > 0
        ? Math.round((completedToday / totalHabits) * 100)
        : 0;

      setDailyScore(realScore);
      setTodayLogs(todayData.logs);
    }

    // 4. build dailyScores for heatmap + streaks
    if (rangeData?.dailyScores) {
      // override today's score with real calculation
      const scores = { ...rangeData.dailyScores };
      if (todayData && totalHabits > 0) {
        const completedToday = todayData.logs.filter(
          (l) => l.completed
        ).length;
        scores[today] = Math.round(
          (completedToday / totalHabits) * 100
        );
      }
      setDailyScores(scores);

      // 5. calculate real streaks
      const streaks = calculateStreaks(scores);
      setStreakData(streaks);
    }

    setIsLoading(false);
  }, [today]);

  useEffect(() => { loadData(); }, []);

  // ── CHECK IF HABIT DONE TODAY ──
  // ✅ FIXED: handle both string and object habitId
  const isHabitCompleted = (habitId) => {
    return todayLogs.some((l) => {
      const logHabitId = l.habitId?._id || l.habitId;
      return String(logHabitId) === String(habitId) && l.completed;
    });
  };

  // ── TOGGLE HABIT ──
  const handleToggleHabit = async (habitId) => {
    const currentlyDone = isHabitCompleted(habitId);
    const result = await logHabit(habitId, today, !currentlyDone);

    if (result.success) {
      // re-fetch today's logs and recalculate score
      const updated = await fetchLogsForDate(today);
      if (updated) {
        const completedCount = updated.logs.filter(
          (l) => l.completed
        ).length;
        const realScore = habits.length > 0
          ? Math.round((completedCount / habits.length) * 100)
          : 0;
        setDailyScore(realScore);
        setTodayLogs(updated.logs);

        // update today's score in dailyScores
        setDailyScores((prev) => ({
          ...prev, [today]: realScore
        }));

        // recalculate streaks
        const newScores = { ...dailyScores, [today]: realScore };
        setStreakData(calculateStreaks(newScores));
      }
      toast.success(
        currentlyDone ? 'Habit unmarked' : '🎉 Habit completed!'
      );
    }
  };

  // ── TOGGLE TASK ──
  const handleToggleTask = async (taskId) => {
    const result = await completeTask(taskId);
    if (result.success) toast.success('Task updated!');
  };

  const todayTasks = tasks.filter((t) => t.dueDate === today);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-600
                          border-t-transparent rounded-full
                          animate-spin" />
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
        {/* ✅ REAL daily score */}
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

        {/* ✅ REAL streak */}
        <StreakCard
          streak={streakData.current}
          longest={streakData.longest}
        />

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
              <p className="text-[#64748B] text-sm">No goals yet</p>
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
                  goal.targetValue > 0
                    ? Math.round(
                        (goal.currentValue / goal.targetValue) * 100
                      )
                    : 0,
                  100
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
          className="bg-[#111118] border border-[#1E1E2E]
                     rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-white font-semibold">Today's Habits</p>
            <Link to="/habits"
              className="flex items-center gap-1 text-violet-400
                         text-xs hover:text-violet-300
                         transition-colors">
              Manage <ArrowRight size={12} />
            </Link>
          </div>

          {habits.length === 0 ? (
            <div className="flex flex-col items-center
                            justify-center py-10 gap-3">
              <span className="text-4xl">🎯</span>
              <p className="text-[#64748B] text-sm text-center">
                No habits yet.<br />
                Add your first habit to get started!
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
          className="bg-[#111118] border border-[#1E1E2E]
                     rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-white font-semibold">Today's Tasks</p>
            <Link to="/tasks"
              className="flex items-center gap-1 text-violet-400
                         text-xs hover:text-violet-300
                         transition-colors">
              All tasks <ArrowRight size={12} />
            </Link>
          </div>

          {todayTasks.length === 0 ? (
            <div className="flex flex-col items-center
                            justify-center py-10 gap-3">
              <span className="text-4xl">✅</span>
              <p className="text-[#64748B] text-sm text-center">
                No tasks for today.<br />
                Add tasks to stay on track!
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

      {/* ── WEEKLY HEATMAP (✅ now uses real dailyScores) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <WeeklyHeatmap dailyScores={dailyScores} />
      </motion.div>

      {/* ── QUICK ADD FAB ── */}
      <QuickAdd onAdded={loadData} />
    </div>
  );
}