import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import EnterQuote from './enter-quote/EnterQuote';
import SanctionQuote from './sanction-quote/SanctionQuote';
import ConvertQuote from './convert-quote/ConvertQuote';
import MaintainRecords from './maintain-records/MaintainRecords';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Sales Quote Management System</h1>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/enter-quote">Enter Sales Quote</Link>
              </li>
              <li>
                <Link to="/sanction-quote">Sanction Quote</Link>
              </li>
              <li>
                <Link to="/convert-quote">Convert Quote to Purchase Order</Link>
              </li>
              <li>
                <Link to="/maintain-records">Maintain Records</Link>
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
            <Route path="/enter-quote" element={<EnterQuote />} />
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