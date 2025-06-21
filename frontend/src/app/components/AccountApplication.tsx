"use client";
import { useState } from 'react';
import { applicationAPI, CreateAccountApplicationRequest } from '../services/api';

export default function AccountApplication() {
  const [formData, setFormData] = useState<CreateAccountApplicationRequest>({
    accountType: 'SAVINGS',
    initialDeposit: 0,
    purpose: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await applicationAPI.createApplication(formData);
      setSuccess('Account application submitted successfully! It will be reviewed by our team.');
      setFormData({
        accountType: 'SAVINGS',
        initialDeposit: 0,
        purpose: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply for New Account</h3>
      
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="text-green-600 text-sm bg-green-50 p-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Type
          </label>
          <select
            value={formData.accountType}
            onChange={(e) => setFormData({...formData, accountType: e.target.value as 'SAVINGS' | 'CURRENT'})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            required
          >
            <option value="SAVINGS">Savings Account</option>
            <option value="CURRENT">Current Account</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Initial Deposit ($)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.initialDeposit}
            onChange={(e) => setFormData({...formData, initialDeposit: parseFloat(e.target.value) || 0})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Purpose of Account
          </label>
          <textarea
            value={formData.purpose}
            onChange={(e) => setFormData({...formData, purpose: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
            rows={3}
            placeholder="Please describe the purpose of this account..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
} 