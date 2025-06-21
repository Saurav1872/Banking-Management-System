"use client";
import { useState, useEffect } from 'react';
import { applicationAPI, AccountApplication, ApplicationDecisionRequest } from '../services/api';

export default function AccountApplicationManagement() {
  const [applications, setApplications] = useState<AccountApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<AccountApplication | null>(null);
  const [decision, setDecision] = useState<ApplicationDecisionRequest>({
    applicationId: 0,
    decision: 'APPROVED',
    notes: ''
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationAPI.getPendingApplications();
      setApplications(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessApplication = async () => {
    if (!selectedApplication) return;

    try {
      decision.applicationId = selectedApplication.id;
      await applicationAPI.processApplication(decision);
      setSelectedApplication(null);
      setDecision({ applicationId: 0, decision: 'APPROVED', notes: '' });
      fetchApplications(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process application');
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Applications</h3>
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
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Applications</h3>
      
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="text-gray-500 text-center py-8">No pending applications</div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{application.userName}</h4>
                  <p className="text-sm text-gray-500">{application.userEmail}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(application.status)}`}>
                  {application.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Account Type:</span>
                  <p className="font-medium">{application.accountType}</p>
                </div>
                <div>
                  <span className="text-gray-600">Initial Deposit:</span>
                  <p className="font-medium">${application.initialDeposit.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Applied:</span>
                  <p className="font-medium">{formatDate(application.createdAt)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Purpose:</span>
                  <p className="font-medium truncate">{application.purpose}</p>
                </div>
              </div>
              
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => setSelectedApplication(application)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Process Application
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Decision Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Process Application - {selectedApplication.userName}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Decision
                </label>
                <select
                  value={decision.decision}
                  onChange={(e) => setDecision({...decision, decision: e.target.value as 'APPROVED' | 'REJECTED'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="APPROVED">Approve</option>
                  <option value="REJECTED">Reject</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={decision.notes}
                  onChange={(e) => setDecision({...decision, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Add notes about your decision..."
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedApplication(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessApplication}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Submit Decision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 