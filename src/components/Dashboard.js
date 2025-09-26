import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { accountAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [accounts, setAccounts] = useState([]);
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

  const handleLogout = () => {
    onLogout();
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <LoadingSpinner message="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🏦 Bank Management Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.accountHolderName}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>📊 Account Overview</h3>
            <p>Total Accounts: {accounts.length}</p>
            <Link to="/account" className="card-link">
              View All Accounts →
            </Link>
          </div>

          <div className="dashboard-card">
            <h3>💰 Quick Actions</h3>
            <div className="quick-actions">
              <Link to="/account" className="action-button">
                View Accounts
              </Link>
              <Link to="/new-account" className="action-button">
                Create New Account
              </Link>
              <Link to="/transactions" className="action-button">
                Transaction History
              </Link>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>📈 Recent Activity</h3>
            <p>Manage your banking activities efficiently</p>
            <Link to="/transfer" className="card-link">
              Transfer Funds →
            </Link>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {accounts.length > 0 && (
          <div className="recent-accounts">
            <h3>Recent Accounts</h3>
            <div className="accounts-list">
              {accounts.slice(0, 3).map(account => (
                <div key={account.accountNumber} className="account-item">
                  <div className="account-info">
                    <h4>Account #{account.accountNumber}</h4>
                    <p>{account.accountHolderName}</p>
                    <p className="balance">${account.accountBalance?.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
