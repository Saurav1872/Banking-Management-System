"use client";
import { useState, useEffect } from 'react';
import { accountAPI, Account } from '../services/api';

export default function AccountOverview() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const response = await accountAPI.getAccounts();
        setAccounts(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load accounts');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Overview</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Overview</h3>
        <div className="text-red-600 text-sm">{error}</div>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Overview</h3>
        <div className="text-gray-500 text-sm">No accounts found</div>
      </div>
    );
  }

  const primaryAccount = accounts[0]; // Assuming first account is primary

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Overview</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Account Number:</span>
          <span className="font-medium">{primaryAccount.accountNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Balance:</span>
          <span className="font-medium text-green-600">
            ${primaryAccount.balance.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Account Type:</span>
          <span className="font-medium capitalize">{primaryAccount.accountType.toLowerCase()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Status:</span>
          <span className={`font-medium ${primaryAccount.isActive ? 'text-green-600' : 'text-red-600'}`}>
            {primaryAccount.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
      
      {accounts.length > 1 && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Other Accounts</h4>
          <div className="space-y-2">
            {accounts.slice(1).map((account) => (
              <div key={account.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{account.accountNumber}</span>
                <span className="font-medium">${account.balance.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 