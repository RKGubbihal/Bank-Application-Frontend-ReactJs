import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import './NewAccount.css';

const NewAccount = ({ user, onLogout }) => {
  const [formData, setFormData] = useState({
    accountHolderName: '',
    accountType: 'Savings',
    initialDeposit: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    ssn: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.accountHolderName || !formData.initialDeposit || !formData.email) {
        setError('Please fill in all required fields');
        return;
      }

      // Validate initial deposit
      const depositAmount = parseFloat(formData.initialDeposit);
      if (isNaN(depositAmount) || depositAmount < 0) {
        setError('Please enter a valid initial deposit amount');
        return;
      }

      // Create account data
      const accountData = {
        ...formData,
        initialDeposit: depositAmount,
        accountNumber: generateAccountNumber(),
        accountBalance: depositAmount
      };

      // In a real application, this would call the backend API
      // For demo purposes, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      // Simulate successful account creation
      setSuccess(`Account created successfully! Account Number: ${accountData.accountNumber}`);
      
      // Reset form after successful creation
      setTimeout(() => {
        setFormData({
          accountHolderName: '',
          accountType: 'Savings',
          initialDeposit: '',
          email: '',
          phone: '',
          address: '',
          dateOfBirth: '',
          ssn: ''
        });
        setSuccess('');
      }, 3000);

    } catch (err) {
      setError('Failed to create account. Please try again.');
      console.error('Error creating account:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateAccountNumber = () => {
    // Generate a random 8-digit account number
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  const handleLogout = () => {
    onLogout();
  };

  if (loading) {
    return (
      <div className="new-account-container">
        <LoadingSpinner message="Creating account..." />
      </div>
    );
  }

  return (
    <div className="new-account-container">
      <header className="new-account-header">
        <div className="header-content">
          <h1>🏦 Create New Account</h1>
          <div className="user-info">
            <span>Welcome, {user?.accountHolderName}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="new-account-main">
        <div className="new-account-card">
          <div className="card-header">
            <h2>📝 Account Application Form</h2>
            <p>Please fill in all the required information to create a new account</p>
          </div>

          <form onSubmit={handleSubmit} className="new-account-form">
            <div className="form-section">
              <h3>Personal Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="accountHolderName">Full Name *</label>
                  <input
                    type="text"
                    id="accountHolderName"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full address"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="ssn">Social Security Number</label>
                <input
                  type="text"
                  id="ssn"
                  name="ssn"
                  value={formData.ssn}
                  onChange={handleChange}
                  placeholder="XXX-XX-XXXX"
                  maxLength="11"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Account Details</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="accountType">Account Type</label>
                  <select
                    id="accountType"
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                  >
                    <option value="Savings">Savings Account</option>
                    <option value="Checking">Checking Account</option>
                    <option value="Business">Business Account</option>
                    <option value="Joint">Joint Account</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="initialDeposit">Initial Deposit *</label>
                  <input
                    type="number"
                    id="initialDeposit"
                    name="initialDeposit"
                    value={formData.initialDeposit}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewAccount;
