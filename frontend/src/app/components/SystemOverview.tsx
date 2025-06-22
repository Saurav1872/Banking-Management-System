"use client";
import { useState, useEffect } from 'react';
import { employeeAPI, SystemStats } from '../services/api';

export default function SystemOverview() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await employeeAPI.getSystemStats();
        if (response.data) {
          setStats(response.data);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div>
      <h2>System Overview</h2>
      {stats && (
        <ul>
          <li>Total Users: {stats.totalUsers}</li>
          <li>Total Accounts: {stats.totalAccounts}</li>
          <li>Total Transactions: {stats.totalTransactions}</li>
        </ul>
      )}
    </div>
  );
} 