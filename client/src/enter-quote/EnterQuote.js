import React, { useState } from 'react';
import axios from 'axios';
import './EnterQuote.css';

function EnterQuote() {
  // State variables for form data
  const [customer, setCustomer] = useState('');
  const [lineItems, setLineItems] = useState([{ description: '', price: 0 }]);
  const [secretNotes, setSecretNotes] = useState('');

  // Function to add a new line item
  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', price: 0 }]);
  };

  // Function to handle changes in line item inputs
  const handleLineItemChange = (index, field, value) => {
    const updatedLineItems = [...lineItems];
    updatedLineItems[index][field] = value;
    setLineItems(updatedLineItems);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/api/quotes', {
        customer,
        lineItems,
        secretNotes
      });

      if (response.status === 201) {
        // Clear form or display success message
        setCustomer('');
        setLineItems([{ description: '', price: 0 }]);
        setSecretNotes('');
        alert('Quote created successfully!');
      } else {
        // Handle unexpected response
        alert('An error occurred while creating the quote.');
      }
    } catch (error) {
      // Handle errors during API call
      alert('An error occurred while creating the quote.');
    }
  };

  return (
    <div className="enter-quote">
      <h2>Enter Sales Quote</h2>

      <form className="quote-form" onSubmit={handleSubmit}>
        {/* Customer Input */}
        <div className="form-group">
          <label htmlFor="customer">Customer ID:</label>
          <input 
            type="text" 
            id="customer" 
            value={customer} 
            onChange={(e) => setCustomer(e.target.value)} 
          />
        </div>

        {/* Line Items Table */}
        <table className="line-items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item, index) => (
              <tr key={index}>
                <td>
                  <input 
                    type="text"
                    value={item.description}
                    onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleLineItemChange(index, 'price', e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="button" onClick={addLineItem}>
          Add Line Item
        </button>

        {/* Secret Notes */}
        <div className="form-group">
          <label htmlFor="secretNotes">Secret Notes:</label>
          <textarea 
            id="secretNotes" 
            value={secretNotes} 
            onChange={(e) => setSecretNotes(e.target.value)} 
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="button">Create Quote</button>
      </form>
    </div>
  );
}

export default EnterQuote;