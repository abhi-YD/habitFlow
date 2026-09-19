import { useEffect, useRef, useState } from 'react';
import { motion }          from 'framer-motion';
import { BarChart2, Download, RefreshCw } from 'lucide-react';
import toast               from 'react-hot-toast';
import useAnalyticsStore   from '../store/analyticsStore';

import OverviewCards   from '../components/analytics/OverviewCards';
import TrendChart      from '../components/analytics/TrendChart';
import HabitBarChart   from '../components/analytics/HabitBarChart';
import DayOfWeekChart  from '../components/analytics/DayOfWeekChart';
import YearHeatmap     from '../components/analytics/YearHeatMap';
import HabitStatsList  from '../components/analytics/HabitStatsList';

const PERIODS = [
  { label: '7 days',  value: 7  },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
];

export default function Analytics() {
  const { data, isLoading, days, fetchAnalytics } = useAnalyticsStore();
  const pageRef = useRef(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => { fetchAnalytics(30); }, []);

  const handlePeriodChange = (d) => fetchAnalytics(d);

  const handleExport = async () => {
    setExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF       = (await import('jspdf')).default;

      const canvas = await html2canvas(pageRef.current, {
        backgroundColor: '#0A0A0F',
        scale: 1.5,
        useCORS: true,
      });

      const pdf  = new jsPDF('p', 'mm', 'a4');
      const imgW = 210;
      const imgH = (canvas.height * imgW) / canvas.width;

      pdf.addImage(
        canvas.toDataURL('image/png'), 'PNG',
        0, 0, imgW, imgH
      );
      pdf.save(`habitflow-report-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Report exported! 📄');
    } catch (err) {
      toast.error('Export failed');
    }
    setExporting(false);
  };

  return (
    <div className="max-w-6xl mx-auto" ref={pageRef}>

      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0  }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-600
                          flex items-center justify-center">
            <BarChart2 size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold">
              Analytics
            </h1>
            <p className="text-[#64748B] text-xs mt-0.5">
              Your habit performance insights
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* period selector */}
          <div className="flex items-center gap-1 bg-[#111118]
                          border border-[#1E1E2E] rounded-xl p-1">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => handlePeriodChange(p.value)}
                className={`px-3 py-1.5 rounded-lg text-xs
                            font-medium transition-all
                            ${days === p.value
                              ? 'bg-violet-600 text-white'
                              : 'text-[#64748B] hover:text-white'}`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* refresh */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => fetchAnalytics(days)}
            disabled={isLoading}
            className="w-9 h-9 rounded-xl bg-[#111118]
                       border border-[#1E1E2E]
                       flex items-center justify-center
                       text-[#64748B] hover:text-white
                       transition-colors"
          >
            <RefreshCw size={15}
              className={isLoading ? 'animate-spin' : ''} />
          </motion.button>

          {/* export */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            disabled={exporting || isLoading}
            className="flex items-center gap-2 bg-violet-600
                       hover:bg-violet-500 disabled:opacity-50
                       text-white text-sm font-medium
                       rounded-xl px-4 py-2 transition-all"
          >
            <Download size={14} />
            {exporting ? 'Exporting...' : 'Export PDF'}
          </motion.button>
        </div>
      </motion.div>

      {/* ── LOADING ── */}
      {isLoading && (
        <div className="flex items-center justify-center
                        min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-violet-600
                            border-t-transparent rounded-full
                            animate-spin" />
            <p className="text-[#64748B] text-sm">
              Analyzing your habits...
            </p>
          </div>
        </div>
      )}

      {/* ── NO DATA ── */}
      {!isLoading && !data?.overview?.totalHabits && (
        <div className="flex flex-col items-center justify-center
                        min-h-[60vh] gap-4">
          <BarChart2 size={48} className="text-[#2E2E4E]" />
          <p className="text-white font-semibold text-lg">
            No data yet
          </p>
          <p className="text-[#64748B] text-sm text-center">
            Start tracking habits to see your analytics
          </p>
        </div>
      )}

      {/* ── CONTENT ── */}
      {!isLoading && data?.overview?.totalHabits > 0 && (
        <>
          {/* overview cards */}
          <OverviewCards overview={data.overview} />

          {/* trend chart — full width */}
          <TrendChart data={data.dailyTrend} />

          {/* 2 column: bar chart + day of week */}
          <div className="grid grid-cols-1 lg:grid-cols-2
                          gap-4 mb-4">
            <HabitBarChart data={data.habitStats} />
            <DayOfWeekChart data={data.dayOfWeek} />
          </div>

          {/* 2 column: habit list + task stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2
                          gap-4 mb-4">
            <HabitStatsList data={data.habitStats} />

            {/* task stats card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ delay: 0.3 }}
              className="bg-[#111118] border border-[#1E1E2E]
                         rounded-2xl p-5"
            >
              <h3 className="text-white font-bold mb-4">
                Task Summary
              </h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Total',     value: data.taskStats.total,
                    color: 'text-white'        },
                  { label: 'Completed', value: data.taskStats.completed,
                    color: 'text-[#06FFA5]'   },
                  { label: 'Rate',      value: `${data.taskStats.rate}%`,
                    color: 'text-violet-400'   },
                ].map((s) => (
                  <div key={s.label}
                    className="bg-[#0A0A0F] border border-[#1E1E2E]
                               rounded-xl p-3 text-center">
                    <p className={`text-xl font-bold ${s.color}`}>
                      {s.value}
                    </p>
                    <p className="text-[#64748B] text-xs mt-1">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* task completion bar */}
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[#64748B]">
                    Task Completion Rate
                  </span>
                  <span className="text-violet-400 font-semibold">
                    {data.taskStats.rate}%
                  </span>
                </div>
                <div className="w-full h-2 bg-[#1E1E2E]
                                rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${data.taskStats.rate}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-violet-600 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* year heatmap — full width */}
          <YearHeatmap data={data.yearHeatmap} />
        </>
      )}
    </div>
  );
}