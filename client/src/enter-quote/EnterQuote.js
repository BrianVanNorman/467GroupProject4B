import React, { useState } from 'react';
import axios from 'axios';
import './EnterQuote.css';

// Global variable import for associate's name that is currently logged in
import { GlobalUsername } from '../App.js';
import { GlobalUserID } from '../App.js';

function EnterQuote() {
  // State variables for search field
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState(null); // Initialize to null for better type checking

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  // State variables for form fields when entering a quote
  const [customerEmail, setCustomerEmail] = useState('');
  const [lineItems, setLineItems] = useState([{ description: '', quantity: '', price: '' }]);
  const [secretNotes, setSecretNotes] = useState(['']);

  // Function to add a new secret note
  const addSecretNote = () => {
    setSecretNotes([...secretNotes, '']);
  };

  // Function to handle secret note changes
  const handleSecretNoteChange = (index, value) => {
    const newSecretNotes = secretNotes.map((note, i) =>
      i === index ? value : note
    );
    setSecretNotes(newSecretNotes);
  };

  // Function to remove a secret note
  const removeSecretNote = (index) => {
    const newSecretNotes = secretNotes.filter((_, i) => i !== index);
    setSecretNotes(newSecretNotes);
  };

  // Function to add a new line item
  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: '', price: '' }]);
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

  const handleCreateQuote = (customer) => {
    setSelectedCustomer(customer);
    setShowQuoteForm(true);
  };

  const handleCloseQuoteForm = () => {
    setSelectedCustomer(null);
    setShowQuoteForm(false);
  };

  // Function to handle form submission
  const finalizeQuote = async () => {
    try {
      const quoteData = {
        customer_email: customerEmail,
        associate_id: GlobalUserID, // Use the global user ID saved during login
        line_items: lineItems.map(item => ({
          description: item.description,
          price: parseFloat(item.price),
          quantity: parseFloat(item.quantity)
        })),
        secret_notes: secretNotes,
        customer_id: selectedCustomer.id,
        customer_address: selectedCustomer.street,
        status: 'finalized',
        date: new Date(),
      };

      const response = await axios.post('/api/quotes', quoteData);
      if (response.status === 201) {
        alert('Quote finalized successfully!');
        handleCloseQuoteForm();
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

  return (
    <div className="enter-quote">
      <h3 className="associate-info">Logged in as: {GlobalUsername}</h3>
      <h2>Enter Sales Quote</h2>
      <div className="form-group">
        <input
          type="text"
          id="customer-search"
          placeholder="Search Customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      {Array.isArray(results) && (
        <table className="customer-search-results">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>City</th>
              <th>Street</th>
              <th>Contact</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {results.map((customer, index) => (
              <tr key={index}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.city}</td>
                <td>{customer.street}</td>
                <td>{customer.contact}</td>
                <td>
                  <button onClick={() => handleCreateQuote(customer)}>
                    Create New Quote
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
  
      {showQuoteForm && (
        <div className="quote-form-overlay">
          <div className="quote-form">
            <h3>Create New Quote</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Customer Email"
                required
              />
              <div className="address-container">
                <input
                  type="text"
                  value={selectedCustomer.street}
                  readOnly
                  placeholder="Street"
                />
                <input
                  type="text"
                  value={selectedCustomer.city}
                  readOnly
                  placeholder="City"
                />
                <input
                  type="text"
                  value={selectedCustomer.contact}
                  readOnly
                  placeholder="Contact"
                />
              </div>
              {lineItems.map((item, index) => (
                <div key={index} className="line-item-form">
                  <input
                    type="text"
                    placeholder="Description" 
                    value={item.description}
                    onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => handleLineItemChange(index, 'price', e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => removeLineItem(index)}>
                    Remove
                  </button>
                </div>
              ))}
              {secretNotes.map((note, index) => (
                <div key={index} className="secret-note-form">
                  <textarea
                    value={note}
                    onChange={(e) => handleSecretNoteChange(index, e.target.value)}
                    placeholder="Secret Note"
                  />
                  <button type="button" onClick={() => removeSecretNote(
                    index)}>
                    Remove
                  </button>
                </div>
              ))}
              <div className="action-buttons">
                <button type="button" onClick={addSecretNote}>
                  Add Secret Note
                </button>
                <button type="button" onClick={addLineItem}>
                  Add Line Item
                </button>
                <button type="button" onClick={finalizeQuote}>
                  Finalize Quote
                </button>
                <button type="button" onClick={handleCloseQuoteForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnterQuote;