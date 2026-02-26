import { useState, useEffect } from 'react';
import knowledgeService from '../services/knowledgeService';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { formatDate } from '../utils/helpers.jsx';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await knowledgeService.getAnalytics();
      if (response.success) {
        setAnalytics(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">
          No Analytics Data Available
        </h2>
      </div>
    );
  }

  // Category Distribution Chart Data
  const categoryChartData = {
    labels: analytics.categoryDistribution.map((item) => item.category),
    datasets: [
      {
        label: 'Knowledge by Category',
        data: analytics.categoryDistribution.map((item) => item.count),
        backgroundColor: [
          '#3B82F6',
          '#8B5CF6',
          '#10B981',
          '#EF4444',
          '#F59E0B',
          '#EC4899',
          '#6366F1',
          '#14B8A6',
          '#06B6D4',
          '#F97316',
          '#8B5CF6',
          '#6B7280',
        ],
      },
    ],
  };

  // Scope Distribution Chart Data
  const scopeChartData = {
    labels: analytics.scopeDistribution.map((item) => item.scopeType),
    datasets: [
      {
        label: 'Knowledge by Difficulty',
        data: analytics.scopeDistribution.map((item) => item.count),
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#6B7280'],
      },
    ],
  };

  // Growth Data Chart
  const growthChartData = {
    labels: analytics.growthData.map((item) => formatDate(item.date)),
    datasets: [
      {
        label: 'Knowledge Added Over Time',
        data: analytics.growthData.map((item) => item.count),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="fade-in">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Analytics Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm text-gray-600 mb-1">Total Knowledge</div>
          <div className="text-3xl font-bold text-primary-600">
            {analytics.total}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm text-gray-600 mb-1">Categories</div>
          <div className="text-3xl font-bold text-green-600">
            {analytics.categoryDistribution.length}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm text-gray-600 mb-1">Avg AI Confidence</div>
          <div className="text-3xl font-bold text-purple-600">
            {(analytics.aiConfidenceStats.avgConfidence * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm text-gray-600 mb-1">AI Processed</div>
          <div className="text-3xl font-bold text-blue-600">
            {analytics.aiConfidenceStats.count}
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Knowledge by Category
          </h2>
          <div className="h-80">
            <Bar data={categoryChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Difficulty Distribution
          </h2>
          <div className="h-80">
            <Pie data={scopeChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Knowledge Growth Over Time
        </h2>
        <div className="h-80">
          <Line data={growthChartData} options={chartOptions} />
        </div>
      </div>

      {/* Trending Tags */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Trending Tags
        </h2>
        <div className="flex flex-wrap gap-3">
          {analytics.trendingTags.map((item, index) => (
            <div
              key={index}
              className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
            >
              #{item.tag} ({item.count})
            </div>
          ))}
        </div>
      </div>

      {/* Top Viewed Knowledge */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Top Viewed Knowledge
        </h2>
        <div className="space-y-3">
          {analytics.topViewed.map((item, index) => (
            <div
              key={item._id}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex-1">
                <div className="font-medium text-gray-800">{item.title}</div>
                <div className="text-sm text-gray-600">{item.category}</div>
              </div>
              <div className="text-sm font-semibold text-primary-600">
                {item.views} views
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Added */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recently Added
        </h2>
        <div className="space-y-3">
          {analytics.recentlyAdded.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <div className="font-medium text-gray-800">{item.title}</div>
                <div className="text-sm text-gray-600">
                  {item.category} • {item.author}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {formatDate(item.createdAt)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
