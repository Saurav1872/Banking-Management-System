"use client";
import { useState, useEffect } from 'react';
import { employeeAPI, SystemStats } from '../services/api';

export default function SystemOverview() {
  const [stats, setStats] = useState<SystemStats | null>({totalUsers: 0, activeUsers: 0, totalAccounts: 0, totalBalance: 0, totalTransactions: 0});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await employeeAPI.getSystemStats();
        if (response.data) {
          const statsData = response.data ? response.data : {totalUsers: 0, activeUsers: 0, totalAccounts: 0, totalBalance: 0, totalTransactions: 0};
          setStats(statsData);
          console.log(stats);
          console.log(statsData);
          setError(null);
        } else {
          setError(response.error || 'Unknown error');
        }
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (stats) {
      console.log('Updated stats:', stats);
    }
  }, [stats]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">System Overview</h2>
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
            <span className="text-blue-500 text-3xl">👥</span>
            <div>
              <div className="text-sm text-gray-500">Total Users</div>
              <div className="text-xl font-semibold text-gray-900">{stats.totalUsers}</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
            <span className="text-green-500 text-3xl">🟢</span>
            <div>
              <div className="text-sm text-gray-500">Active Users</div>
              <div className="text-xl font-semibold text-gray-900">{stats.activeUsers}</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
            <span className="text-yellow-500 text-3xl">🏦</span>
            <div>
              <div className="text-sm text-gray-500">Total Accounts</div>
              <div className="text-xl font-semibold text-gray-900">{stats.totalAccounts}</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
            <span className="text-purple-500 text-3xl">💰</span>
            <div>
              <div className="text-sm text-gray-500">Total Balance</div>
              <div className="text-xl font-semibold text-gray-900">${stats.totalBalance?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
            <span className="text-pink-500 text-3xl">💳</span>
            <div>
              <div className="text-sm text-gray-500">Total Transactions</div>
              <div className="text-xl font-semibold text-gray-900">{stats.totalTransactions}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 