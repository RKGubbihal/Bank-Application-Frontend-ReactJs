import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AccountDetails from '../../components/AccountDetails';
import { accountAPI } from '../../services/api';

// Mock the API service
jest.mock('../../services/api', () => ({
  accountAPI: {
    getAllAccounts: jest.fn(),
    createAccount: jest.fn(),
    depositAmount: jest.fn(),
    withdrawAmount: jest.fn(),
    deleteAccount: jest.fn()
  }
}));

// Mock window.confirm
const mockConfirm = jest.fn();
Object.defineProperty(window, 'confirm', {
  value: mockConfirm,
  writable: true
});

// Mock window.prompt
const mockPrompt = jest.fn();
Object.defineProperty(window, 'prompt', {
  value: mockPrompt,
  writable: true
});

const mockUser = {
  accountNumber: '123',
  accountHolderName: 'John Doe'
};

const mockAccounts = [
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
];

const MockedAccountDetails = ({ user, onLogout }) => (
  <BrowserRouter>
    <AccountDetails user={user} onLogout={onLogout} />
  </BrowserRouter>
);

describe('AccountDetails Component', () => {
  const mockOnLogout = jest.fn();

  beforeEach(() => {
    mockOnLogout.mockClear();
    accountAPI.getAllAccounts.mockClear();
    accountAPI.createAccount.mockClear();
    accountAPI.depositAmount.mockClear();
    accountAPI.withdrawAmount.mockClear();
    accountAPI.deleteAccount.mockClear();
    mockConfirm.mockClear();
    mockPrompt.mockClear();
  });

  test('renders account details page correctly', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    
    render(<MockedAccountDetails user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      expect(screen.getByText('💳 Account Management')).toBeInTheDocument();
      expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });
  });

  test('displays loading state initially', () => {
    accountAPI.getAllAccounts.mockImplementation(() => new Promise(() => {}));
    
    render(<MockedAccountDetails user={mockUser} onLogout={mockOnLogout} />);
    
    expect(screen.getByText('Loading accounts...')).toBeInTheDocument();
  });

  test('displays all accounts after loading', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    
    render(<MockedAccountDetails user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      expect(screen.getByText('All Accounts (2)')).toBeInTheDocument();
      expect(screen.getByText('Account #1')).toBeInTheDocument();
      expect(screen.getByText('Account #2')).toBeInTheDocument();
    });
  });

  test('shows create account form when button is clicked', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    
    render(<MockedAccountDetails user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const createButton = screen.getByText('+ Create New Account');
      fireEvent.click(createButton);
      
      expect(screen.getByText('Create New Account')).toBeInTheDocument();
      expect(screen.getByLabelText('Account Holder Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Initial Balance')).toBeInTheDocument();
    });
  });

  test('creates new account successfully', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    accountAPI.createAccount.mockResolvedValue({
      accountNumber: 3,
      accountHolderName: 'New User',
      accountBalance: 1000.0
    });
    
    render(<MockedAccountDetails user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const createButton = screen.getByText('+ Create New Account');
      fireEvent.click(createButton);
    });
    
    const nameInput = screen.getByLabelText('Account Holder Name');
    const balanceInput = screen.getByLabelText('Initial Balance');
    const submitButton = screen.getByText('Create Account');
    
    fireEvent.change(nameInput, { target: { value: 'New User' } });
    fireEvent.change(balanceInput, { target: { value: '1000' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(accountAPI.createAccount).toHaveBeenCalledWith({
        accountHolderName: 'New User',
        accountBalance: 1000
      });
    });
  });

  test('handles deposit operation', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    accountAPI.depositAmount.mockResolvedValue({
      accountNumber: 1,
      accountHolderName: 'John Doe',
      accountBalance: 6000.0
    });
    mockPrompt.mockReturnValue('1000');
    
    render(<MockedAccountDetails user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const depositButton = screen.getAllByText('💰 Deposit')[0];
      fireEvent.click(depositButton);
    });
    
    expect(mockPrompt).toHaveBeenCalledWith('Enter deposit amount:');
    expect(accountAPI.depositAmount).toHaveBeenCalledWith(1, 1000);
  });

  test('handles withdrawal operation', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    accountAPI.withdrawAmount.mockResolvedValue({
      accountNumber: 1,
      accountHolderName: 'John Doe',
      accountBalance: 4000.0
    });
    mockPrompt.mockReturnValue('1000');
    
    render(<MockedAccountDetails user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const withdrawButton = screen.getAllByText('💸 Withdraw')[0];
      fireEvent.click(withdrawButton);
    });
    
    expect(mockPrompt).toHaveBeenCalledWith('Enter withdrawal amount:');
    expect(accountAPI.withdrawAmount).toHaveBeenCalledWith(1, 1000);
  });

  test('handles delete account with confirmation', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    accountAPI.deleteAccount.mockResolvedValue({ message: 'Account deleted' });
    mockConfirm.mockReturnValue(true);
    
    render(<MockedAccountDetails user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const deleteButton = screen.getAllByText('🗑️')[0];
      fireEvent.click(deleteButton);
    });
    
    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this account?');
    expect(accountAPI.deleteAccount).toHaveBeenCalledWith(1);
  });

  test('does not delete account when confirmation is cancelled', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    mockConfirm.mockReturnValue(false);
    
    render(<MockedAccountDetails user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const deleteButton = screen.getAllByText('🗑️')[0];
      fireEvent.click(deleteButton);
    });
    
    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this account?');
    expect(accountAPI.deleteAccount).not.toHaveBeenCalled();
  });

  test('handles API errors gracefully', async () => {
    accountAPI.getAllAccounts.mockRejectedValue(new Error('API Error'));
    
    render(<MockedAccountDetails user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch accounts')).toBeInTheDocument();
    });
  });

  test('handles create account error', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    accountAPI.createAccount.mockRejectedValue(new Error('Create failed'));
    
    render(<MockedAccountDetails user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const createButton = screen.getByText('+ Create New Account');
      fireEvent.click(createButton);
    });
    
    const nameInput = screen.getByLabelText('Account Holder Name');
    const balanceInput = screen.getByLabelText('Initial Balance');
    const submitButton = screen.getByText('Create Account');
    
    fireEvent.change(nameInput, { target: { value: 'New User' } });
    fireEvent.change(balanceInput, { target: { value: '1000' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to create account')).toBeInTheDocument();
    });
  });

  test('handles deposit error', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    accountAPI.depositAmount.mockRejectedValue(new Error('Deposit failed'));
    mockPrompt.mockReturnValue('1000');
    
    render(<MockedAccountDetails user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const depositButton = screen.getAllByText('💰 Deposit')[0];
      fireEvent.click(depositButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Failed to deposit amount')).toBeInTheDocument();
    });
  });

  test('handles withdrawal error', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    accountAPI.withdrawAmount.mockRejectedValue(new Error('Withdrawal failed'));
    mockPrompt.mockReturnValue('1000');
    
    render(<MockedAccountDetails user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const withdrawButton = screen.getAllByText('💸 Withdraw')[0];
      fireEvent.click(withdrawButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Failed to withdraw amount')).toBeInTheDocument();
    });
  });

  test('handles delete account error', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    accountAPI.deleteAccount.mockRejectedValue(new Error('Delete failed'));
    mockConfirm.mockReturnValue(true);
    
    render(<MockedAccountDetails user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const deleteButton = screen.getAllByText('🗑️')[0];
      fireEvent.click(deleteButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Failed to delete account')).toBeInTheDocument();
    });
  });

  test('displays no accounts message when list is empty', async () => {
    accountAPI.getAllAccounts.mockResolvedValue([]);
    
    render(<MockedAccountDetails user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      expect(screen.getByText('No accounts found. Create your first account!')).toBeInTheDocument();
    });
  });

  test('handles invalid prompt input for deposit', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    mockPrompt.mockReturnValue('invalid');
    
    render(<MockedAccountDetails user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const depositButton = screen.getAllByText('💰 Deposit')[0];
      fireEvent.click(depositButton);
    });
    
    expect(accountAPI.depositAmount).not.toHaveBeenCalled();
  });

  test('handles invalid prompt input for withdrawal', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    mockPrompt.mockReturnValue('invalid');
    
    render(<MockedAccountDetails user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const withdrawButton = screen.getAllByText('💸 Withdraw')[0];
      fireEvent.click(withdrawButton);
    });
    
    expect(accountAPI.withdrawAmount).not.toHaveBeenCalled();
  });

  test('handles null prompt input', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    mockPrompt.mockReturnValue(null);
    
    render(<MockedAccountDetails user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const depositButton = screen.getAllByText('💰 Deposit')[0];
      fireEvent.click(depositButton);
    });
    
    expect(accountAPI.depositAmount).not.toHaveBeenCalled();
  });

  test('displays account balances correctly', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    
    render(<MockedAccountDetails user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      expect(screen.getByText('$5000.00')).toBeInTheDocument();
      expect(screen.getByText('$10000.00')).toBeInTheDocument();
    });
  });

  test('calls onLogout when logout button is clicked', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    
    render(<MockedAccountDetails user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const logoutButton = screen.getByRole('button', { name: /logout/i });
      fireEvent.click(logoutButton);
    });
    
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });
});
