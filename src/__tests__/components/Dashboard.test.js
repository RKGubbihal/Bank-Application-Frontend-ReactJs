import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../../components/Dashboard';
import { accountAPI } from '../../services/api';

// Mock the API service
jest.mock('../../services/api', () => ({
  accountAPI: {
    getAllAccounts: jest.fn()
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
  },
  {
    accountNumber: 3,
    accountHolderName: 'Bob Johnson',
    accountBalance: 7500.0
  }
];

const MockedDashboard = ({ user, onLogout }) => (
  <BrowserRouter>
    <Dashboard user={user} onLogout={onLogout} />
  </BrowserRouter>
);

describe('Dashboard Component', () => {
  const mockOnLogout = jest.fn();

  beforeEach(() => {
    mockOnLogout.mockClear();
    accountAPI.getAllAccounts.mockClear();
  });

  test('renders dashboard with user information', () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    
    render(<MockedDashboard user={mockUser} onLogout={mockOnLogout} />);
    
    expect(screen.getByText('🏦 Bank Management Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  test('displays loading state initially', () => {
    accountAPI.getAllAccounts.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<MockedDashboard user={mockUser} onLogout={mockOnLogout} />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays accounts overview after loading', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    
    render(<MockedDashboard user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      expect(screen.getByText('Total Accounts: 3')).toBeInTheDocument();
    });
  });

  test('displays recent accounts', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    
    render(<MockedDashboard user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      expect(screen.getByText('Recent Accounts')).toBeInTheDocument();
      expect(screen.getByText('Account #1')).toBeInTheDocument();
      expect(screen.getByText('Account #2')).toBeInTheDocument();
      expect(screen.getByText('Account #3')).toBeInTheDocument();
    });
  });

  test('handles empty accounts list', async () => {
    accountAPI.getAllAccounts.mockResolvedValue([]);
    
    render(<MockedDashboard user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      expect(screen.getByText('Total Accounts: 0')).toBeInTheDocument();
    });
  });

  test('handles API error gracefully', async () => {
    accountAPI.getAllAccounts.mockRejectedValue(new Error('API Error'));
    
    render(<MockedDashboard user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch accounts')).toBeInTheDocument();
    });
  });

  test('calls onLogout when logout button is clicked', () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    
    render(<MockedDashboard user={mockUser} onLogout={mockOnLogout} />);
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  test('displays quick action buttons', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    
    render(<MockedDashboard user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      expect(screen.getByText('View Accounts')).toBeInTheDocument();
      expect(screen.getByText('Transaction History')).toBeInTheDocument();
    });
  });

  test('displays dashboard cards with correct information', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    
    render(<MockedDashboard user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      expect(screen.getByText('📊 Account Overview')).toBeInTheDocument();
      expect(screen.getByText('💰 Quick Actions')).toBeInTheDocument();
      expect(screen.getByText('📈 Recent Activity')).toBeInTheDocument();
    });
  });

  test('shows account balances correctly', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    
    render(<MockedDashboard user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      expect(screen.getByText('$5000.00')).toBeInTheDocument();
      expect(screen.getByText('$10000.00')).toBeInTheDocument();
      expect(screen.getByText('$7500.00')).toBeInTheDocument();
    });
  });

  test('handles user with null values', () => {
    accountAPI.getAllAccounts.mockResolvedValue([]);
    const userWithNulls = { accountNumber: null, accountHolderName: null };
    
    render(<MockedDashboard user={userWithNulls} onLogout={mockOnLogout} />);
    
    expect(screen.getByText('Welcome, null')).toBeInTheDocument();
  });

  test('calls getAllAccounts API on component mount', () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    
    render(<MockedDashboard user={mockUser} onLogout={mockOnLogout} />);
    
    expect(accountAPI.getAllAccounts).toHaveBeenCalledTimes(1);
  });

  test('displays account holder names correctly', async () => {
    accountAPI.getAllAccounts.mockResolvedValue(mockAccounts);
    
    render(<MockedDashboard user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });
  });

  test('handles large number of accounts', async () => {
    const manyAccounts = Array.from({ length: 100 }, (_, i) => ({
      accountNumber: i + 1,
      accountHolderName: `User ${i + 1}`,
      accountBalance: (i + 1) * 100
    }));
    
    accountAPI.getAllAccounts.mockResolvedValue(manyAccounts);
    
    render(<MockedDashboard user={mockUser} onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      expect(screen.getByText('Total Accounts: 100')).toBeInTheDocument();
    });
  });
});
