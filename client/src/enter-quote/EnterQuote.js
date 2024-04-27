import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EnterQuote.css';

// Global variable import for associate's name that is currently logged in
import { GlobalUsername } from '../App.js';
import { GlobalUserID } from '../App.js';

function EnterQuote() {
  // State variables for search field
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState(null);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [lineItems, setLineItems] = useState([{ description: '', quantity: '', price: '' }]);
  const [secretNotes, setSecretNotes] = useState(['']);
  const [discount, setDiscount] = useState({ type: 'percent', value: 0 });
  const [total, setTotal] = useState(0);
  const [draftQuotes, setDraftQuotes] = useState([]);

  useEffect(() => {
    fetchDraftQuotes();
  }, []);


  const fetchDraftQuotes = async () => {
    try {
      const response = await axios.get(`/api/quotes/draft?associateId=${GlobalUserID}`);
      setDraftQuotes(response.data);
    } catch (error) {
      console.error('Error fetching draft quotes:', error);
    }
  };

  const addSecretNote = () => {
    setSecretNotes([...secretNotes, '']);
  };

  const handleSecretNoteChange = (index, value) => {
    const newSecretNotes = secretNotes.map((note, i) =>
      i === index ? value : note
    );
    setSecretNotes(newSecretNotes);
  };

  const removeSecretNote = (index) => {
    const newSecretNotes = secretNotes.filter((_, i) => i !== index);
    setSecretNotes(newSecretNotes);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: '', price: '' }]);
  };

  const handleLineItemChange = (index, field, value) => {
    const newLineItems = lineItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setLineItems(newLineItems);
    calculateTotal();
  };

  const removeLineItem = (index) => {
    const newLineItems = lineItems.filter((_, i) => i !== index);
    setLineItems(newLineItems);
    calculateTotal();
  };

  const handleCreateQuote = (customer) => {
    setSelectedCustomer(customer);
    setShowQuoteForm(true);
  };

  const handleCloseQuoteForm = () => {
    setSelectedCustomer(null);
    setSelectedQuote(null);
    setCustomerEmail('');
    setLineItems([{ description: '', quantity: '', price: '' }]);
    setSecretNotes(['']);
    setDiscount({ type: 'percent', value: 0 });
    setTotal(0);
    setShowQuoteForm(false);
  };

  const calculateTotal = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 0), 0);
    const discountAmount = discount.type === 'percent' ? subtotal * (discount.value / 100) : discount.value;
    setTotal(subtotal - discountAmount);
  };

  useEffect(() => {
    calculateTotal();
  }, [discount, calculateTotal]);

  const applyDiscount = () => {
    calculateTotal();
  };

  const finalizeQuote = async () => {
    try {
      const quoteData = {
        customer_email: customerEmail,
        associate_id: GlobalUserID,
        line_items: lineItems.map(item => ({
          description: item.description,
          price: parseFloat(item.price),
          quantity: parseFloat(item.quantity)
        })),
        secret_notes: secretNotes,
        customer_id: selectedCustomer.id,
        customer_address: selectedCustomer.street,
        //discount: discount,
        total: total,
        status: 'finalized',
        date: new Date(),
      };

      const response = await axios.post('/api/quotes', quoteData);
      if (response.status === 201) {
        alert('Quote finalized successfully!');
        handleCloseQuoteForm();
        fetchDraftQuotes();
      } else {
        alert('Failed to finalize quote.');
      }
    } catch (error) {
      console.error('Error finalizing quote:', error);
      alert('An error occurred while finalizing the quote.');
    }
  };

  const saveDraftQuote = async () => {
    try {
      const quoteData = {
        customer_email: customerEmail,
        associate_id: GlobalUserID,
        line_items: lineItems.map(item => ({
          description: item.description,
          price: parseFloat(item.price),
          quantity: parseFloat(item.quantity)
        })),
        secret_notes: secretNotes,
        customer_id: selectedCustomer.id,
        customer_address: selectedCustomer.street,
        //discount: discount,
        total: total,
        status: 'draft',
        date: new Date(),
      };

      if (selectedQuote) {
        const response = await axios.put(`/api/quotes/${selectedQuote._id}`, quoteData);
        if (response.status === 200) {
          alert('Draft quote updated successfully!');
          handleCloseQuoteForm();
          fetchDraftQuotes();
        } else {
          alert('Failed to update draft quote.');
        }
      } else {
        const response = await axios.post('/api/quotes', quoteData);
        if (response.status === 201) {
          alert('Draft quote saved successfully!');
          handleCloseQuoteForm();
          fetchDraftQuotes();
        } else {
          alert('Failed to save draft quote.');
        }
      }
    } catch (error) {
      console.error('Error saving/updating draft quote:', error);
      alert('An error occurred while saving/updating the draft quote.');
    }
  };

  const handleEditQuote = (quote) => {
    setSelectedQuote(quote);
    setSelectedCustomer({ id: quote.customer_id, street: quote.customer_address });
    setCustomerEmail(quote.customer_email);
    setLineItems(quote.line_items);
    setSecretNotes(quote.secret_notes);
    setTotal(quote.total);

    const subtotal = quote.line_items.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 0), 0);
    const discountAmount = subtotal - quote.total;
    const discountType = discountAmount > 0 ? 'amount' : 'percent';
    const discountValue = discountType === 'amount' ? discountAmount : ((discountAmount / subtotal) * 100).toFixed(2);
    setDiscount({ type: discountType, value: discountValue });

    setShowQuoteForm(true);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/customers/search?name=${searchTerm}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching customer data:', error);
      alert('An error occurred while searching for customers.');
      setResults([]);
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

      {draftQuotes.length > 0 && (
        <div>
          <h3>Draft Quotes:</h3>
          <ul>
            {draftQuotes.map((quote) => (
              <li key={quote._id}>
                {quote.customer_email}
                <button onClick={() => handleEditQuote(quote)}>Edit</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showQuoteForm && (
        <div className="quote-form-overlay">
          <div className="quote-form">
          <h3>Create New Quote for {selectedCustomer.name}</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="address-container">
                <p>{selectedCustomer.street}<br/>
                {selectedCustomer.city}<br/>
                {selectedCustomer.contact}</p>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Customer Email"
                required
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
                  <button type="button" onClick={() => removeSecretNote(index)}>
                    Remove
                  </button>
                </div>
              ))}
              <div>
                <label>Discount:</label>
                <input
                  type="number"
                  placeholder="Discount"
                  value={discount.value}
                  onChange={(e) => setDiscount({ ...discount, value: parseFloat(e.target.value) })}
                />
                <select value={discount.type} onChange={(e) => setDiscount({ ...discount, type: e.target.value })}>
                  <option value="percent">Percent</option>
                  <option value="amount">Amount</option>
                </select>
                <button type="button" onClick={applyDiscount}>Apply</button>
              </div>
              <div>
                <label>Total:</label>
                <span>{total.toFixed(2)}</span>
              </div>
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
                <button type="button" onClick={saveDraftQuote}>
                  Save Draft
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