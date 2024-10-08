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





  const fetchDraftQuotes = async () => {
    try {
      const response = await axios.get(`/api/quotes/draft?associateId=${GlobalUserID}`);
      setDraftQuotes(response.data);
    } catch (error) {
      console.error('Error fetching draft quotes:', error);
    }
  };
  useEffect(() => {
    fetchDraftQuotes();
  }, []);

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
    if (discount && discount.type) {
      const discountAmount = discount.type === 'percent' ? subtotal * (discount.value / 100) : discount.value;
      setTotal(subtotal - discountAmount);
    } else {
      setTotal(subtotal);
    }
  };

  useEffect(() => {
    calculateTotal();
  }, [discount, calculateTotal]);
  useEffect(() => {
    calculateTotal();
  }, [lineItems, discount]);



  const finalizeQuote = async () => {
    try {
      // Variables for storing formatted date
      const date = new Date();
      const formatDate = date.toISOString().split('T')[0].replace(/-/g, ' ');
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
        discount: discount,
        total: total,
        status: 'finalized',
        date: formatDate,
      };
  
      if (selectedQuote) {
        const response = await axios.put(`/api/quotes/${selectedQuote._id}`, quoteData);
        if (response.status === 200) {
          alert('Quote finalized successfully!');
          handleCloseQuoteForm();
          fetchDraftQuotes();
        } else {
          alert('Failed to finalize quote.');
        }
      } else {
        const response = await axios.post('/api/quotes', quoteData);
        if (response.status === 201) {
          alert('Quote finalized successfully!');
          handleCloseQuoteForm();
          fetchDraftQuotes();
        } else {
          alert('Failed to finalize quote.');
        }
      }
    } catch (error) {
      console.error('Error finalizing quote:', error);
      alert('An error occurred while finalizing the quote.');
    }
  };
  const saveDraftQuote = async () => {
    try {
      // Variables for storing formatted date
      const date = new Date();
      const formatDate = date.toISOString().split('T')[0].replace(/-/g, ' ');
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
        discount: discount,
        total: total,
        status: 'draft',
        date: formatDate,
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


  const handleEditQuote = async (quote) => {
    try {
      const response = await axios.get(`/api/customers/${quote.customer_id}`);
      const customer = response.data;
  
      setSelectedQuote(quote);
      setSelectedCustomer(customer);
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
    } catch (error) {
      console.error('Error fetching customer data:', error);
      alert('An error occurred while fetching customer data.');
    }
  };

  const handleDeleteDraft = async () => {
    if (window.confirm('Are you sure you want to delete this draft quote?')) {
      try {
        if (selectedQuote) {
          console.log("Attempting to delete quote with ID:", selectedQuote._id); // Log the ID
          const response = await axios.delete(`/api/quotes/${selectedQuote._id}`);
          if (response.status === 200) {
            alert('Draft quote deleted successfully!');
            handleCloseQuoteForm();
            fetchDraftQuotes();
          } else {
            alert('Failed to delete draft quote.');
            console.error("Delete request failed with status:", response.status); // Log the error
          }
        }
      } catch (error) {
        console.error('Error deleting draft quote:', error);
        alert('An error occurred while deleting the draft quote.');
      }
    }
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
      <div className="associate-info">
      <h3>Logged in as: {GlobalUsername}</h3>
      <form action="/login">
        <input type="submit" value="Logout" />
      </form>
      </div>
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
        <div className='draft-quote'>
          <h3>Draft Quotes:</h3>
          <table>
            <thead>
              <tr>
                <th>Quote ID</th>
                <th>Customer Email</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {draftQuotes.map((quote) => (
                <tr key={quote._id}>
                <td>{quote.numeric_id}</td>
                <td>{quote.customer_email}</td>
                <td>{quote.total.toFixed(2)}</td>
                <td>
                  <button onClick={() => handleEditQuote(quote)}>Edit</button>
                </td>
              </tr>
              ))}
            </tbody>
         </table>
        </div>
      )}  

      {showQuoteForm && (
        <div className="quote-form-overlay">
          <div className="quote-form">
            <form onSubmit={(e) => e.preventDefault()}>
              <h3>Create New Quote for {selectedCustomer.name}</h3>
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
              <div style={{marginBottom: "15px", display: "flex", height: "30px", gap: "38px", alignItems: "center"}}>
                <u>Line Items</u>
                <button type="button" onClick={addLineItem} style={{padding: "5px 10px"}}>
                  Add Line Item
                </button>
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
                    min = "0"
                    value={item.quantity}
                    onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    min = "0"
                    value={item.price}
                    onChange={(e) => handleLineItemChange(index, 'price', e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => removeLineItem(index)}>
                    Remove
                  </button>
                </div>
              ))}
              <div style={{margin: "15px 0px 15px 0px", display: "flex", height: "30px", gap: "20px", alignItems: "center"}}>
                <u>Secret Notes</u>
                <button type="button" onClick={addSecretNote} style={{padding: "5px 10px"}}>
                  Add Secret Note
                </button>
              </div>
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
              <p style={{textAlign: "left"}}><u>Apply Discount</u></p>
              <div>
                <label>Discount Type: </label>
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
              </div>
              <p style={{textAlign: "left",marginTop: "35px"}}>Total: ${total.toFixed(2)}</p>
            </form>
            <div className="action-buttons">
              <button type="button" onClick={finalizeQuote}>
                Finalize Quote
              </button>
              <button type="button" onClick={saveDraftQuote}>
                Save Draft
              </button>
              <button type="button" onClick={handleDeleteDraft}>
                Delete Draft
              </button>
              <button type="button" onClick={handleCloseQuoteForm}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnterQuote;
