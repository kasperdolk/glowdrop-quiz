'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Download, RefreshCw, TrendingDown, TrendingUp, Users, Target, Calendar, BarChart3 } from 'lucide-react';
import FunnelChart from '@/components/FunnelChart';

interface FunnelData {
  step_number: number;
  step_name: string;
  visitors: number;
  dropoff_rate: number;
  conversion_rate: number;
}

interface AnswerData {
  step_name: string;
  question: string;
  answer: string;
  count: number;
  percentage: number;
}

interface OverviewData {
  total_sessions: number;
  completion_stats: {
    total: number;
    completed: number;
    completion_rate: number;
  };
  sessions_by_date: Array<{
    date: string;
    sessions: number;
    completed: number;
  }>;
}

interface AnalyticsData {
  funnel: FunnelData[];
  answers: { [key: string]: AnswerData[] };
  overview: OverviewData;
}

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Check if already authenticated
  useEffect(() => {
    const savedAuth = localStorage.getItem('dashboard_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  // Auto-refresh every 30 seconds when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Quick fix: check password directly
      if (password === 'analytics123') {
        setIsAuthenticated(true);
        localStorage.setItem('dashboard_auth', 'true');
        localStorage.setItem('dashboard_credentials', btoa(`admin:${password}`));
        await fetchData();
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const credentials = localStorage.getItem('dashboard_credentials');
      if (!credentials) {
        setIsAuthenticated(false);
        return;
      }

      const response = await fetch('/api/analytics/stats?type=all', {
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setData(result.data);
        setLastUpdated(new Date());
      } else if (response.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem('dashboard_auth');
        localStorage.removeItem('dashboard_credentials');
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (table: 'sessions' | 'events' | 'answers') => {
    try {
      const credentials = localStorage.getItem('dashboard_credentials');
      const response = await fetch(`/api/analytics/export?table=${table}`, {
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${table}_export.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9F7F5FF' }}>
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Analytics Dashboard</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!data && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9F7F5FF' }}>
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F7F5FF' }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Quiz Analytics Dashboard</h1>
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <span className="text-sm text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={fetchData}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
              >
                <RefreshCw className={loading ? 'animate-spin' : ''} size={16} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {data && (
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{data.overview.total_sessions}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data.overview.completion_stats.completion_rate}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data.overview.completion_stats.completed}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Today</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data.overview.sessions_by_date[0]?.sessions || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Funnel Analysis */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 size={24} />
                Funnel Drop-off Analysis
              </h2>
              <button
                onClick={() => handleExport('events')}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center gap-2"
              >
                <Download size={16} />
                Export Events
              </button>
            </div>

            {/* Funnel Chart */}
            <div className="mb-8">
              <FunnelChart data={data.funnel} />
            </div>

            {/* Detailed Table */}
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Step</th>
                    <th className="text-left py-2">Step Name</th>
                    <th className="text-right py-2">Visitors</th>
                    <th className="text-right py-2">Drop-off Rate</th>
                    <th className="text-right py-2">Conversion Rate</th>
                    <th className="text-center py-2">Visual</th>
                  </tr>
                </thead>
                <tbody>
                  {data.funnel.map((step, index) => (
                    <tr key={step.step_number} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-medium">{step.step_number}</td>
                      <td className="py-3">{step.step_name}</td>
                      <td className="py-3 text-right font-medium">{step.visitors}</td>
                      <td className="py-3 text-right">
                        {step.dropoff_rate > 0 ? (
                          <span className="text-red-600 flex items-center justify-end gap-1">
                            <TrendingDown size={16} />
                            {step.dropoff_rate}%
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-green-600">{step.conversion_rate}%</span>
                      </td>
                      <td className="py-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${step.conversion_rate}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Answer Analytics */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Eye size={24} />
                Answer Distribution
              </h2>
              <button
                onClick={() => handleExport('answers')}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center gap-2"
              >
                <Download size={16} />
                Export Answers
              </button>
            </div>

            <div className="space-y-6">
              {Object.entries(data.answers).map(([stepName, answers]) => (
                <div key={stepName} className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">{stepName}</h3>
                  <div className="space-y-2">
                    {answers.map((answer, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div className="flex-1">
                          <span className="font-medium">{answer.answer}</span>
                          <p className="text-sm text-gray-500">{answer.question}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium">{answer.count} votes</span>
                          <span className="text-sm text-blue-600 font-medium">{answer.percentage}%</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${answer.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Sessions by Date (Last 7 Days)</h2>
              <button
                onClick={() => handleExport('sessions')}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center gap-2"
              >
                <Download size={16} />
                Export Sessions
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Date</th>
                    <th className="text-right py-2">Total Sessions</th>
                    <th className="text-right py-2">Completed</th>
                    <th className="text-right py-2">Completion Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {data.overview.sessions_by_date.map((day, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-medium">{day.date}</td>
                      <td className="py-3 text-right">{day.sessions}</td>
                      <td className="py-3 text-right">{day.completed}</td>
                      <td className="py-3 text-right">
                        {day.sessions > 0 ? `${Math.round((day.completed / day.sessions) * 100)}%` : '0%'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;