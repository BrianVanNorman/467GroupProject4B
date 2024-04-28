import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ConvertQuote.css';

function ConvertQuote() {
  const [sanctionedQuotes, setSanctionedQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [discount, setDiscount] = useState({ type: 'percent', amount: 0 });

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

  const handleProcessOrder = async () => {
    try {
      await axios.post(`/api/quotes/${selectedQuote._id}/process-order`, {
        discount,
      });
      setShowModal(false);
      fetchSanctionedQuotes();
      alert('Order processed successfully!');
    } catch (error) {
      console.error('Error processing order:', error);
    }
  };

  return (
    <div className="convert-quote">
      <h2>Convert Quote to Purchase Order</h2>
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
         {sanctionedQuotes.length > 0 ? (
            sanctionedQuotes.map((quote) => (
              <tr key={quote._id}>
                <td>{quote._id}</td>
                <td>{quote.customer_email}</td>
                <td>{quote.amount}</td>
                <td>
                  <button onClick={() => {
                    setSelectedQuote(quote);
                    setShowModal(true);
                  }}>
                    Process Order
                  </button>
                </td>
              </tr>
            )) 
          ) : (
            <tr>
              <td colSpan="4">No sanctioned quotes found</td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Process Order</h3>
            <div className="discount">
              <select
                value={discount.type}
                onChange={(e) => setDiscount({ ...discount, type: e.target.value })}
              >
                <option value="percent">Percent</option>
                <option value="amount">Amount</option>
              </select>
              <input
                type="number"
                placeholder="Discount"
                value={discount.amount}
                onChange={(e) => setDiscount({ ...discount, amount: e.target.value })}
              />
            </div>
            <button onClick={handleProcessOrder}>Process Order</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConvertQuote;