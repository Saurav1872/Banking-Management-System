"use client";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { accountAPI, Account } from "../services/api";
import AccountOverview from "../components/AccountOverview";
import TransactionHistory from "../components/TransactionHistory";
import FundTransfer from "../components/FundTransfer";
import Notifications from "../components/Notifications";
import AccountApplication from "../components/AccountApplication";
import MyApplications from "../components/MyApplications";

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await accountAPI.getAccounts();
        setAccounts(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load accounts");
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Get the primary account (first one)
  const primaryAccount = accounts[0];

  // Show loading if user is not available yet
  if (!user) {
    return (
      <ProtectedRoute allowedRoles={["USER"]}>
        <main className="min-h-screen bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-500">Loading user data...</div>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            {loading ? (
              <div className="text-center text-gray-500">Loading account data...</div>
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : !primaryAccount ? (
              <div className="text-center text-gray-500">No accounts found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Account Overview Card */}
                <AccountOverview />

                {/* Fund Transfer Card */}
                <FundTransfer fromAccountNumber={primaryAccount.accountNumber} onTransferComplete={() => {}} />

                {/* Recent Activity Card */}
                <TransactionHistory accountNumber={primaryAccount.accountNumber} />
              </div>
            )}

            {/* Notifications Section */}
            <div className="mt-8">
              <Notifications />
            </div>
          </>
        );
      case 'apply':
        return (
          <div className="max-w-2xl mx-auto">
            <AccountApplication />
          </div>
        );
      case 'applications':
        return <MyApplications />;
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute allowedRoles={["USER"]}>
      <main className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user.fullName}</p>
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
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('apply')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'apply'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Apply for Account
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'applications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Applications
              </button>
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