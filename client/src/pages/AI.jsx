import { useEffect }        from 'react';
import { motion }           from 'framer-motion';
import { Sparkles }         from 'lucide-react';
import useAIStore           from '../store/aiStore';
import useHabitStore        from '../store/habitStore';
import CoachCard            from '../components/ai/CoachCard';
import HabitSuggestions     from '../components/ai/HabitSuggestions';
import SmartInsights        from '../components/ai/SmartInsights';
import TaskPrioritizer      from '../components/ai/TaskPrioritizer';
import usePlanStore           from '../store/planStore';

import { Crown }     from 'lucide-react';



export default function AI() {
  const {
    coach, suggestions, insights, priorities,
    isLoading,
    fetchCoach, fetchSuggestions,
    fetchInsights, fetchPriorities,
  } = useAIStore();

  const { plan, openUpgradeModal } = usePlanStore();

  const { fetchHabits } = useHabitStore();

  useEffect(() => {
    fetchHabits();
    fetchCoach();
    fetchInsights();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">

      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0  }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-violet-600
                          flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <h1 className="text-white text-2xl font-bold">
            AI Coach
          </h1>
        </div>
        <p className="text-[#64748B] text-sm ml-12">
          Powered by Groq · Llama 3.3 70B
        </p>
      </motion.div>

      {/* ── GRID LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* LEFT COLUMN */}
        <div className="space-y-4">

          {/* Daily Coach */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: 0.1 }}
          >
            <CoachCard
              coach={coach}
              isLoading={isLoading.coach}
              onRefresh={fetchCoach}
            />
          </motion.div>

          {/* Smart Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: 0.2 }}
          >
            <SmartInsights
              insights={insights}
              isLoading={isLoading.insights}
              onRefresh={fetchInsights}
            />
          </motion.div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">

          {/* Habit Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: 0.15 }}
          >
            <HabitSuggestions
              suggestions={suggestions}
              isLoading={isLoading.suggestions}
              onFetch={fetchSuggestions}
            />
          </motion.div>

          {/* Task Prioritizer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: 0.25 }}
          >
            <TaskPrioritizer
              priorities={priorities}
              isLoading={isLoading.priorities}
              onPrioritize={fetchPriorities}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}