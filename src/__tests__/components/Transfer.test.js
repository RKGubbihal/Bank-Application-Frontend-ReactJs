import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Transfer from '../../components/Transfer';
import { accountAPI } from '../../services/api';

// Mock the API service
jest.mock('../../services/api', () => ({
  accountAPI: {
    getAllAccounts: jest.fn(),
    depositAmount: jest.fn(),
    withdrawAmount: jest.fn()
  }
}));

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

const MockedTransfer = ({ user, onLogout }) => (
  <BrowserRouter>
    <Transfer user={user} onLogout={onLogout} />
  </BrowserRouter>
);

describe('Transfer Component', () => {
  const mockOnLogout = jest.fn();

  beforeEach(() => {
    mockOnLogout.mockClear();
    accountAPI.getAllAccounts.mockClear();
    accountAPI.depositAmount.mockClear();
    accountAPI.withdrawAmount.mockClear();
  });

  test('renders transfer page correctly', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    
    render(<MockedTransfer user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      expect(screen.getByText('💸 Transfer Funds')).toBeInTheDocument();
      expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });
  });

  test('displays loading state initially', () => {
    accountAPI.getAllAccounts.mockImplementation(() => new Promise(() => {}));
    
    render(<MockedTransfer user={mockUser} onLogout={mockOnLogout} />);
    
    expect(screen.getByText('Loading accounts...')).toBeInTheDocument();
  });

  test('shows insufficient accounts message when less than 2 accounts', async () => {
    accountAPI.getAllAccounts.mockResolvedValue([mockAccounts[0]]);
    
    render(<MockedTransfer user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      expect(screen.getByText('Insufficient Accounts for Transfer')).toBeInTheDocument();
      expect(screen.getByText('You need at least 2 accounts to perform transfers.')).toBeInTheDocument();
      expect(screen.getByText('Current accounts: 1')).toBeInTheDocument();
    });
  });

  test('displays transfer form when sufficient accounts exist', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    
    render(<MockedTransfer user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      expect(screen.getByText('Transfer Funds Between Accounts')).toBeInTheDocument();
      expect(screen.getByLabelText('From Account')).toBeInTheDocument();
      expect(screen.getByLabelText('To Account')).toBeInTheDocument();
      expect(screen.getByLabelText('Transfer Amount')).toBeInTheDocument();
    });
  });

  test('populates account dropdowns with correct options', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    
    render(<MockedTransfer user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const fromAccountSelect = screen.getByLabelText('From Account');
      const toAccountSelect = screen.getByLabelText('To Account');
      
      expect(fromAccountSelect).toBeInTheDocument();
      expect(toAccountSelect).toBeInTheDocument();
      
      // Check that options are populated
      expect(screen.getByText('Account #1 - John Doe ($5000.00)')).toBeInTheDocument();
      expect(screen.getByText('Account #2 - Jane Smith ($10000.00)')).toBeInTheDocument();
    });
  });

  test('handles successful transfer', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    accountAPI.withdrawAmount.mockResolvedValue({ ...mockAccounts[0], accountBalance: 4000.0 });
    accountAPI.depositAmount.mockResolvedValue({ ...mockAccounts[1], accountBalance: 11000.0 });
    
    render(<MockedTransfer user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const fromAccountSelect = screen.getByLabelText('From Account');
      const toAccountSelect = screen.getByLabelText('To Account');
      const amountInput = screen.getByLabelText('Transfer Amount');
      const transferButton = screen.getByRole('button', { name: /transfer funds/i });
      
      fireEvent.change(fromAccountSelect, { target: { value: '1' } });
      fireEvent.change(toAccountSelect, { target: { value: '2' } });
      fireEvent.change(amountInput, { target: { value: '1000' } });
      fireEvent.click(transferButton);
    });
    
    await waitFor(() => {
      expect(accountAPI.withdrawAmount).toHaveBeenCalledWith(1, 1000);
      expect(accountAPI.depositAmount).toHaveBeenCalledWith(2, 1000);
      expect(screen.getByText('Successfully transferred $1000.00 from Account #1 to Account #2')).toBeInTheDocument();
    });
  });

  test('shows error for empty form submission', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    
    render(<MockedTransfer user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const transferButton = screen.getByRole('button', { name: /transfer funds/i });
      fireEvent.click(transferButton);
      
      expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
    });
  });

  test('shows error for transferring to same account', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    
    render(<MockedTransfer user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const fromAccountSelect = screen.getByLabelText('From Account');
      const toAccountSelect = screen.getByLabelText('To Account');
      const amountInput = screen.getByLabelText('Transfer Amount');
      const transferButton = screen.getByRole('button', { name: /transfer funds/i });
      
      fireEvent.change(fromAccountSelect, { target: { value: '1' } });
      fireEvent.change(toAccountSelect, { target: { value: '1' } });
      fireEvent.change(amountInput, { target: { value: '1000' } });
      fireEvent.click(transferButton);
      
      expect(screen.getByText('Cannot transfer to the same account')).toBeInTheDocument();
    });
  });

  test('shows error for invalid amount', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    
    render(<MockedTransfer user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const fromAccountSelect = screen.getByLabelText('From Account');
      const toAccountSelect = screen.getByLabelText('To Account');
      const amountInput = screen.getByLabelText('Transfer Amount');
      const transferButton = screen.getByRole('button', { name: /transfer funds/i });
      
      fireEvent.change(fromAccountSelect, { target: { value: '1' } });
      fireEvent.change(toAccountSelect, { target: { value: '2' } });
      fireEvent.change(amountInput, { target: { value: 'invalid' } });
      fireEvent.click(transferButton);
      
      expect(screen.getByText('Please enter a valid amount')).toBeInTheDocument();
    });
  });

  test('shows error for negative amount', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    
    render(<MockedTransfer user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const fromAccountSelect = screen.getByLabelText('From Account');
      const toAccountSelect = screen.getByLabelText('To Account');
      const amountInput = screen.getByLabelText('Transfer Amount');
      const transferButton = screen.getByRole('button', { name: /transfer funds/i });
      
      fireEvent.change(fromAccountSelect, { target: { value: '1' } });
      fireEvent.change(toAccountSelect, { target: { value: '2' } });
      fireEvent.change(amountInput, { target: { value: '-1000' } });
      fireEvent.click(transferButton);
      
      expect(screen.getByText('Please enter a valid amount')).toBeInTheDocument();
    });
  });

  test('shows error for zero amount', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    
    render(<MockedTransfer user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const fromAccountSelect = screen.getByLabelText('From Account');
      const toAccountSelect = screen.getByLabelText('To Account');
      const amountInput = screen.getByLabelText('Transfer Amount');
      const transferButton = screen.getByRole('button', { name: /transfer funds/i });
      
      fireEvent.change(fromAccountSelect, { target: { value: '1' } });
      fireEvent.change(toAccountSelect, { target: { value: '2' } });
      fireEvent.change(amountInput, { target: { value: '0' } });
      fireEvent.click(transferButton);
      
      expect(screen.getByText('Please enter a valid amount')).toBeInTheDocument();
    });
  });

  test('handles transfer API error', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    accountAPI.withdrawAmount.mockRejectedValue(new Error('Transfer failed'));
    
    render(<MockedTransfer user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const fromAccountSelect = screen.getByLabelText('From Account');
      const toAccountSelect = screen.getByLabelText('To Account');
      const amountInput = screen.getByLabelText('Transfer Amount');
      const transferButton = screen.getByRole('button', { name: /transfer funds/i });
      
      fireEvent.change(fromAccountSelect, { target: { value: '1' } });
      fireEvent.change(toAccountSelect, { target: { value: '2' } });
      fireEvent.change(amountInput, { target: { value: '1000' } });
      fireEvent.click(transferButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Transfer failed. Please check account balances and try again.')).toBeInTheDocument();
    });
  });

  test('handles API error when fetching accounts', async () => {
    accountAPI.getAllAccounts.mockRejectedValue(new Error('API Error'));
    
    render(<MockedTransfer user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch accounts')).toBeInTheDocument();
    });
  });

  test('filters destination accounts based on source account selection', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    
    render(<MockedTransfer user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const fromAccountSelect = screen.getByLabelText('From Account');
      fireEvent.change(fromAccountSelect, { target: { value: '1' } });
      
      // Check that destination dropdown doesn't include the selected source account
      const toAccountSelect = screen.getByLabelText('To Account');
      const options = Array.from(toAccountSelect.options).map(option => option.value);
      expect(options).not.toContain('1');
      expect(options).toContain('2');
    });
  });

  test('clears form after successful transfer', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    accountAPI.withdrawAmount.mockResolvedValue({ ...mockAccounts[0], accountBalance: 4000.0 });
    accountAPI.depositAmount.mockResolvedValue({ ...mockAccounts[1], accountBalance: 11000.0 });
    
    render(<MockedTransfer user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const fromAccountSelect = screen.getByLabelText('From Account');
      const toAccountSelect = screen.getByLabelText('To Account');
      const amountInput = screen.getByLabelText('Transfer Amount');
      const transferButton = screen.getByRole('button', { name: /transfer funds/i });
      
      fireEvent.change(fromAccountSelect, { target: { value: '1' } });
      fireEvent.change(toAccountSelect, { target: { value: '2' } });
      fireEvent.change(amountInput, { target: { value: '1000' } });
      fireEvent.click(transferButton);
    });
    
    await waitFor(() => {
      expect(fromAccountSelect.value).toBe('');
      expect(toAccountSelect.value).toBe('');
      expect(amountInput.value).toBe('');
    });
  });

  test('displays account overview correctly', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    
    render(<MockedTransfer user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      expect(screen.getByText('Your Accounts')).toBeInTheDocument();
      expect(screen.getByText('Account #1')).toBeInTheDocument();
      expect(screen.getByText('Account #2')).toBeInTheDocument();
      expect(screen.getByText('$5000.00')).toBeInTheDocument();
      expect(screen.getByText('$10000.00')).toBeInTheDocument();
    });
  });

  test('handles decimal amounts correctly', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    accountAPI.withdrawAmount.mockResolvedValue({ ...mockAccounts[0], accountBalance: 4999.99 });
    accountAPI.depositAmount.mockResolvedValue({ ...mockAccounts[1], accountBalance: 10000.01 });
    
    render(<MockedTransfer user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const fromAccountSelect = screen.getByLabelText('From Account');
      const toAccountSelect = screen.getByLabelText('To Account');
      const amountInput = screen.getByLabelText('Transfer Amount');
      const transferButton = screen.getByRole('button', { name: /transfer funds/i });
      
      fireEvent.change(fromAccountSelect, { target: { value: '1' } });
      fireEvent.change(toAccountSelect, { target: { value: '2' } });
      fireEvent.change(amountInput, { target: { value: '0.01' } });
      fireEvent.click(transferButton);
    });
    
    await waitFor(() => {
      expect(accountAPI.withdrawAmount).toHaveBeenCalledWith(1, 0.01);
      expect(accountAPI.depositAmount).toHaveBeenCalledWith(2, 0.01);
    });
  });

  test('calls onLogout when logout button is clicked', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    
    render(<MockedTransfer user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      const logoutButton = screen.getByRole('button', { name: /logout/i });
      fireEvent.click(logoutButton);
    });
    
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });
});
