import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { accountAPI } from '../services/api';
import './Transfer.css';

const Transfer = ({ user, onLogout }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [transferForm, setTransferForm] = useState({
    fromAccount: '',
    toAccount: '',
    amount: ''
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransferForm(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    
    if (!transferForm.fromAccount || !transferForm.toAccount || !transferForm.amount) {
      setError('Please fill in all fields');
      return;
    }

    if (transferForm.fromAccount === transferForm.toAccount) {
      setError('Cannot transfer to the same account');
      return;
    }

    const amount = parseFloat(transferForm.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      // First withdraw from source account
      await accountAPI.withdrawAmount(transferForm.fromAccount, amount);
      
      // Then deposit to destination account
      await accountAPI.depositAmount(transferForm.toAccount, amount);
      
      setSuccess(`Successfully transferred $${amount.toFixed(2)} from Account #${transferForm.fromAccount} to Account #${transferForm.toAccount}`);
      setTransferForm({
        fromAccount: '',
        toAccount: '',
        amount: ''
      });
      
      // Refresh accounts to show updated balances
      fetchAccounts();
    } catch (err) {
      setError('Transfer failed. Please check account balances and try again.');
      console.error('Error transferring:', err);
    }
  };

  if (loading) {
    return (
      <div className="transfer-container">
        <div className="loading">Loading accounts...</div>
      </div>
    );
  }

  return (
    <div className="transfer-container">
      <header className="transfer-header">
        <div className="header-content">
          <h1>💸 Transfer Funds</h1>
          <div className="user-info">
            <span>Welcome, {user?.accountHolderName}</span>
            <button onClick={onLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
        <nav className="transfer-nav">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/account" className="nav-link">Accounts</Link>
          <Link to="/transactions" className="nav-link">Transactions</Link>
        </nav>
      </header>

      <main className="transfer-main">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {accounts.length < 2 ? (
          <div className="insufficient-accounts">
            <h3>Insufficient Accounts for Transfer</h3>
            <p>You need at least 2 accounts to perform transfers.</p>
            <p>Current accounts: {accounts.length}</p>
            <Link to="/account" className="create-account-link">
              Create More Accounts
            </Link>
          </div>
        ) : (
          <div className="transfer-section">
            <div className="transfer-form-container">
              <h3>Transfer Funds Between Accounts</h3>
              <form onSubmit={handleTransfer} className="transfer-form">
                <div className="form-group">
                  <label htmlFor="fromAccount">From Account</label>
                  <select
                    id="fromAccount"
                    name="fromAccount"
                    value={transferForm.fromAccount}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select source account</option>
                    {accounts.map(account => (
                      <option key={account.accountNumber} value={account.accountNumber}>
                        Account #{account.accountNumber} - {account.accountHolderName} (${account.accountBalance?.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="toAccount">To Account</label>
                  <select
                    id="toAccount"
                    name="toAccount"
                    value={transferForm.toAccount}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select destination account</option>
                    {accounts
                      .filter(account => account.accountNumber !== transferForm.fromAccount)
                      .map(account => (
                        <option key={account.accountNumber} value={account.accountNumber}>
                          Account #{account.accountNumber} - {account.accountHolderName} (${account.accountBalance?.toFixed(2)})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="amount">Transfer Amount</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={transferForm.amount}
                    onChange={handleInputChange}
                    placeholder="Enter amount to transfer"
                    step="0.01"
                    min="0.01"
                    required
                  />
                </div>

                <button type="submit" className="transfer-button">
                  💸 Transfer Funds
                </button>
              </form>
            </div>

            <div className="accounts-overview">
              <h3>Your Accounts</h3>
              <div className="accounts-grid">
                {accounts.map(account => (
                  <div key={account.accountNumber} className="account-card">
                    <div className="account-info">
                      <h4>Account #{account.accountNumber}</h4>
                      <p>{account.accountHolderName}</p>
                      <p className="balance">${account.accountBalance?.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Transfer;
