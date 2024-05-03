import React, { useState, useEffect } from 'react';
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
  const [selectedCustomer, setSelectedCustomer] = useState(null);



  const fetchFinalizedQuotes = async () => {
    try {
      const response = await axios.get('/api/quotes/finalized');
      setFinalizedQuotes(response.data);
    } catch (error) {
      console.error('Error fetching finalized quotes:', error);
    }
  };
  useEffect(() => {
    fetchFinalizedQuotes();
  }, []);

  const handleEditQuote = async (quote) => {
    try {
      const response = await axios.get(`/api/customers/${quote.customer_id}`);
      const customer = response.data;
  
      setSelectedQuote(quote);
      setSelectedCustomer(customer);
      setLineItems(quote.line_items);
      setSecretNotes(quote.secret_notes);
      setTotal(quote.total);
  
      const subtotal = quote.line_items.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 0), 0);
      const discountAmount = subtotal - quote.total;
      const discountType = discountAmount > 0 ? 'amount' : 'percent';
      const discountValue = discountType === 'amount' ? discountAmount : ((discountAmount / subtotal) * 100).toFixed(2);
      setDiscount({ type: discountType, value: discountValue });
  
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching customer data:', error);
      alert('An error occurred while fetching customer data.');
    }
  };


  const handleCloseModal = () => {
    setSelectedCustomer(null);
    setSelectedQuote(null);
    setLineItems([{ description: '', quantity: '', price: '' }]);
    setSecretNotes(['']);
    setDiscount({ type: 'percent', value: 0 });
    setTotal(0);
    setShowModal(false);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: '', price: '' }]);
  };

  const removeLineItem = (index) => {
    setLineItems(prev => prev.filter((_, i) => i !== index));
  };

  const addSecretNote = () => {
    setSecretNotes([...secretNotes, '']);
  };

  const removeSecretNote = (index) => {
    const newSecretNotes = secretNotes.filter((_, i) => i !== index);
    setSecretNotes(newSecretNotes);
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

  const handleSanctionQuote = async () => {
    try {
      const date = new Date();
      const formatDate = date.toISOString().split('T')[0].replace(/-/g, ' ');
      const updatedQuote = {
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
        date: formatDate,
        status: 'sanctioned',
      };
      
      let response;
      if (selectedQuote) {
        response = await axios.put(`/api/quotes/${selectedQuote._id}`, updatedQuote);
      } else {
        response = await axios.post('/api/quotes', updatedQuote);
      }
  
      if (response.status === 200 || response.status === 201) {
        alert('Quote sanctioned successfully!');
        handleCloseModal();
        fetchFinalizedQuotes();
  
        // Trigger email sending
        const emailContent = {
          email: selectedQuote.customer_email,
          content: `Dear ${selectedCustomer.name},<br>Here are the details of your sanctioned quote below:<br><br>${selectedCustomer.street}<br>
          ${selectedCustomer.city}<br>${selectedCustomer.contact}<br>Items:${updatedQuote.line_items.map(item => `${item.description}: $${item.price} x ${item.quantity}`).join('<br>')}<br>Total: 
          $${updatedQuote.total}<br>Sanctioned Date: ${updatedQuote.date}<br><br>Thank you for choosing us!`
        };
        await axios.post('/api/quotes/send-email', emailContent);
      } else {
        alert('Failed to sanction quote.');
      }
    } catch (error) {
      console.error('Error sanctioning quote:', error);
      alert('An error occurred while sanctioning.');
    }
  };

  const handleSaveChanges = async () => {
    try {
      const date = new Date();
      const formatDate = date.toISOString().split('T')[0].replace(/-/g, ' ');
      const updatedQuote = {
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
        date: formatDate,
        status: 'finalized',
        // Add other fields you expect to update
      };
  
      if (selectedQuote) {
        const response = await axios.put(`/api/quotes/${selectedQuote._id}`, updatedQuote);
        if (response.status === 200) {
          alert('Quote updated successfully!');
          fetchFinalizedQuotes();
          handleCloseModal();
        } else {
          alert('Failed to update quote.');
        }
      } else {
        const response = await axios.post('/api/quotes', updatedQuote);
        if (response.status === 201) {
          alert('Draft updated successfully!');
          handleCloseModal();
          fetchFinalizedQuotes();
        } else {
          alert('Failed to save quote.');
        }
      }
    } catch (error) {
      console.error('Error saving quote changes:', error);
      alert('An error occurred while saving the quote changes.');
    }
  };

  return (
    <div className="sanction-quote">
      <h2>Finalized Quotes</h2>
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
              <td>{quote.numeric_id}</td>
              <td>{quote.customer_email}</td>
              <td>${quote.total.toFixed(2)}</td>
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
              <h3>Edit Quote for {selectedCustomer.name}<br/></h3>
              <div className="address-container">
                <p>
                  {selectedCustomer.street}<br/>
                  {selectedCustomer.city}<br/>
                  {selectedCustomer.contact}<br/>  
                  {selectedQuote.customer_email}
                </p>
              </div>
              <div style={{marginBottom: "15px", display: "flex", height: "30px", gap: "38px", alignItems: "center"}}>
                <u>Line Items</u>
                <button type="button" onClick={addLineItem} style={{padding: "5px 10px"}}>Add Line Item</button>
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
                  <button type="button" onClick={() => removeLineItem(index)}>Remove</button>
                </div>
              ))}
              <div style={{margin: "15px 0px 15px 0px", display: "flex", height: "30px", gap: "20px", alignItems: "center"}}>
                <u>Secret Notes</u>
                <button type="button" onClick={addSecretNote} style={{padding: "5px 10px"}}>Add Secret Note</button>
              </div>
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
              <button type="button" onClick={handleSaveChanges}>Save</button>
              <button type="button" onClick={handleSanctionQuote}>Sanction Quote</button>
              <button type="button" onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SanctionQuote;
