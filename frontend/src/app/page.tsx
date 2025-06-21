"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./contexts/AuthContext";

export default function Home() {
  const [panel, setPanel] = useState<"employee" | "user" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'EMPLOYEE') {
        router.push('/employee-dashboard');
      } else {
        router.push('/user-dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    try {
      await login(email, password);
      setSuccess("Login successful! Redirecting...");
      
      // The redirect will be handled by the useEffect above
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Show loading if checking authentication
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-xl rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (!panel) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex gap-12">
          <div
            className="bg-white shadow-lg rounded-lg p-8 w-72 cursor-pointer hover:ring-2 ring-blue-500 transition"
            onClick={() => setPanel("employee")}
          >
            <h2 className="text-2xl font-bold mb-2 text-blue-700">Employee Login</h2>
            <p className="text-gray-500">For bank staff and admins</p>
          </div>
          <div
            className="bg-white shadow-lg rounded-lg p-8 w-72 cursor-pointer hover:ring-2 ring-green-500 transition"
            onClick={() => setPanel("user")}
          >
            <h2 className="text-2xl font-bold mb-2 text-green-700">User Login</h2>
            <p className="text-gray-500">For account holders</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-lg p-8 w-96">
        <button
          className="mb-4 text-blue-500 hover:underline"
          onClick={() => setPanel(null)}
        >
          &larr; Back
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">
          {panel === "employee" ? "Employee Login" : "User Login"}
        </h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 font-medium"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
        </form>
      </div>
    </main>
  );
}
