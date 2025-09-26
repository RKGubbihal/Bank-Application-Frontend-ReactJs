import axios from 'axios';
import { accountAPI } from '../../services/api';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAccount', () => {
    test('should create account successfully', async () => {
      const mockAccount = {
        accountHolderName: 'John Doe',
        accountBalance: 5000.0
      };
      const mockResponse = {
        data: {
          accountNumber: 1,
          accountHolderName: 'John Doe',
          accountBalance: 5000.0
        }
      };

      mockedAxios.create().post.mockResolvedValue(mockResponse);

      const result = await accountAPI.createAccount(mockAccount);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.create().post).toHaveBeenCalledWith('/account/create', mockAccount);
    });

    test('should handle create account error', async () => {
      const mockAccount = {
        accountHolderName: 'John Doe',
        accountBalance: 5000.0
      };
      const mockError = {
        response: {
          data: {
            message: 'Account creation failed'
          }
        }
      };

      mockedAxios.create().post.mockRejectedValue(mockError);

      await expect(accountAPI.createAccount(mockAccount)).rejects.toThrow('Account creation failed');
    });

    test('should handle network error', async () => {
      const mockAccount = {
        accountHolderName: 'John Doe',
        accountBalance: 5000.0
      };

      mockedAxios.create().post.mockRejectedValue(new Error('Network error'));

      await expect(accountAPI.createAccount(mockAccount)).rejects.toThrow('Failed to create account');
    });
  });

  describe('getAccountById', () => {
    test('should get account by ID successfully', async () => {
      const accountNumber = 1;
      const mockResponse = {
        data: {
          accountNumber: 1,
          accountHolderName: 'John Doe',
          accountBalance: 5000.0
        }
      };

      mockedAxios.create().get.mockResolvedValue(mockResponse);

      const result = await accountAPI.getAccountById(accountNumber);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.create().get).toHaveBeenCalledWith(`/account/${accountNumber}`);
    });

    test('should handle get account by ID error', async () => {
      const accountNumber = 999;
      const mockError = {
        response: {
          data: {
            message: 'Account not found'
          }
        }
      };

      mockedAxios.create().get.mockRejectedValue(mockError);

      await expect(accountAPI.getAccountById(accountNumber)).rejects.toThrow('Account not found');
    });
  });

  describe('getAllAccounts', () => {
    test('should get all accounts successfully', async () => {
      const mockResponse = {
        data: [
          {
            accountNumber: 1,
            accountHolderName: 'John Doe',
            accountBalance: 5000.0
          },
          {
            accountNumber: 2,
            accountHolderName: 'Jane Smith',
            accountBalance: 10000.0
          }
        ]
      };

      mockedAxios.create().get.mockResolvedValue(mockResponse);

      const result = await accountAPI.getAllAccounts();

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.create().get).toHaveBeenCalledWith('/account/all');
    });

    test('should handle get all accounts error', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Failed to fetch accounts'
          }
        }
      };

      mockedAxios.create().get.mockRejectedValue(mockError);

      await expect(accountAPI.getAllAccounts()).rejects.toThrow('Failed to fetch accounts');
    });
  });

  describe('depositAmount', () => {
    test('should deposit amount successfully', async () => {
      const accountNumber = 1;
      const amount = 1000.0;
      const mockResponse = {
        data: {
          accountNumber: 1,
          accountHolderName: 'John Doe',
          accountBalance: 6000.0
        }
      };

      mockedAxios.create().put.mockResolvedValue(mockResponse);

      const result = await accountAPI.depositAmount(accountNumber, amount);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.create().put).toHaveBeenCalledWith(`/account/deposit/${accountNumber}/${amount}`);
    });

    test('should handle deposit amount error', async () => {
      const accountNumber = 999;
      const amount = 1000.0;
      const mockError = {
        response: {
          data: {
            message: 'Account not found'
          }
        }
      };

      mockedAxios.create().put.mockRejectedValue(mockError);

      await expect(accountAPI.depositAmount(accountNumber, amount)).rejects.toThrow('Account not found');
    });
  });

  describe('withdrawAmount', () => {
    test('should withdraw amount successfully', async () => {
      const accountNumber = 1;
      const amount = 1000.0;
      const mockResponse = {
        data: {
          accountNumber: 1,
          accountHolderName: 'John Doe',
          accountBalance: 4000.0
        }
      };

      mockedAxios.create().put.mockResolvedValue(mockResponse);

      const result = await accountAPI.withdrawAmount(accountNumber, amount);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.create().put).toHaveBeenCalledWith(`/account/withdraw/${accountNumber}/${amount}`);
    });

    test('should handle withdraw amount error', async () => {
      const accountNumber = 999;
      const amount = 1000.0;
      const mockError = {
        response: {
          data: {
            message: 'Insufficient funds'
          }
        }
      };

      mockedAxios.create().put.mockRejectedValue(mockError);

      await expect(accountAPI.withdrawAmount(accountNumber, amount)).rejects.toThrow('Insufficient funds');
    });
  });

  describe('deleteAccount', () => {
    test('should delete account successfully', async () => {
      const accountNumber = 1;
      const mockResponse = {
        data: {
          message: 'Account deleted successfully'
        }
      };

      mockedAxios.create().delete.mockResolvedValue(mockResponse);

      const result = await accountAPI.deleteAccount(accountNumber);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.create().delete).toHaveBeenCalledWith(`/account/delete/${accountNumber}`);
    });

    test('should handle delete account error', async () => {
      const accountNumber = 999;
      const mockError = {
        response: {
          data: {
            message: 'Account not found'
          }
        }
      };

      mockedAxios.create().delete.mockRejectedValue(mockError);

      await expect(accountAPI.deleteAccount(accountNumber)).rejects.toThrow('Account not found');
    });
  });

  describe('API Configuration', () => {
    test('should have correct base URL', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'http://localhost:8080',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle error without response data', async () => {
      const mockError = new Error('Network error');
      mockedAxios.create().get.mockRejectedValue(mockError);

      await expect(accountAPI.getAllAccounts()).rejects.toThrow('Failed to fetch accounts');
    });

    test('should handle error with empty response data', async () => {
      const mockError = {
        response: {
          data: {}
        }
      };
      mockedAxios.create().get.mockRejectedValue(mockError);

      await expect(accountAPI.getAllAccounts()).rejects.toThrow('Failed to fetch accounts');
    });

    test('should handle error with null response', async () => {
      const mockError = {
        response: null
      };
      mockedAxios.create().get.mockRejectedValue(mockError);

      await expect(accountAPI.getAllAccounts()).rejects.toThrow('Failed to fetch accounts');
    });
  });

  describe('Edge Cases', () => {
    test('should handle very large account numbers', async () => {
      const largeAccountNumber = Number.MAX_SAFE_INTEGER;
      const mockResponse = { data: { accountNumber: largeAccountNumber } };

      mockedAxios.create().get.mockResolvedValue(mockResponse);

      const result = await accountAPI.getAccountById(largeAccountNumber);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.create().get).toHaveBeenCalledWith(`/account/${largeAccountNumber}`);
    });

    test('should handle very large amounts', async () => {
      const accountNumber = 1;
      const largeAmount = Number.MAX_SAFE_INTEGER;
      const mockResponse = { data: { accountBalance: largeAmount } };

      mockedAxios.create().put.mockResolvedValue(mockResponse);

      const result = await accountAPI.depositAmount(accountNumber, largeAmount);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.create().put).toHaveBeenCalledWith(`/account/deposit/${accountNumber}/${largeAmount}`);
    });

    test('should handle decimal amounts', async () => {
      const accountNumber = 1;
      const decimalAmount = 0.01;
      const mockResponse = { data: { accountBalance: 5000.01 } };

      mockedAxios.create().put.mockResolvedValue(mockResponse);

      const result = await accountAPI.depositAmount(accountNumber, decimalAmount);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.create().put).toHaveBeenCalledWith(`/account/deposit/${accountNumber}/${decimalAmount}`);
    });

    test('should handle zero amounts', async () => {
      const accountNumber = 1;
      const zeroAmount = 0;
      const mockResponse = { data: { accountBalance: 5000.0 } };

      mockedAxios.create().put.mockResolvedValue(mockResponse);

      const result = await accountAPI.depositAmount(accountNumber, zeroAmount);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.create().put).toHaveBeenCalledWith(`/account/deposit/${accountNumber}/${zeroAmount}`);
    });

    test('should handle negative amounts', async () => {
      const accountNumber = 1;
      const negativeAmount = -1000.0;
      const mockResponse = { data: { accountBalance: 4000.0 } };

      mockedAxios.create().put.mockResolvedValue(mockResponse);

      const result = await accountAPI.depositAmount(accountNumber, negativeAmount);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.create().put).toHaveBeenCalledWith(`/account/deposit/${accountNumber}/${negativeAmount}`);
    });
  });
});
