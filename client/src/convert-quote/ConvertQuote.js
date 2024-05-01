import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ConvertQuote.css';

function ConvertQuote() {
  const [sanctionedQuotes, setSanctionedQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [lineItems, setLineItems] = useState([]);
  const [secretNotes, setSecretNotes] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [discount, setDiscount] = useState({ type: 'percent', value: 0 });



  const fetchSanctionedQuotes = async () => {
    try {
      const response = await axios.get('/api/quotes/sanctioned');
      const data = Array.isArray(response.data) ? response.data : [];
      setSanctionedQuotes(data);
    } catch (error) {
      console.error('Error fetching sanctioned quotes:', error);
    }
  };

  useEffect(() => {
    fetchSanctionedQuotes();
  }, []);

  const handleSelectQuote = async (quote) => {
    const response = await axios.get(`/api/customers/${quote.customer_id}`);
    const customer = response.data;

    setSelectedCustomer(customer);

    setSelectedQuote(quote);
    setLineItems(quote.line_items);
    setSecretNotes(quote.secret_notes);
    setDiscount(quote.discount || { type: 'percent', value: 0 });
    setTotal(quote.total);
    setShowModal(true);
  };


  const calculateTotal = () => {
    if (!selectedQuote) {
      setTotal(0);
      return;
    }
  
    const subtotal = lineItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 0), 0);
  
    let newTotal = selectedQuote.total;
  
    if (discount && discount.type) {
      const newDiscountAmount = discount.type === 'percent' ? newTotal * (discount.value / 100) : discount.value;
      newTotal = newTotal - newDiscountAmount;
    }
  
    setTotal(newTotal);
  };

  useEffect(() => {
    calculateTotal();
  }, [discount, lineItems, calculateTotal]);

  const saveSanctionedQuote = async () => {
    try {
      const quoteData = {
        total: total,
        discount: discount,
      };
      const response = await axios.put(`/api/quotes/sanctioned/${selectedQuote._id}`, quoteData);
      if (response.status === 200) {
        alert('Quote updated successfully!');
        fetchSanctionedQuotes();
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
          <div className="convert-form-overlay">
            <div className="convert-form">
              <h3>Edit Sanctioned Quote for {selectedCustomer.name}</h3>
              <div className="address-container">
                {selectedCustomer.street}<br/>
                {selectedCustomer.city}<br/>
                {selectedCustomer.contact}<br/>  
                {selectedQuote.customer_email}
              </div>
              <div>
                <p style={{textAlign: "left"}}><u>Line Items:</u></p>
                <table>
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item, index) => (
                      <tr key={index}>
                        <td>{item.description}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{textAlign: "left"}}>
                <p><u>Secret Notes:</u></p>
                {secretNotes.map((note, index) => (
                  <p key={index}>{note}</p>
                ))}
              </div>
              <div>
                <p style={{textAlign: "left"}}><u>Apply Final Discount</u></p>
                <div className="discount">
                  <input
                    type="number"
                    placeholder="Discount"
                    value={discount.value}
                    onChange={(e) => setDiscount({ ...discount, value: parseFloat(e.target.value) })}
                  />
                  <label>Discount Type: </label>
                  <select value={discount.type} onChange={(e) => setDiscount({ ...discount, type: e.target.value })}>
                    <option value="percent">Percent</option>
                    <option value="amount">Amount</option>
                  </select>
                </div>
              </div>
              <div style={{marginTop: "20px"}}>
                <strong>Subtotal:</strong> ${lineItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 0), 0).toFixed(2)} <br/>
                <strong>Total:</strong> ${total.toFixed(2)}
              </div>
              <div className="convert-action-buttons">
                <button onClick={handleProcessOrder}>Process Order</button>
                <button onClick={saveSanctionedQuote}>Save Changes</button>
                <button onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  export default ConvertQuote;
