import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import EnterQuote from './enter-quote/EnterQuote';
import SanctionQuote from './sanction-quote/SanctionQuote';
import ConvertQuote from './convert-quote/ConvertQuote';
import MaintainRecords from './maintain-records/MaintainRecords';
import Login from './Login'; // Import the Login component

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (username, password) => {
    console.log("Login Attempt:", username, password);
    // Simulate authentication logic
    // Normally, you would verify credentials via an API here
    if (username === 'admin' && password === 'admin') {  // Example credentials check
      setIsAuthenticated(true);
      return true; // Indicate successful login
    }
    return false;
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Sales Quote Management System</h1>
          <nav>
            <ul className="button-list">
              <li>
                <Link className="button-link" to="/">Home</Link>
              </li>
              <li>
                {isAuthenticated
                  ? <Link className="button-link" to="/enter-quote">Enter Sales Quote</Link>
                  : <Link className="button-link" to="/login">Enter Sales Quote</Link>
                }
              </li>
              <li>
                <Link className="button-link" to="/sanction-quote">Sanction Quote</Link>
              </li>
              <li>
                <Link className="button-link" to="/convert-quote">Convert Quote to Purchase Order</Link>
              </li>
              <li>
                <Link className="button-link" to="/maintain-records">Maintain Records</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={
              <div>
                <h2>Welcome to the Sales Quote Management System</h2>
                <p>Select an option from the menu to get started.</p>
              </div>
            } />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/enter-quote" element={
              isAuthenticated ? <EnterQuote /> : <Navigate replace to="/login" />
            } />
            <Route path="/sanction-quote" element={<SanctionQuote />} />
            <Route path="/convert-quote" element={<ConvertQuote />} />
            <Route path="/maintain-records" element={<MaintainRecords />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;