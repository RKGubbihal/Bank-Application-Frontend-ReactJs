// Mock API responses for testing
export const mockAccounts = [
  {
    accountNumber: 1,
    accountHolderName: "John Doe",
    accountBalance: 5000.0
  },
  {
    accountNumber: 2,
    accountHolderName: "Jane Smith",
    accountBalance: 10000.0
  },
  {
    accountNumber: 3,
    accountHolderName: "Bob Johnson",
    accountBalance: 7500.0
  }
];

export const mockAccount = {
  accountNumber: 1,
  accountHolderName: "John Doe",
  accountBalance: 5000.0
};

export const mockTransactions = [
  {
    id: 1,
    type: "Deposit",
    amount: 1000,
    date: "2024-01-15T10:30:00Z",
    description: "Initial deposit"
  },
  {
    id: 2,
    type: "Withdrawal",
    amount: 500,
    date: "2024-01-16T14:20:00Z",
    description: "ATM withdrawal"
  },
  {
    id: 3,
    type: "Deposit",
    amount: 2000,
    date: "2024-01-17T09:15:00Z",
    description: "Salary deposit"
  }
];

// Mock API functions
export const mockAccountAPI = {
  createAccount: jest.fn(),
  getAccountById: jest.fn(),
  getAllAccounts: jest.fn(),
  depositAmount: jest.fn(),
  withdrawAmount: jest.fn(),
  deleteAccount: jest.fn()
};

// Setup default mock implementations
mockAccountAPI.createAccount.mockResolvedValue(mockAccount);
mockAccountAPI.getAccountById.mockResolvedValue(mockAccount);
mockAccountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
mockAccountAPI.depositAmount.mockResolvedValue({ ...mockAccount, accountBalance: 6000.0 });
mockAccountAPI.withdrawAmount.mockResolvedValue({ ...mockAccount, accountBalance: 4000.0 });
mockAccountAPI.deleteAccount.mockResolvedValue({ message: "Account deleted successfully" });

export default mockAccountAPI;
