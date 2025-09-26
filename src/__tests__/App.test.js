import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock the API service
jest.mock('../services/api', () => ({
  accountAPI: {
    createAccount: jest.fn(),
    getAccountById: jest.fn(),
    getAllAccounts: jest.fn(),
    depositAmount: jest.fn(),
    withdrawAmount: jest.fn(),
    deleteAccount: jest.fn()
  }
}));

const MockedApp = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

describe('App Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders login page by default', () => {
    render(<MockedApp />);
    
    expect(screen.getByText('🏦 Bank Management System')).toBeInTheDocument();
    expect(screen.getByText('Welcome to your secure banking portal')).toBeInTheDocument();
    expect(screen.getByLabelText('Account Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Account Holder Name')).toBeInTheDocument();
  });

  test('redirects to dashboard after successful login', async () => {
    render(<MockedApp />);
    
    const accountNumberInput = screen.getByLabelText('Account Number');
    const accountHolderNameInput = screen.getByLabelText('Account Holder Name');
    const loginButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(accountNumberInput, { target: { value: '123' } });
    fireEvent.change(accountHolderNameInput, { target: { value: 'John Doe' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('🏦 Bank Management Dashboard')).toBeInTheDocument();
    });
  });

  test('shows error message for empty login fields', async () => {
    render(<MockedApp />);
    
    const loginButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
    });
  });

  test('redirects to login when accessing protected routes without authentication', () => {
    render(<MockedApp />);
    
    // Try to access dashboard directly
    window.history.pushState({}, '', '/dashboard');
    render(<MockedApp />);
    
    expect(screen.getByText('🏦 Bank Management System')).toBeInTheDocument();
  });

  test('maintains authentication state across navigation', async () => {
    render(<MockedApp />);
    
    // Login first
    const accountNumberInput = screen.getByLabelText('Account Number');
    const accountHolderNameInput = screen.getByLabelText('Account Holder Name');
    const loginButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(accountNumberInput, { target: { value: '123' } });
    fireEvent.change(accountHolderNameInput, { target: { value: 'John Doe' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('🏦 Bank Management Dashboard')).toBeInTheDocument();
    });

    // Navigate to accounts page
    const accountsLink = screen.getByText('View All Accounts →');
    fireEvent.click(accountsLink);

    await waitFor(() => {
      expect(screen.getByText('💳 Account Management')).toBeInTheDocument();
    });
  });

  test('handles logout functionality', async () => {
    render(<MockedApp />);
    
    // Login first
    const accountNumberInput = screen.getByLabelText('Account Number');
    const accountHolderNameInput = screen.getByLabelText('Account Holder Name');
    const loginButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(accountNumberInput, { target: { value: '123' } });
    fireEvent.change(accountHolderNameInput, { target: { value: 'John Doe' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('🏦 Bank Management Dashboard')).toBeInTheDocument();
    });

    // Click logout
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(screen.getByText('🏦 Bank Management System')).toBeInTheDocument();
    });
  });
});
