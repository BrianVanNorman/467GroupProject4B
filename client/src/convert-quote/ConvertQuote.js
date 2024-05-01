import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ConvertQuote.css';

function ConvertQuote() {
  const [sanctionedQuotes, setSanctionedQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [lineItems, setLineItems] = useState([{ description: '', quantity: '', price: '' }]);
  const [secretNotes, setSecretNotes] = useState(['']);
  const [total, setTotal] = useState(0);
  const [results, setResults] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [discount, setDiscount] = useState({ type: 'percent', value: 0 });

  useEffect(() => {
    fetchSanctionedQuotes();
  }, []);

  const fetchSanctionedQuotes = async () => {
    try {
      const response = await axios.get('/api/quotes/sanctioned');
      const data = Array.isArray(response.data) ? response.data : [];
      setSanctionedQuotes(data);
    } catch (error) {
      console.error('Error fetching sanctioned quotes:', error);
    }
  };

  const handleSelectQuote = async (quote) => {
    const response = await axios.get(`/api/customers/${quote.customer_id}`);
    const customer = response.data;

    setSelectedCustomer(customer);

    setSelectedQuote(quote);
    setLineItems(quote.line_items);
    setSecretNotes(quote.secret_notes);
    setDiscount(quote.discount || { type: 'percent', value: 0 });
    setTotal(quote.total);
    recalculateTotal(quote.total, quote.discount);
    setShowModal(true);
  };
    
  const recalculateTotal = (baseTotal, discount) => {
    if (!discount) return;
    let discountAmount = discount.type === 'percent' ? baseTotal * (discount.value / 100) : discount.value;
    setTotal(baseTotal - discountAmount);
  }

  const handleDiscountChange = (e) => {
    const { name, value } = e.target;
    const newDiscount = { ...discount, [name]: name === 'value' ? parseFloat(value) : value };
    setDiscount(newDiscount);
    // Recalculate the total whenever discount changes
    recalculateTotal(total, newDiscount);
  };
    
    
    const saveSanctionedQuote = async () => {
      try {
          const quoteData = {
              total: total,
          };
          const response = await axios.put(`/api/quotes/sanctioned/${selectedQuote._id}`, quoteData);
          if (response.status === 200) {
              alert('Quote updated successfully!');
              fetchSanctionedQuotes();  // Refresh the list of quotes
          } else {
              alert('Failed to update quote.');
          }
          setShowModal(false);
      } catch (error) {
          console.error('Error updating quote:', error);
          alert('An error occurred while updating the quote.');
      }
  };

  const handleProcessOrder = async () => {
    try {
      await axios.post(`/api/quotes/${selectedQuote._id}/process-order`);
      setShowModal(false);
      fetchSanctionedQuotes();
      alert('Order processed successfully!');
    } catch (error) {
      console.error('Error processing order:', error);
    }
  };
  
    return (
      <div className="convert-quote">
        <h2>Sanctioned Quotes</h2>
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
            {sanctionedQuotes.map((quote) => (
              <tr key={quote._id}>
                <td>{quote.numeric_id}</td>
                <td>{quote.customer_email}</td>
                <td>${quote.total.toFixed(2)}</td>
                <td>
                  <button onClick={() => handleSelectQuote(quote)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Edit Sanctioned Quote for {selectedCustomer.name}</h3>
              <p className="customer-email">
                {selectedCustomer.street}<br/>
                {selectedCustomer.city}<br/>
                {selectedCustomer.contact}<br/>  
                {selectedQuote.customer_email}
              </p>
              <div>
                <strong>Line Items:</strong>
                {lineItems.map((item, index) => (
                  <div key={index}>
                    Description: {item.description}, Quantity: {item.quantity}, Price: ${item.price}
                  </div>
                ))}
              </div>
              <div>
                <strong>Secret Notes:</strong>
                {secretNotes.map((note, index) => (
                  <p key={index}>{note}</p>
                ))}
              </div>
              <div className="discount">
                <label>Discount Type:</label>
                <select
                  name="type"
                  value={discount.type}
                  onChange={handleDiscountChange}
                >
                  <option value="percent">Percent</option>
                  <option value="amount">Amount</option>
                </select>
                <label>Discount Value:</label>
                <input
                  type="number"
                  name="value"
                  value={discount.value}
                  onChange={handleDiscountChange}
                />
              </div>
              <div>
                <strong>Total: ${total.toFixed(2)}</strong>
              </div>
              <button onClick={handleProcessOrder}>Process Order</button>
              <button onClick={saveSanctionedQuote}>Save Changes</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  export default ConvertQuote;