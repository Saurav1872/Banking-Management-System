"use client";
import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('USER' | 'EMPLOYEE')[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  allowedRoles = ['USER', 'EMPLOYEE'],
  redirectTo = '/'
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (hasRedirected.current) return;

    // Not authenticated: redirect to login/home
    if (!isAuthenticated) {
      if (pathname !== redirectTo) {
        hasRedirected.current = true;
        router.replace(redirectTo);
      }
      return;
    }

    // Authenticated but not allowed: redirect to correct dashboard
    if (user && !allowedRoles.includes(user.role)) {
      if (user.role === 'EMPLOYEE' && pathname !== '/employee-dashboard') {
        hasRedirected.current = true;
        router.replace('/employee-dashboard');
      } else if (user.role === 'USER' && pathname !== '/user-dashboard') {
        hasRedirected.current = true;
        router.replace('/user-dashboard');
      }
      return;
    }
  }, [isAuthenticated, user, isLoading, allowedRoles, redirectTo, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-xl rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Only render children if authenticated and allowed
  if (isAuthenticated && user && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  // Otherwise, show a blank screen while redirecting
  return <div className="min-h-screen bg-gray-100" />;
}