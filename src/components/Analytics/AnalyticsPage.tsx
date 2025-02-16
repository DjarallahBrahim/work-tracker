import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Calendar, TrendingUp, PieChart, BarChart3, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatTime } from '../../utils/timeUtils';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface AnalyticsData {
  date: string;
  total_work_time: number;
  total_break_time: number;
}

type ViewMode = 'weekly' | 'monthly';

export function AnalyticsPage() {
  const [viewMode, setViewMode] = React.useState<ViewMode>('weekly');
  const [analyticsData, setAnalyticsData] = React.useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const today = new Date();
        const startDate = new Date();
        
        // Set date range based on view mode
        if (viewMode === 'weekly') {
          startDate.setDate(today.getDate() - 7);
        } else {
          startDate.setMonth(today.getMonth() - 1);
        }

        const { data, error } = await supabase
          .from('daily_results')
          .select('date, total_work_time, total_break_time')
          .eq('user_id', user.id)
          .gte('date', startDate.toISOString().split('T')[0])
          .lte('date', today.toISOString().split('T')[0])
          .order('date', { ascending: true });

        if (error) throw error;
        setAnalyticsData(data || []);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [viewMode]);

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Work Time (hours)', 'Break Time (hours)'],
      ...analyticsData.map(record => [
        record.date,
        (record.total_work_time / 3600).toFixed(2),
        (record.total_break_time / 3600).toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `work-time-analytics-${viewMode}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Prepare data for charts
  const dates = analyticsData.map(record => 
    new Date(record.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  );

  const workTimes = analyticsData.map(record => record.total_work_time / 3600); // Convert to hours
  const breakTimes = analyticsData.map(record => record.total_break_time / 3600);

  const totalWorkTime = workTimes.reduce((acc, curr) => acc + curr, 0);
  const totalBreakTime = breakTimes.reduce((acc, curr) => acc + curr, 0);

  // Line chart data
  const lineChartData = {
    labels: dates,
    datasets: [
      {
        label: 'Work Time (hours)',
        data: workTimes,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Break Time (hours)',
        data: breakTimes,
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.5)',
        tension: 0.3,
      },
    ],
  };

  // Stacked bar chart data
  const barChartData = {
    labels: dates,
    datasets: [
      {
        label: 'Work Time (hours)',
        data: workTimes,
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
      },
      {
        label: 'Break Time (hours)',
        data: breakTimes,
        backgroundColor: 'rgba(249, 115, 22, 0.8)',
      },
    ],
  };

  // Pie chart data
  const pieChartData = {
    labels: ['Work Time', 'Break Time'],
    datasets: [
      {
        data: [totalWorkTime, totalBreakTime],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(249, 115, 22, 0.8)',
        ],
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8">
        <h1 className="text-xl sm:text-2xl font-bold gradient-text">Analytics Dashboard</h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setViewMode('weekly')}
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-md transition-colors ${
                viewMode === 'weekly'
                  ? 'bg-indigo-500 text-white'
                  : 'text-indigo-300 hover:bg-white/5'
              }`}
            >
              <Calendar size={14} className="sm:w-4 sm:h-4" />
              <span>Weekly</span>
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-md transition-colors ${
                viewMode === 'monthly'
                  ? 'bg-indigo-500 text-white'
                  : 'text-indigo-300 hover:bg-white/5'
              }`}
            >
              <TrendingUp size={14} className="sm:w-4 sm:h-4" />
              <span>Monthly</span>
            </button>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 transition-colors"
          >
            <Download size={14} className="sm:w-4 sm:h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : analyticsData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-indigo-300">
          <PieChart size={48} className="mb-4 opacity-50" />
          <p className="text-lg">No data available for the selected period</p>
          <p className="text-sm opacity-75">Start tracking your work time to see analytics</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Time Trends */}
          <div className="glass-panel p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-indigo-300">
                <TrendingUp size={18} className="inline-block mr-2" />
                Time Trends
              </h2>
            </div>
            <div className="h-60 sm:h-80">
              <Line
                data={lineChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                      },
                      ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    },
                    x: {
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                      },
                      ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      labels: {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Time Distribution */}
          <div className="glass-panel p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-indigo-300">
                <BarChart3 size={18} className="inline-block mr-2" />
                Time Distribution
              </h2>
            </div>
            <div className="h-60 sm:h-80">
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      stacked: true,
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                      },
                      ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    },
                    x: {
                      stacked: true,
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                      },
                      ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      labels: {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Work/Break Ratio */}
          <div className="glass-panel p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-indigo-300">
                <PieChart size={18} className="inline-block mr-2" />
                Work/Break Ratio
              </h2>
            </div>
            <div className="h-60 sm:h-80 flex items-center justify-center">
              <div className="w-48 sm:w-64">
                <Pie
                  data={pieChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="glass-panel p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-indigo-300">
                Summary Statistics
              </h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-indigo-300 mb-2">Total Time</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-indigo-500/10 rounded-lg p-4">
                    <div className="text-sm text-indigo-300">Work Time</div>
                    <div className="text-xl sm:text-2xl font-semibold text-indigo-400">
                      {formatTime(totalWorkTime * 3600)}
                    </div>
                  </div>
                  <div className="bg-orange-500/10 rounded-lg p-4">
                    <div className="text-sm text-orange-300">Break Time</div>
                    <div className="text-xl sm:text-2xl font-semibold text-orange-400">
                      {formatTime(totalBreakTime * 3600)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-indigo-300 mb-2">Averages</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm text-indigo-300">Daily Work</div>
                    <div className="text-xl font-semibold text-indigo-400">
                      {formatTime((totalWorkTime / dates.length) * 3600)}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm text-orange-300">Daily Break</div>
                    <div className="text-xl font-semibold text-orange-400">
                      {formatTime((totalBreakTime / dates.length) * 3600)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}