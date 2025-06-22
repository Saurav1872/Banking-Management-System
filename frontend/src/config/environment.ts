// Environment Configuration
export const config = {
  // Backend Server Configuration
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
  
  // JWT Configuration
  JWT_STORAGE_KEY: process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || 'bank_jwt',
  
  // Application Configuration
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Banking Management System',
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  
  // Development Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: process.env.NEXT_PUBLIC_AUTH_ENDPOINT || '/auth',
    ACCOUNTS: process.env.NEXT_PUBLIC_ACCOUNTS_ENDPOINT || '/accounts',
    TRANSACTIONS: process.env.NEXT_PUBLIC_TRANSACTIONS_ENDPOINT || '/transactions',
    USERS: process.env.NEXT_PUBLIC_USERS_ENDPOINT || '/users',
    NOTIFICATIONS: process.env.NEXT_PUBLIC_NOTIFICATIONS_ENDPOINT || '/notifications',
    EMPLOYEE: process.env.NEXT_PUBLIC_EMPLOYEE_ENDPOINT || '/employee',
  },
  
  // Feature Flags
  FEATURES: {
    ENABLE_NOTIFICATIONS: true,
    ENABLE_FUND_TRANSFER: true,
    ENABLE_USER_MANAGEMENT: true,
    ENABLE_SYSTEM_STATS: true,
  },
  
  // UI Configuration
  UI: {
    ITEMS_PER_PAGE: 10,
    MAX_TRANSFER_AMOUNT: 10000,
    MIN_TRANSFER_AMOUNT: 1,
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${config.API_BASE_URL}${endpoint}`;
};

// Helper function to check if in development
export const isDevelopment = (): boolean => {
  return config.NODE_ENV === 'development';
};

// Helper function to check if in production
export const isProduction = (): boolean => {
  return config.NODE_ENV === 'production';
}; 