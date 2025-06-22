import axios from 'axios';
import { config, getApiUrl } from '../../config/environment';

// Configure axios defaults
axios.defaults.baseURL = config.API_BASE_URL;

// Add request interceptor to include JWT token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('bank_jwt');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('bank_jwt');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Types
export interface Account {
  id: number;
  accountNumber: string;
  accountType: 'SAVINGS' | 'CURRENT';
  balance: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: number;
  amount: number;
  transactionType: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  fromAccount?: string;
  toAccount?: string;
  timestamp: string;
  accountId: number;
}

export interface TransferRequest {
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: number;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: 'USER' | 'EMPLOYEE';
}

export interface Notification {
  id: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  timestamp: string;
  isRead: boolean;
}

export interface AccountApplication {
  id: number;
  userId: number;
  userEmail: string;
  userName: string;
  accountType: 'SAVINGS' | 'CURRENT';
  initialDeposit: number;
  purpose: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  employeeNotes?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateAccountApplicationRequest {
  accountType: 'SAVINGS' | 'CURRENT';
  initialDeposit: number;
  purpose: string;
}

export interface ApplicationDecisionRequest {
  applicationId: number;
  decision: 'APPROVED' | 'REJECTED';
  notes: string;
}

export interface TransactionResponse {
  success: boolean;
  data?: Transaction[];
  message?: string;
}

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    axios.post(getApiUrl(config.ENDPOINTS.AUTH + '/login'), { email, password }),
  
  register: (userData: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
  }) => axios.post(getApiUrl(config.ENDPOINTS.AUTH + '/register'), userData),
};

// Account API
export const accountAPI = {
  getAccounts: () => axios.get<Account[]>(getApiUrl(config.ENDPOINTS.ACCOUNTS)),
  
  getAccountByNumber: (accountNumber: string) =>
    axios.get<Account>(getApiUrl(`${config.ENDPOINTS.ACCOUNTS}/${accountNumber}`)),
  
  createAccount: (accountData: {
    accountType: 'SAVINGS' | 'CURRENT';
    userId: number;
  }) => axios.post<Account>(getApiUrl(config.ENDPOINTS.ACCOUNTS), accountData),
  
  updateAccount: (accountNumber: string, updates: Partial<Account>) =>
    axios.put<Account>(getApiUrl(`${config.ENDPOINTS.ACCOUNTS}/${accountNumber}`), updates),
};

// Transaction API
export const transactionAPI = {
  getTransactions: (accountNumber: string) =>
    axios.get<Transaction[]>(getApiUrl(`${config.ENDPOINTS.TRANSACTIONS}/${accountNumber}`)),
  
  getMiniStatement: (accountNumber: string) =>
    axios.get<Transaction[]>(getApiUrl(`${config.ENDPOINTS.TRANSACTIONS}/mini-statement/${accountNumber}`)),
  
  transferFunds: (transferData: TransferRequest) =>
    axios.post<Transaction>(getApiUrl(`${config.ENDPOINTS.TRANSACTIONS}/transfer`), transferData),
  
  deposit: (accountNumber: string, amount: number) =>
    axios.post<Transaction>(getApiUrl(`${config.ENDPOINTS.TRANSACTIONS}/deposit`), {
      accountNumber,
      amount,
    }),
  
  withdraw: (accountNumber: string, amount: number) =>
    axios.post<Transaction>(getApiUrl(`${config.ENDPOINTS.TRANSACTIONS}/withdraw`), {
      accountNumber,
      amount,
    }),
};

// User API (for employees)
export const userAPI = {
  getAllUsers: () => axios.get<User[]>(getApiUrl(config.ENDPOINTS.USERS)),
  
  getUserById: (userId: number) => axios.get<User>(getApiUrl(`${config.ENDPOINTS.USERS}/${userId}`)),
  
  updateUser: (userId: number, updates: Partial<User>) =>
    axios.put<User>(getApiUrl(`${config.ENDPOINTS.USERS}/${userId}`), updates),
  
  deactivateUser: (userId: number) =>
    axios.put(getApiUrl(`${config.ENDPOINTS.USERS}/${userId}/deactivate`)),
  
  createUserAccount: (userData: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    accountType: 'SAVINGS' | 'CURRENT';
  }) => axios.post(getApiUrl(config.ENDPOINTS.USERS), userData),
};

// Notification API
export const notificationAPI = {
  getNotifications: () => axios.get<Notification[]>(getApiUrl(config.ENDPOINTS.NOTIFICATIONS)),
  
  markAsRead: (notificationId: string) =>
    axios.put(getApiUrl(`${config.ENDPOINTS.NOTIFICATIONS}/${notificationId}/read`)),
  
  deleteNotification: (notificationId: string) =>
    axios.delete(getApiUrl(`${config.ENDPOINTS.NOTIFICATIONS}/${notificationId}`)),
};

// Employee API
export const employeeAPI = {
  getSystemStats: () => axios.get(getApiUrl(`${config.ENDPOINTS.EMPLOYEE}/stats`)),
  
  getAllAccounts: () => axios.get<Account[]>(getApiUrl(`${config.ENDPOINTS.EMPLOYEE}/accounts`)),
  
  getAllTransactions: () => axios.get<Transaction[]>(getApiUrl(`${config.ENDPOINTS.EMPLOYEE}/transactions`)),
  
  createUserAccount: (userData: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    accountType: 'SAVINGS' | 'CURRENT';
  }) => axios.post(getApiUrl(`${config.ENDPOINTS.EMPLOYEE}/users`), userData),
};

// Account Application API
export const applicationAPI = {
  createApplication: (applicationData: CreateAccountApplicationRequest) =>
    axios.post<AccountApplication>(getApiUrl('/applications'), applicationData),
  
  getAllApplications: () => axios.get<AccountApplication[]>(getApiUrl('/applications')),
  
  getPendingApplications: () => axios.get<AccountApplication[]>(getApiUrl('/applications/pending')),
  
  getMyApplications: () => axios.get<AccountApplication[]>(getApiUrl('/applications/my-applications')),
  
  processApplication: (decision: ApplicationDecisionRequest) =>
    axios.post<AccountApplication>(getApiUrl('/applications/process'), decision),
  
  getApplicationById: (id: number) => axios.get<AccountApplication>(getApiUrl(`/applications/${id}`)),
};

// Transaction Management APIs
export const getTransactions = async (): Promise<TransactionResponse> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${config.API_BASE_URL}/api/employee/transactions`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data as TransactionResponse;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return { success: false, data: [], message: 'Error fetching transactions' };
  }
};

export const searchTransactions = async (searchParams: any): Promise<TransactionResponse> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${config.API_BASE_URL}/api/employee/transactions/search`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: searchParams
    });
    return response.data as TransactionResponse;
  } catch (error) {
    console.error('Error searching transactions:', error);
    return { success: false, data: [], message: 'Error searching transactions' };
  }
};