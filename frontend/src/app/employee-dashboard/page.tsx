"use client";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SystemOverview from "../components/SystemOverview";
import UserManagement from "../components/UserManagement";
import AccountApplicationManagement from "../components/AccountApplicationManagement";
import TransactionManagement from "../components/TransactionManagement";

export default function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'applications' | 'transactions'>('overview');

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <SystemOverview />;
      case 'users':
        return <UserManagement />;
      case 'applications':
        return <AccountApplicationManagement />;
      case 'transactions':
        return <TransactionManagement />;
      default:
        return <SystemOverview />;
    }
  };

  return (
    <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
      <main className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.fullName}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'System Overview', icon: '📊' },
                { id: 'users', label: 'User Management', icon: '👥' },
                { id: 'applications', label: 'Account Applications', icon: '📝' },
                { id: 'transactions', label: 'Transactions', icon: '💳' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderTabContent()}
        </div>
      </main>
    </ProtectedRoute>
  );
} 