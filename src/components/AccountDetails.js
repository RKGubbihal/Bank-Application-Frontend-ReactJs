import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { accountAPI } from '../services/api';
import './AccountDetails.css';

const AccountDetails = ({ user, onLogout }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAccount, setNewAccount] = useState({
    accountHolderName: '',
    accountBalance: ''
  });

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

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      const accountData = {
        accountHolderName: newAccount.accountHolderName,
        accountBalance: parseFloat(newAccount.accountBalance)
      };
      
      await accountAPI.createAccount(accountData);
      setNewAccount({ accountHolderName: '', accountBalance: '' });
      setShowCreateForm(false);
      fetchAccounts(); // Refresh the list
    } catch (err) {
      setError('Failed to create account');
      console.error('Error creating account:', err);
    }
  };

  const handleDeposit = async (accountNumber, amount) => {
    try {
      await accountAPI.depositAmount(accountNumber, amount);
      fetchAccounts(); // Refresh the list
    } catch (err) {
      setError('Failed to deposit amount');
      console.error('Error depositing:', err);
    }
  };

  const handleWithdraw = async (accountNumber, amount) => {
    try {
      await accountAPI.withdrawAmount(accountNumber, amount);
      fetchAccounts(); // Refresh the list
    } catch (err) {
      setError('Failed to withdraw amount');
      console.error('Error withdrawing:', err);
    }
  };

  const handleDeleteAccount = async (accountNumber) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await accountAPI.deleteAccount(accountNumber);
        fetchAccounts(); // Refresh the list
      } catch (err) {
        setError('Failed to delete account');
        console.error('Error deleting account:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="account-details-container">
        <div className="loading">Loading accounts...</div>
      </div>
    );
  }

  return (
    <div className="account-details-container">
      <header className="account-header">
        <div className="header-content">
          <h1>💳 Account Management</h1>
          <div className="user-info">
            <span>Welcome, {user?.accountHolderName}</span>
            <button onClick={onLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
        <nav className="account-nav">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/transactions" className="nav-link">Transactions</Link>
          <Link to="/transfer" className="nav-link">Transfer</Link>
        </nav>
      </header>

      <main className="account-main">
        <div className="account-actions">
          <Link to="/new-account" className="create-account-button">
            + Create New Account
          </Link>
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="create-account-button"
          >
            {showCreateForm ? 'Cancel' : 'Quick Create'}
          </button>
        </div>

        {showCreateForm && (
          <div className="create-account-form">
            <h3>Create New Account</h3>
            <form onSubmit={handleCreateAccount}>
              <div className="form-group">
                <label>Account Holder Name</label>
                <input
                  type="text"
                  value={newAccount.accountHolderName}
                  onChange={(e) => setNewAccount({...newAccount, accountHolderName: e.target.value})}
                  placeholder="Enter account holder name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Initial Balance</label>
                <input
                  type="number"
                  step="0.01"
                  value={newAccount.accountBalance}
                  onChange={(e) => setNewAccount({...newAccount, accountBalance: e.target.value})}
                  placeholder="Enter initial balance"
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Create Account
              </button>
            </form>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="accounts-section">
          <h3>All Accounts ({accounts.length})</h3>
          {accounts.length === 0 ? (
            <div className="no-accounts">
              <p>No accounts found. Create your first account!</p>
            </div>
          ) : (
            <div className="accounts-grid">
              {accounts.map(account => (
                <div key={account.accountNumber} className="account-card">
                  <div className="account-header-card">
                    <h4>Account #{account.accountNumber}</h4>
                    <button 
                      onClick={() => handleDeleteAccount(account.accountNumber)}
                      className="delete-button"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="account-info">
                    <p><strong>Holder:</strong> {account.accountHolderName}</p>
                    <p><strong>Balance:</strong> ${account.accountBalance?.toFixed(2)}</p>
                  </div>
                  <div className="account-actions">
                    <button 
                      onClick={() => {
                        const amount = prompt('Enter deposit amount:');
                        if (amount && !isNaN(amount)) {
                          handleDeposit(account.accountNumber, parseFloat(amount));
                        }
                      }}
                      className="action-button deposit"
                    >
                      💰 Deposit
                    </button>
                    <button 
                      onClick={() => {
                        const amount = prompt('Enter withdrawal amount:');
                        if (amount && !isNaN(amount)) {
                          handleWithdraw(account.accountNumber, parseFloat(amount));
                        }
                      }}
                      className="action-button withdraw"
                    >
                      💸 Withdraw
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AccountDetails;
