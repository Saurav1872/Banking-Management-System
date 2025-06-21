"use client";
import { useState, useEffect } from 'react';
import { transactionAPI, Transaction } from '../services/api';

interface TransactionHistoryProps {
  accountNumber: string;
}

export default function TransactionHistory({ accountNumber }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await transactionAPI.getMiniStatement(accountNumber);
        setTransactions(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    if (accountNumber) {
      fetchTransactions();
    }
  }, [accountNumber]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return '💰';
      case 'WITHDRAWAL':
        return '💸';
      case 'TRANSFER':
        return '🔄';
      default:
        return '📊';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return 'text-green-600';
      case 'WITHDRAWAL':
        return 'text-red-600';
      case 'TRANSFER':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-red-600 text-sm">{error}</div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-gray-500 text-sm">No recent transactions</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {transactions.slice(0, 5).map((transaction) => (
          <div key={transaction.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl">{getTransactionIcon(transaction.transactionType)}</div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900 capitalize">
                    {transaction.transactionType.toLowerCase()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(transaction.timestamp)}
                  </p>
                  {transaction.transactionType === 'TRANSFER' && (
                    <p className="text-xs text-gray-400">
                      {transaction.fromAccount === accountNumber 
                        ? `To: ${transaction.toAccount}` 
                        : `From: ${transaction.fromAccount}`}
                    </p>
                  )}
                </div>
                <div className={`font-semibold ${getTransactionColor(transaction.transactionType)}`}>
                  {transaction.transactionType === 'WITHDRAWAL' || 
                   (transaction.transactionType === 'TRANSFER' && transaction.fromAccount === accountNumber)
                    ? '-'
                    : '+'
                  }${transaction.amount.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {transactions.length > 5 && (
        <div className="mt-4 pt-4 border-t">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All Transactions →
          </button>
        </div>
      )}
    </div>
  );
} 