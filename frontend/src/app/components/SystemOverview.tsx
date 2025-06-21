"use client";
import { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';

interface SystemStats {
  totalUsers: number;
  totalAccounts: number;
  totalTransactions: number;
  totalBalance: number;
  activeUsers?: number;
}

export default function SystemOverview() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await employeeAPI.getSystemStats();
        console.log('System stats response:', response.data);
        setStats(response.data as SystemStats);
      } catch (err: any) {
        console.error('Error fetching system stats:', err);
        setError(err.response?.data?.message || 'Failed to load system stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
        <div className="text-red-600 text-sm">{error}</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
        <div className="text-gray-500 text-sm">No data available</div>
      </div>
    );
  }

  // Safely format the total balance with fallback to 0
  const formatBalance = (balance: number | undefined | null) => {
    const value = balance || 0;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.totalUsers || 0}</div>
          <div className="text-sm text-gray-600">Total Users</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.totalAccounts || 0}</div>
          <div className="text-sm text-gray-600">Total Accounts</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{stats.totalTransactions || 0}</div>
          <div className="text-sm text-gray-600">Total Transactions</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {formatBalance(stats.totalBalance)}
          </div>
          <div className="text-sm text-gray-600">Total Balance</div>
        </div>
      </div>
    </div>
  );
} 