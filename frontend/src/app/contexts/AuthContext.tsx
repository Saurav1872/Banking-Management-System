"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { config } from '../../config/environment';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'USER' | 'EMPLOYEE';
}

interface LoginResponse {
  accessToken: string;
  tokenType: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Decode JWT token to extract user information
  const decodeJWT = (token: string): any => {
    try {
      const payload = token.split(".")[1];
      
      // Add proper base64 padding
      let paddedPayload = payload;
      while (paddedPayload.length % 4 !== 0) {
        paddedPayload += '=';
      }
      
      const decoded = JSON.parse(atob(paddedPayload));
      return decoded;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem(config.JWT_STORAGE_KEY);
    if (storedToken) {
      const decoded = decodeJWT(storedToken);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setToken(storedToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        const userInfo: User = {
          id: decoded.sub || 'user@example.com',
          email: decoded.sub || 'user@example.com',
          fullName: decoded.name || 'User',
          role: (decoded.role || 'USER') as 'USER' | 'EMPLOYEE'
        };
        setUser(userInfo);
      } else {
        // Token expired or invalid
        localStorage.removeItem(config.JWT_STORAGE_KEY);
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
      }
    } else {
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email, password });
      console.log('API URL:', `${config.API_BASE_URL}/auth/login`);
      
      const response = await axios.post<LoginResponse>(`${config.API_BASE_URL}/auth/login`, {
        email,
        password
      });

      console.log('Login response:', response.data);

      const { accessToken } = response.data;
      const decoded = decodeJWT(accessToken);

      console.log('Decoded token:', decoded);

      if (!decoded) {
        throw new Error('Failed to decode JWT token');
      }

      // Store token
      localStorage.setItem(config.JWT_STORAGE_KEY, accessToken);
      setToken(accessToken);
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      // Create user object from token data
      const userInfo: User = {
        id: decoded.sub || email,
        email: decoded.sub || email,
        fullName: decoded.name || email,
        role: (decoded.role || 'USER') as 'USER' | 'EMPLOYEE'
      };
      
      console.log('Setting user:', userInfo);
      setUser(userInfo);
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem(config.JWT_STORAGE_KEY);
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 