import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SanctionQuote.css';

function SanctionQuote() {
  const [finalizedQuotes, setFinalizedQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [lineItems, setLineItems] = useState([]);
  const [secretNotes, setSecretNotes] = useState('');
  const [discount, setDiscount] = useState({ type: 'percent', amount: 0 });

  useEffect(() => {
    fetchFinalizedQuotes();
  }, []);

  const fetchFinalizedQuotes = async () => {
    try {
      const response = await axios.get('/api/quotes/finalized');
      setFinalizedQuotes(response.data);
    } catch (error) {
      console.error('Error fetching finalized quotes:', error);
    }
  };

  const handleSanctionQuote = async () => {
    try {
      await axios.put(`/api/quotes/${selectedQuote._id}/sanction`, {
        lineItems,
        secretNotes,
        discount,
      });
      setShowModal(false);
      fetchFinalizedQuotes();
      alert('Quote sanctioned and email sent successfully!');
    } catch (error) {
      console.error('Error sanctioning quote:', error);
    }
  };

  const handleLineItemChange = (index, field, value) => {
    const updatedLineItems = [...lineItems];
    updatedLineItems[index][field] = value;
    setLineItems(updatedLineItems);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { name: '', description: '', amount: '' }]);
  };

  const removeLineItem = (index) => {
    const updatedLineItems = lineItems.filter((_, i) => i !== index);
    setLineItems(updatedLineItems);
  };

  return (
    <div className="sanction-quote">
      <h2>Sanction Quote</h2>
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
          {finalizedQuotes.map((quote) => (
            <tr key={quote._id}>
              <td>{quote._id}</td>
              <td>{quote.customer_email}</td>
              <td>{quote.amount}</td>
              <td>
                <button onClick={() => {
                  setSelectedQuote(quote);
                  setLineItems(quote.line_items);
                  setSecretNotes(quote.secret_notes);
                  setShowModal(true);
                }}>
                  Sanction Quote
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Sanction Quote</h3>
            <div className="line-items">
              {lineItems.map((item, index) => (
                <div key={index} className="line-item">
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={item.name}
                    onChange={(e) => handleLineItemChange(index, 'name', e.target.value)}
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
                  />
                  <button onClick={() => removeLineItem(index)}>Remove</button>
                </div>
              ))}
              <button onClick={addLineItem}>Add Line Item</button>
            </div>
            <textarea
              placeholder="Secret Notes"
              value={secretNotes}
              onChange={(e) => setSecretNotes(e.target.value)}
            />
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
            <button onClick={handleSanctionQuote}>Sanction Quote</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SanctionQuote;