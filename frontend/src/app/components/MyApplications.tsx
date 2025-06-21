"use client";
import { useState, useEffect } from 'react';
import { applicationAPI, AccountApplication } from '../services/api';

export default function MyApplications() {
  const [applications, setApplications] = useState<AccountApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationAPI.getMyApplications();
      setApplications(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '⏳';
      case 'APPROVED':
        return '✅';
      case 'REJECTED':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Applications</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">My Applications</h3>
      
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          <p>No applications found.</p>
          <p className="text-sm mt-2">Apply for a new account to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getStatusIcon(application.status)}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {application.accountType} Account Application
                    </h4>
                    <p className="text-sm text-gray-500">
                      Applied on {formatDate(application.createdAt)}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(application.status)}`}>
                  {application.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                <div>
                  <span className="text-gray-600">Account Type:</span>
                  <p className="font-medium">{application.accountType}</p>
                </div>
                <div>
                  <span className="text-gray-600">Initial Deposit:</span>
                  <p className="font-medium">${application.initialDeposit.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Purpose:</span>
                  <p className="font-medium">{application.purpose}</p>
                </div>
              </div>
              
              {application.employeeNotes && (
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">Employee Notes:</span>
                  <p className="text-sm text-gray-600 mt-1">{application.employeeNotes}</p>
                </div>
              )}
              
              {application.approvedBy && (
                <div className="mt-2 text-xs text-gray-500">
                  Processed by: {application.approvedBy}
                  {application.updatedAt && ` on ${formatDate(application.updatedAt)}`}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 