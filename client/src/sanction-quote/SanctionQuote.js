import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './SanctionQuote.css';

function SanctionQuote() {
  const [finalizedQuotes, setFinalizedQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [lineItems, setLineItems] = useState([]);
  const [secretNotes, setSecretNotes] = useState([]);
  const [discount, setDiscount] = useState({ type: 'percent', value: 0 });
  const [total, setTotal] = useState(0);

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

  const handleEditQuote = (quote) => {
    setSelectedQuote(quote);
    setLineItems(quote.line_items || []);
    setSecretNotes(quote.secret_notes || []);
    setDiscount({ type: 'percent', value: 0 }); // Reset discount
    setTotal(quote.total || 0);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedQuote(null);
    setLineItems([]);
    setSecretNotes([]);
    setDiscount({ type: 'percent', value: 0 });
    setTotal(0);
    setShowModal(false);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, price: 0 }]);
  };

  const removeLineItem = (index) => {
    setLineItems(prev => prev.filter((_, i) => i !== index));
  };

  const addSecretNote = () => {
    setSecretNotes([...secretNotes, '']);
  };

  const removeSecretNote = (index) => {
    setSecretNotes(prev => prev.filter((_, i) => i !== index));
  };

  const handleLineItemChange = (index, field, value) => {
    const updatedLineItems = lineItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setLineItems(updatedLineItems);
  };

  const handleSecretNoteChange = (index, value) => {
    const updatedSecretNotes = secretNotes.map((note, i) =>
      i === index ? value : note
    );
    setSecretNotes(updatedSecretNotes);
  };

  const handleDiscountChange = (value, type) => {
    setDiscount({ type, value: parseFloat(value) });
  };

  const calculateTotal = useCallback(() => {
    const subtotal = lineItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = discount.type === 'percent' ? subtotal * (discount.value / 100) : discount.value;
    setTotal(subtotal - discountAmount);
  }, [lineItems, discount]);

  useEffect(() => {
    calculateTotal();
  }, [lineItems, discount, calculateTotal]);

  const handleConvertToPurchaseOrder = async () => {
    try {
      const updatedQuote = {
        ...selectedQuote,
        line_items: lineItems,
        secret_notes: secretNotes,
        total: total,
      };

      await axios.put(`/api/quotes/${selectedQuote._id}/convert-to-purchase-order`, updatedQuote);
      alert('Quote converted to purchase order successfully!');
      handleCloseModal();
      fetchFinalizedQuotes();
    } catch (error) {
      console.error('Error converting quote to purchase order:', error);
      alert('An error occurred while converting the quote to a purchase order.');
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updatedQuoteData = {
        line_items: lineItems.map(item => ({
          name: item.name,
          description: item.description,
          price: parseFloat(item.price),
          quantity: parseFloat(item.quantity),
        })),
        total: total,
        secret_notes: secretNotes,
        // Add other fields you expect to update
      };
  
      const response = await axios.put(`/api/quotes/${selectedQuote._id}`, updatedQuoteData);
      if (response.status === 200) {
        alert('Quote updated successfully!');
        fetchFinalizedQuotes();
        handleCloseModal();
      } else {
        alert('Failed to update quote.');
      }
    } catch (error) {
      console.error('Error saving quote changes:', error);
      alert('An error occurred while saving the quote changes.');
    }
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
              <td>{quote.total.toFixed(2)}</td>
              <td>
                <button onClick={() => handleEditQuote(quote)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="sanction-form-overlay">
          <div className="sanction-form">
            <form onSubmit={(e) => e.preventDefault()}>
              <h3>Edit Quote</h3>
              <p className="customer-email">{selectedQuote.customer_email}</p>
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
                  <button type="button" onClick={() => removeLineItem(index)}>Remove</button>
                </div>
              ))}

              {secretNotes.map((note, index) => (
                <div key={index} className="secret-note-form">
                  <textarea
                    value={note}
                    onChange={(e) => handleSecretNoteChange(index, e.target.value)}
                    placeholder="Secret Note"
                  />
                  <button type="button" onClick={() => removeSecretNote(index)}>Remove</button>
                </div>
              ))}

              <div>
                <label>Discount:</label>
                <input
                  type="number"
                  placeholder="Discount"
                  value={discount.value}
                  onChange={(e) => handleDiscountChange(e.target.value, discount.type)}
                />
                <select
                  value={discount.type}
                  onChange={(e) => handleDiscountChange(discount.value, e.target.value)}
                >
                  <option value="percent">Percent</option>
                  <option value="amount">Amount</option>
                </select>
              </div>
              <div>
                <label>Total:</label>
                <span>{total.toFixed(2)}</span>
              </div>
            </form>
            <div className="action-buttons">
              <button type="button" onClick={addSecretNote}>Add Secret Note</button>
              <button type="button" onClick={addLineItem}>Add Line Item</button>
              <button type="button" onClick={handleSaveChanges}>Save</button>
              <button type="button" onClick={handleConvertToPurchaseOrder}>Convert to Purchase Order</button>
              <button type="button" onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SanctionQuote;
