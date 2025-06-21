"use client";
import { useState } from 'react';
import { transactionAPI } from '../services/api';

interface FundTransferProps {
  fromAccountNumber: string;
  onTransferComplete?: () => void;
}

export default function FundTransfer({ fromAccountNumber, onTransferComplete }: FundTransferProps) {
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!toAccountNumber || !amount) {
      setError('Please fill in all fields');
      return;
    }

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await transactionAPI.transferFunds({
        fromAccountNumber,
        toAccountNumber,
        amount: transferAmount
      });

      setSuccess('Transfer completed successfully!');
      setToAccountNumber('');
      setAmount('');
      
      // Callback to refresh parent component
      if (onTransferComplete) {
        onTransferComplete();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Transfer Funds</h3>
      
      <form onSubmit={handleTransfer} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Account
          </label>
          <input
            type="text"
            value={fromAccountNumber}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Account Number
          </label>
          <input
            type="text"
            value={toAccountNumber}
            onChange={(e) => setToAccountNumber(e.target.value)}
            placeholder="Enter recipient account number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50 transition font-medium"
        >
          {loading ? 'Processing...' : 'Transfer Funds'}
        </button>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-600 text-sm bg-green-50 p-3 rounded">
            {success}
          </div>
        )}
      </form>

      <div className="mt-4 p-3 bg-blue-50 rounded">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Transfer Guidelines:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Minimum transfer amount: $1.00</li>
          <li>• Maximum transfer amount: $10,000.00</li>
          <li>• Transfers are processed immediately</li>
          <li>• Please verify account number before transfer</li>
        </ul>
      </div>
    </div>
  );
} 