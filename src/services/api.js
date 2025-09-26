import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.');
    }
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      if (status === 404) {
        throw new Error('Service not found. Please check if the backend is running.');
      } else if (status === 500) {
        throw new Error('Server error. Please try again later.');
      } else if (status >= 400 && status < 500) {
        throw new Error(error.response.data?.message || 'Client error occurred.');
      }
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection and ensure the backend is running.');
    } else {
      throw new Error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

// Fallback data for when backend is not available
const fallbackAccounts = [
  {
    accountNumber: 1,
    accountHolderName: "Demo User",
    accountBalance: 5000.0
  },
  {
    accountNumber: 2,
    accountHolderName: "Test Account",
    accountBalance: 2500.0
  }
];

// Check if backend is available
const isBackendAvailable = async () => {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    return false;
  }
};

// Account API calls
export const accountAPI = {
  // Create a new account
  createAccount: async (accountData) => {
    try {
      const response = await api.post('/account/create', accountData);
      return response.data;
    } catch (error) {
      // If backend is not available, simulate success
      if (!(await isBackendAvailable())) {
        console.warn('Backend not available, using fallback mode');
        const newAccount = {
          accountNumber: Date.now(),
          accountHolderName: accountData.accountHolderName,
          accountBalance: accountData.accountBalance
        };
        return newAccount;
      }
      throw error;
    }
  },

  // Get account by ID
  getAccountById: async (accountNumber) => {
    try {
      const response = await api.get(`/account/${accountNumber}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch account details');
    }
  },

  // Get all accounts
  getAllAccounts: async () => {
    try {
      const response = await api.get('/account/all');
      return response.data;
    } catch (error) {
      // If backend is not available, return fallback data
      if (!(await isBackendAvailable())) {
        console.warn('Backend not available, using fallback data');
        return fallbackAccounts;
      }
      throw error;
    }
  },

  // Deposit amount
  depositAmount: async (accountNumber, amount) => {
    try {
      const response = await api.put(`/account/deposit/${accountNumber}/${amount}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to deposit amount');
    }
  },

  // Withdraw amount
  withdrawAmount: async (accountNumber, amount) => {
    try {
      const response = await api.put(`/account/withdraw/${accountNumber}/${amount}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to withdraw amount');
    }
  },

  // Delete account
  deleteAccount: async (accountNumber) => {
    try {
      const response = await api.delete(`/account/delete/${accountNumber}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete account');
    }
  },
};

export default api;
