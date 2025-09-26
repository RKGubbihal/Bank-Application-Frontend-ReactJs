import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../components/Login';

const MockedLogin = ({ onLogin }) => (
  <BrowserRouter>
    <Login onLogin={onLogin} />
  </BrowserRouter>
);

describe('Login Component', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    mockOnLogin.mockClear();
  });

  test('renders login form correctly', () => {
    render(<MockedLogin onLogin={mockOnLogin} />);
    
    expect(screen.getByText('🏦 Bank Management System')).toBeInTheDocument();
    expect(screen.getByText('Welcome to your secure banking portal')).toBeInTheDocument();
    expect(screen.getByLabelText('Account Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Account Holder Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('handles form input changes', () => {
    render(<MockedLogin onLogin={mockOnLogin} />);
    
    const accountNumberInput = screen.getByLabelText('Account Number');
    const accountHolderNameInput = screen.getByLabelText('Account Holder Name');

    fireEvent.change(accountNumberInput, { target: { value: '12345' } });
    fireEvent.change(accountHolderNameInput, { target: { value: 'John Doe' } });

    expect(accountNumberInput.value).toBe('12345');
    expect(accountHolderNameInput.value).toBe('John Doe');
  });

  test('calls onLogin with correct data on successful submission', async () => {
    render(<MockedLogin onLogin={mockOnLogin} />);
    
    const accountNumberInput = screen.getByLabelText('Account Number');
    const accountHolderNameInput = screen.getByLabelText('Account Holder Name');
    const loginButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(accountNumberInput, { target: { value: '12345' } });
    fireEvent.change(accountHolderNameInput, { target: { value: 'John Doe' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith({
        accountNumber: '12345',
        accountHolderName: 'John Doe'
      });
    });
  });

  test('shows error message for empty fields', async () => {
    render(<MockedLogin onLogin={mockOnLogin} />);
    
    const loginButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
    });

    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  test('shows error message for empty account number only', async () => {
    render(<MockedLogin onLogin={mockOnLogin} />);
    
    const accountHolderNameInput = screen.getByLabelText('Account Holder Name');
    const loginButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(accountHolderNameInput, { target: { value: 'John Doe' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
    });

    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  test('shows error message for empty account holder name only', async () => {
    render(<MockedLogin onLogin={mockOnLogin} />);
    
    const accountNumberInput = screen.getByLabelText('Account Number');
    const loginButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(accountNumberInput, { target: { value: '12345' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
    });

    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  test('clears error message when user starts typing', async () => {
    render(<MockedLogin onLogin={mockOnLogin} />);
    
    const loginButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
    });

    const accountNumberInput = screen.getByLabelText('Account Number');
    fireEvent.change(accountNumberInput, { target: { value: '12345' } });

    expect(screen.queryByText('Please fill in all fields')).not.toBeInTheDocument();
  });

  test('shows loading state during login', async () => {
    render(<MockedLogin onLogin={mockOnLogin} />);
    
    const accountNumberInput = screen.getByLabelText('Account Number');
    const accountHolderNameInput = screen.getByLabelText('Account Holder Name');
    const loginButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(accountNumberInput, { target: { value: '12345' } });
    fireEvent.change(accountHolderNameInput, { target: { value: 'John Doe' } });
    fireEvent.click(loginButton);

    // The button should show loading state briefly
    expect(loginButton).toHaveTextContent('Signing In...');
  });

  test('handles special characters in input', () => {
    render(<MockedLogin onLogin={mockOnLogin} />);
    
    const accountNumberInput = screen.getByLabelText('Account Number');
    const accountHolderNameInput = screen.getByLabelText('Account Holder Name');

    fireEvent.change(accountNumberInput, { target: { value: '123-456-789' } });
    fireEvent.change(accountHolderNameInput, { target: { value: 'José María García' } });

    expect(accountNumberInput.value).toBe('123-456-789');
    expect(accountHolderNameInput.value).toBe('José María García');
  });

  test('handles very long input values', () => {
    render(<MockedLogin onLogin={mockOnLogin} />);
    
    const accountNumberInput = screen.getByLabelText('Account Number');
    const accountHolderNameInput = screen.getByLabelText('Account Holder Name');

    const longAccountNumber = '1'.repeat(100);
    const longName = 'A'.repeat(100);

    fireEvent.change(accountNumberInput, { target: { value: longAccountNumber } });
    fireEvent.change(accountHolderNameInput, { target: { value: longName } });

    expect(accountNumberInput.value).toBe(longAccountNumber);
    expect(accountHolderNameInput.value).toBe(longName);
  });

  test('form submission with Enter key', async () => {
    render(<MockedLogin onLogin={mockOnLogin} />);
    
    const accountNumberInput = screen.getByLabelText('Account Number');
    const accountHolderNameInput = screen.getByLabelText('Account Holder Name');

    fireEvent.change(accountNumberInput, { target: { value: '12345' } });
    fireEvent.change(accountHolderNameInput, { target: { value: 'John Doe' } });
    
    fireEvent.keyPress(accountHolderNameInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith({
        accountNumber: '12345',
        accountHolderName: 'John Doe'
      });
    });
  });
});
