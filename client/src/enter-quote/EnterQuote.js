import React, { useState } from 'react';
import axios from 'axios';
import './EnterQuote.css';

function EnterQuote() {

  // State variables for search field
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState(null); // Initialize to null for better type checking

  // State variables for form fields when entering a quote
  const [customerEmail, setCustomerEmail] = useState('');
  const [associateId, setAssociateId] = useState('');
  const [lineItems, setLineItems] = useState([{ name: '', description: '', amount: '' },]);
  const [secretNote, setSecretNote] = useState('');

  // Function to add a new line item
  const addLineItem = () => {
    setLineItems([...lineItems, { name: '', description: '', amount: '' }]);
  };

  // Function to handle line item changes
  const handleLineItemChange = (index, field, value) => {
    const newLineItems = lineItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setLineItems(newLineItems);
  };

  // Function to remove a line item
  const removeLineItem = (index) => {
    const newLineItems = lineItems.filter((_, i) => i !== index);
    setLineItems(newLineItems);
  };

  // Function to handle form submission
  const finalizeQuote = async () => {
    try {
      const quoteData = {
        customer_email: customerEmail,
        associate_id: associateId, // Make sure this is set to a valid ObjectId
        line_items: lineItems, // Assuming items is an array of item details
        secret_note: secretNote,
      };

      // Send a POST request to the backend to create a new quote
      const response = await axios.post('/api/quotes', quoteData);
      if (response.status === 201) {
        alert('Quote finalized successfully!');
        // Clear the form or redirect as needed
      } else {
        alert('Failed to finalize quote.');
      }
    } catch (error) {
      console.error('Error finalizing quote:', error);
      alert('An error occurred while finalizing the quote.');
    }
  };


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

      {/* Form for adding quote details */}
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          placeholder="Customer Contact"
          required
        />
        <input
          type="text"
          value={associateId}
          onChange={(e) => setAssociateId(e.target.value)}
          placeholder="Associate ID"
          required
        />
        {/* Line Items Section */}
          {lineItems.map((item, index) => (
            <div key={index} className="line-item-form">
              <input
                type="text"
                placeholder="Item Name"
                value={item.name}
                onChange={(e) => handleLineItemChange(index, 'name', e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Item Description"
                value={item.description}
                onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
              />
              <input
                type="number"
                placeholder="Item Amount"
                value={item.amount}
                onChange={(e) => handleLineItemChange(index, 'amount', e.target.value)}
                required
              />
              <button type="button" onClick={() => removeLineItem(index)}>Remove</button>
            </div>
          ))}
        <button type="button" onClick={addLineItem}>Add Line Item</button>

        <textarea
          value={secretNote}
          onChange={(e) => setSecretNote(e.target.value)}
          placeholder="Secret Note"
        />
        <button type="button" onClick={finalizeQuote}>Finalize Quote</button>
      </form>
    </div>
  );
}

export default EnterQuote;
