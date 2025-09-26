import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { accountAPI } from '../services/api';
import './TransactionHistory.css';

const TransactionHistory = ({ user, onLogout }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const accountsData = await accountAPI.getAllAccounts();
      setAccounts(accountsData);
    } catch (err) {
      setError('Failed to fetch accounts');
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccountDetails = async (accountNumber) => {
    try {
      const account = await accountAPI.getAccountById(accountNumber);
      setSelectedAccount(account);
      // In a real app, you'd fetch transaction history from a separate endpoint
      // For now, we'll create mock transaction data
      setTransactions([
        {
          id: 1,
          type: 'Deposit',
          amount: 1000,
          date: new Date().toISOString(),
          description: 'Initial deposit'
        },
        {
          id: 2,
          type: 'Withdrawal',
          amount: 500,
          date: new Date(Date.now() - 86400000).toISOString(),
          description: 'ATM withdrawal'
        }
      ]);
    } catch (err) {
      setError('Failed to fetch account details');
      console.error('Error fetching account:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="transaction-history-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="transaction-history-container">
      <header className="transaction-header">
        <div className="header-content">
          <h1>📊 Transaction History</h1>
          <div className="user-info">
            <span>Welcome, {user?.accountHolderName}</span>
            <button onClick={onLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
        <nav className="transaction-nav">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/account" className="nav-link">Accounts</Link>
          <Link to="/transfer" className="nav-link">Transfer</Link>
        </nav>
      </header>

      <main className="transaction-main">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="account-selection">
          <h3>Select Account to View Transactions</h3>
          {accounts.length === 0 ? (
            <div className="no-accounts">
              <p>No accounts found. <Link to="/account">Create an account</Link> to view transactions.</p>
            </div>
          ) : (
            <div className="accounts-list">
              {accounts.map(account => (
                <div 
                  key={account.accountNumber} 
                  className={`account-item ${selectedAccount?.accountNumber === account.accountNumber ? 'selected' : ''}`}
                  onClick={() => fetchAccountDetails(account.accountNumber)}
                >
                  <div className="account-info">
                    <h4>Account #{account.accountNumber}</h4>
                    <p>{account.accountHolderName}</p>
                    <p className="balance">Balance: ${account.accountBalance?.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedAccount && (
          <div className="transaction-details">
            <div className="account-summary">
              <h3>Account Summary</h3>
              <div className="summary-info">
                <p><strong>Account Number:</strong> {selectedAccount.accountNumber}</p>
                <p><strong>Account Holder:</strong> {selectedAccount.accountHolderName}</p>
                <p><strong>Current Balance:</strong> ${selectedAccount.accountBalance?.toFixed(2)}</p>
              </div>
            </div>

            <div className="transactions-section">
              <h3>Recent Transactions</h3>
              {transactions.length === 0 ? (
                <div className="no-transactions">
                  <p>No transactions found for this account.</p>
                </div>
              ) : (
                <div className="transactions-list">
                  {transactions.map(transaction => (
                    <div key={transaction.id} className="transaction-item">
                      <div className="transaction-info">
                        <div className="transaction-type">
                          <span className={`type-badge ${transaction.type.toLowerCase()}`}>
                            {transaction.type}
                          </span>
                        </div>
                        <div className="transaction-details">
                          <p className="description">{transaction.description}</p>
                          <p className="date">{formatDate(transaction.date)}</p>
                        </div>
                      </div>
                      <div className="transaction-amount">
                        <span className={`amount ${transaction.type.toLowerCase()}`}>
                          {transaction.type === 'Deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {!selectedAccount && accounts.length > 0 && (
          <div className="select-account-prompt">
            <p>👆 Click on an account above to view its transaction history</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default TransactionHistory;
