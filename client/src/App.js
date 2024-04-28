import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import './App.css';
import EnterQuote from './enter-quote/EnterQuote';
import SanctionQuote from './sanction-quote/SanctionQuote';
import ConvertQuote from './convert-quote/ConvertQuote';
import MaintainRecords from './maintain-records/MaintainRecords';
import Login from './Login'; // Import the Login component
import axios from 'axios';  // Import axios to query DB

// Global variables for EnterQuote.js
var GlobalUsername = '';
var GlobalUserID = ''; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async (username, password) => {
    console.log("Login Attempt:", username, password);

    try {
      const response = await axios.get(`/api/associates/search`, {
        params: { name: username, pass: password }
      });

      if (response.data.success) {
        setIsAuthenticated(true);
        GlobalUsername = username;
        GlobalUserID = response.data.associateId.toString();
        console.log("Login successful!!!");
        return true; // Indicate successful login
      } else {
        console.log("Login failed.");
        return false;
      }
    } 
    catch (error) {
      console.error('Error fetching sales associate:', error);
      alert('An error occurred while checking for successful login.');
      return false;
    }
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Sales Quote Management System</h1>
          <nav>
            <ul className="button-list">
              <li><Link className="button-link" to="/">Home</Link></li>
              <li>{isAuthenticated ? <Link className="button-link" to="/enter-quote">Enter Sales Quote</Link> : <Link className="button-link" to="/login">Enter Sales Quote</Link>}</li>
              <li><Link className="button-link" to="/sanction-quote">Sanction Quote</Link></li>
              <li><Link className="button-link" to="/convert-quote">Convert Quote to Purchase Order</Link></li>
              <li><Link className="button-link" to="/maintain-records">Maintain Records</Link></li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<div><h2>Welcome to the Sales Quote Management System</h2><p>Select an option from the menu to get started.</p></div>} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/enter-quote" element={isAuthenticated ? <EnterQuote /> : <Navigate replace to="/login" />} />
            <Route path="/sanction-quote" element={<SanctionQuote />} />
            <Route path="/convert-quote" element={<ConvertQuote />} />
            <Route path="/maintain-records" element={<MaintainRecords />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export { GlobalUsername, GlobalUserID };

export default App;