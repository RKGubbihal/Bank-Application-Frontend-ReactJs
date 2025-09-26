# Bank Management System - React Frontend

A modern, responsive React.js frontend application for the Bank Management System built with Spring Boot.

## Features

- 🏦 **Account Management**: Create, view, update, and delete bank accounts
- 💰 **Transaction Operations**: Deposit and withdraw funds from accounts
- 💸 **Fund Transfers**: Transfer money between accounts
- 📊 **Transaction History**: View detailed transaction records
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Beautiful, intuitive interface with smooth animations
- 🛡️ **Error Handling**: Comprehensive error boundaries and fallback mechanisms
- ⚡ **Loading States**: Smooth loading indicators and user feedback
- 🔄 **Fallback Mode**: Works without backend using mock data

## Technology Stack

- **React 18.2.0** - Frontend framework
- **React Router DOM 6.11.0** - Client-side routing
- **Axios 1.4.0** - HTTP client for API calls
- **CSS3** - Modern styling with gradients and animations

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Spring Boot backend running on `http://localhost:8080` (optional - app has fallback mode)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd "Frontend ReactJs"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (irreversible)

## Project Structure

```
src/
├── components/           # React components
│   ├── Login.js         # Login/authentication component
│   ├── Dashboard.js     # Main dashboard
│   ├── AccountDetails.js # Account management
│   ├── TransactionHistory.js # Transaction records
│   ├── Transfer.js      # Fund transfer functionality
│   ├── ErrorBoundary.js # Error handling component
│   ├── LoadingSpinner.js # Loading states
│   └── *.css           # Component-specific styles
├── services/            # API service layer
│   └── api.js          # API configuration and methods
├── __tests__/          # Test files
├── __mocks__/          # Mock data for testing
├── utils/               # Utility functions
├── styles/             # Global styles
├── App.js              # Main application component
├── App.css             # Global application styles
├── index.js            # Application entry point
└── index.css           # Global base styles
```

## API Integration

The frontend communicates with the Spring Boot backend through RESTful APIs:

- **Base URL**: `http://localhost:8080`
- **Account Operations**:
  - `POST /account/create` - Create new account
  - `GET /account/{id}` - Get account by ID
  - `GET /account/all` - Get all accounts
  - `PUT /account/deposit/{id}/{amount}` - Deposit funds
  - `PUT /account/withdraw/{id}/{amount}` - Withdraw funds
  - `DELETE /account/delete/{id}` - Delete account

## Features Overview

### 1. Dashboard
- Overview of all accounts
- Quick access to main features
- Recent account activity

### 2. Account Management
- Create new bank accounts
- View account details and balances
- Deposit and withdraw funds
- Delete accounts

### 3. Fund Transfers
- Transfer money between accounts
- Real-time balance updates
- Transfer validation

### 4. Transaction History
- View transaction records
- Account-specific transaction filtering
- Transaction type categorization

## Styling and Design

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Mobile-first approach
- **Smooth Animations**: CSS transitions and hover effects
- **Color Scheme**: Professional blue gradient theme
- **Typography**: System fonts for optimal performance

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Notes

- The application uses React Hooks for state management
- Axios is configured with a base URL for API calls
- Error handling is implemented throughout the application
- The design is fully responsive and mobile-friendly
- All components are modular and reusable

## Recent Improvements

### Error Handling & Resilience
- **Error Boundaries**: Added comprehensive error boundaries to catch and handle React component errors
- **Network Error Handling**: Improved API error handling with specific messages for different error types
- **Fallback Mode**: Application works without backend using mock data for demonstration
- **Timeout Handling**: Added request timeouts to prevent hanging requests

### User Experience Enhancements
- **Loading States**: Added smooth loading spinners with contextual messages
- **Better Error Messages**: User-friendly error messages instead of technical jargon
- **Graceful Degradation**: App continues to work even when backend is unavailable

### Code Quality Improvements
- **ESLint Configuration**: Fixed dependency array warnings in useEffect hooks
- **Better Error Logging**: Enhanced console logging for debugging
- **API Interceptors**: Added request/response interceptors for better error handling

## Troubleshooting

### Common Issues

1. **API Connection Errors**: Ensure the Spring Boot backend is running on port 8080
2. **CORS Issues**: The backend should have CORS configured for localhost:3000
3. **Build Errors**: Clear node_modules and reinstall dependencies

### Development Tips

- Use browser developer tools to debug API calls
- Check the Network tab for failed requests
- Ensure all environment variables are properly set

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Bank Management System and is intended for educational purposes.
