import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './components/Login'; // Commented out - login page disabled
import Dashboard from './components/Dashboard';
import AccountDetails from './components/AccountDetails';
import TransactionHistory from './components/TransactionHistory';
import Transfer from './components/Transfer';
import NewAccount from './components/NewAccount';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  // Login functionality commented out - bypassing authentication
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [user, setUser] = useState(null);
  
  // Auto-authenticate for demo purposes
  const [user, setUser] = useState({
    accountNumber: 'DEMO123456',
    accountHolderName: 'Demo User'
  });

  // Commented out unused functions
  // const handleLogin = (userData) => {
  //   setUser(userData);
  //   setIsAuthenticated(true);
  // };

  const handleLogout = () => {
    // Reset to demo user since login is bypassed
    setUser({
      accountNumber: 'DEMO123456',
      accountHolderName: 'Demo User'
    });
  };

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
            {/* Login route commented out */}
            {/* <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                  <Navigate to="/dashboard" replace /> : 
                  <Login onLogin={handleLogin} />
              } 
            /> */}
            <Route 
              path="/dashboard" 
              element={<Dashboard user={user} onLogout={handleLogout} />}
            />
            <Route 
              path="/account" 
              element={<AccountDetails user={user} onLogout={handleLogout} />}
            />
            <Route 
              path="/transactions" 
              element={<TransactionHistory user={user} onLogout={handleLogout} />}
            />
            <Route 
              path="/transfer" 
              element={<Transfer user={user} onLogout={handleLogout} />}
            />
            <Route 
              path="/new-account" 
              element={<NewAccount user={user} onLogout={handleLogout} />}
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;


