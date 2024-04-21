import React, { useState } from 'react';
import axios from 'axios';
import './EnterQuote.css';

function EnterQuote() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState(null); // Initialize to null for better type checking

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/customers/search?name=${searchTerm}`);
      console.log("API Response:", response.data); // Log to inspect the structure
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching customer data:', error);
      alert('An error occurred while searching for customers.');
      setResults([]); // Ensure results is set to an empty array on error
    }
  };

  const renderResults = () => {
    if (Array.isArray(results)) {
      return (
        <table className="customer-search-results">
          <thead>
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Street</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {results.map((customer, index) => (
              <tr key={index}>
                <td>{customer.name}</td>
                <td>{customer.city}</td>
                <td>{customer.street}</td>
                <td>{customer.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (results) {
      return <p>Received data is not in the expected format.</p>;
    }
    return <p>No results found.</p>;
  };

  return (
    <div className="enter-quote">
      <h2>Enter Sales Quote</h2>
      <div className="form-group">
        <label htmlFor="customer-search">Customer Name:</label>
        <input 
          type="text" 
          id="customer-search" 
          placeholder="Search Customers..."
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      {renderResults()}
    </div>
  );
}

export default EnterQuote;
