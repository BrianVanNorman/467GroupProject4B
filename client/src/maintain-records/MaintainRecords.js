import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MaintainRecords.css';

function MaintainRecords() {
  const [associates, setAssociates] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [selectedAssociate, setSelectedAssociate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchParams, setSearchParams] = useState({
    customer: '',
    startDate: '',
    endDate: '',
    status: '',
    associate: '',
  });

  useEffect(() => {
    fetchAssociates();
    fetchQuotes();
  }, []);

  const fetchAssociates = async () => {
    try {
      const response = await axios.get('/api/associates/list');
      setAssociates(response.data);
    } catch (error) {
      console.error('Error fetching associates:', error);
    }
  };

  const fetchQuotes = async () => {
    try {
      const response = await axios.get('/api/admin/quotes/search', { params: { search: searchParams } });
      const data = Array.isArray(response.data) ? response.data : [];
      setQuotes(data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  const handleEditAssociate = (associate) => {
    setSelectedAssociate(associate);
    setShowModal(true);
  };

  const handleUpdateAssociate = async () => {
    try {
      const response = await axios.put(`/api/associates/${selectedAssociate._id}`, selectedAssociate);
      setShowModal(false);
      if (response.status === 201) {
        alert('Associate updated successfully!');
      }
      else {
        alert('Associate update failed!');
      }
      fetchAssociates();
    } catch (error) {
      console.error('Error updating associate:', error);
    }
  };

  const handleDeleteAssociate = async (associateId) => {
    try {
      const response = await axios.delete(`/api/associates/${associateId}`);
      if (response.status === 200) {
        alert('Associate deleted successfully!');
      }
      else {
        alert('Associate deletion failed!');
      }
      fetchAssociates();
    } catch (error) {
      console.error('Error deleting associate:', error);
    }
  };

  const handleAddAssociate = async () => {
    try {
      const response = await axios.post('/api/associates', selectedAssociate);
      setShowModal(false);
      fetchAssociates();
      if (response.status === 201) {
        alert('Associate added successfully!');
      }
      else {
        alert('Failed to add associate!');
      }
    } catch (error) {
      console.error('Error adding associate:', error);
    }
  };

  const handleSearchQuotes = () => {
    fetchQuotes();
  };
  
  const handleViewQuote = async (Quote) => {
    setSelectedQuote(Quote);
    try {
      const response = await axios.get(`/api/customers/${Quote.customer_id}`);
      setSelectedCustomer(response.data);
      console.log(selectedCustomer);
    } catch (error) {
      console.error('Error searching customer by id:', error);
    }
    setShowQuoteModal(true);
  };

  const handleCloseViewQuote = () => {
    setSelectedQuote(null);
    setShowQuoteModal(false);
  }

  const printAssociateName = (ID) => {
    const result = associates.find((associates) => associates._id === ID);
    return result.name;
  }

  const formatDate = (date) => {
    const result = date.substr(0, 10);
    return result;
  }

  return (
    <div className="maintain-records">
      <h2>Maintain Records</h2>
      <div className="associates">
        <h3>Sales Associates</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Commission</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {associates.map((associate) => (
              <tr key={associate._id}>
                <td>{associate.name}</td>
                <td>{associate.address}</td>
                <td>{associate.commission.toFixed(2)}</td>
                <td>
                  <button onClick={() => handleEditAssociate(associate)}>Edit</button>
                  <button onClick={() => handleDeleteAssociate(associate._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => {
          setSelectedAssociate({ name: '', address: '', commission: 0 });
          setShowModal(true);
        }}>
          Add Associate
        </button>
      </div>
      <div className="quotes">
        <h3>Quotes</h3>
        <div className="search-params">
          <input
            type="text"
            placeholder="Customer"
            value={searchParams.customer}
            onChange={(e) => setSearchParams({ ...searchParams, customer: e.target.value })}
          />
          <select
            value={searchParams.associate}
            onChange={(e) => setSearchParams({ ...searchParams, associate: e.target.value })}
          >
            <option value="">All</option>
            {associates.map((associate) => (
              <option value={associate._id}>{associate.name}</option>
            ))}
          </select>
          <input
            type="date"
            placeholder="Start Date"
            value={searchParams.startDate}
            onChange={(e) => setSearchParams({ ...searchParams, startDate: e.target.value })}
          />
          <input
            type="date"
            placeholder="End Date"
            value={searchParams.endDate}
            onChange={(e) => setSearchParams({ ...searchParams, endDate: e.target.value })}
          />
          <select
            value={searchParams.status}
            onChange={(e) => setSearchParams({ ...searchParams, status: e.target.value })}
          >
            <option value="">All</option>
            <option value="draft">Draft</option>
            <option value="finalized">Finalized</option>
            <option value="sanctioned">Sanctioned</option>
            <option value="ordered">Ordered</option>
          </select>
          <button onClick={handleSearchQuotes}>Search</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Quote ID</th>
              <th>Customer</th>
              <th>Associate</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {quotes.length > 0 ? (
              quotes.map((quote) => (
                <tr key={quote.numeric_id}>
                  <td>{quote.numeric_id} ({formatDate(String(quote.date))})</td>
                  <td>{quote.customer_email}</td>
                  <td>{printAssociateName(quote.associate_id)}</td>
                  <td>{quote.total.toFixed(2)}</td>
                  <td>{quote.status}</td>
                  <td>
                    <button onClick={() => handleViewQuote(quote)}>View</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No quotes found</td>
              </tr>
            )}
            </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedAssociate._id ? 'Edit Associate' : 'Add Associate'}</h3>
            <label style={{textAlign: "left"}}><u>Name</u></label>
            <input
              type="text"
              placeholder="Name"
              value={selectedAssociate.name}
              onChange={(e) => setSelectedAssociate({ ...selectedAssociate, name: e.target.value })}
            />
            <label style={{textAlign: "left"}}><u>Password</u></label>
            <input
              type="password"
              placeholder="New password"
              value={selectedAssociate.password}
              onChange={(e) => setSelectedAssociate({ ...selectedAssociate, password: e.target.value })}
            />
            <label style={{textAlign: "left"}}><u>Address</u></label>
            <input
              type="text"
              placeholder="Address"
              value={selectedAssociate.address}
              onChange={(e) => setSelectedAssociate({ ...selectedAssociate, address: e.target.value })}
            />
            <label style={{textAlign: "left"}}><u>Comission</u></label>
            <input
              type="number"
              placeholder="Commission"
              value={selectedAssociate.commission}
              onChange={(e) => setSelectedAssociate({ ...selectedAssociate, commission: e.target.value })}
            />
            <button onClick={selectedAssociate._id ? handleUpdateAssociate : handleAddAssociate}>
              {selectedAssociate._id ? 'Update' : 'Add'}
            </button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showQuoteModal && (
        <div className="record-form-overlay">
          <div className="record-form">
            <div>
              <h3>Order from: {selectedCustomer.name}</h3>
              <div className="address-container">
                <p>{selectedCustomer.street}<br/>
                {selectedCustomer.city}<br/>
                {selectedCustomer.contact}<br/>
                {selectedQuote.customer_email}</p>
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
                    {selectedQuote.line_items.map((item, index) => (
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
                {selectedQuote.secret_notes.map((note, index) => (
                  <p key={index}>{note}</p>
                ))}
              </div>
              <div>
                <label>Total: ${selectedQuote.total.toFixed(2)}</label><br/>
                <label>Commission: ${selectedQuote.commission.toFixed(2)}</label>
              </div>
            </div>
            <div className="record-action-buttons">
              <button type="button" onClick={handleCloseViewQuote}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default MaintainRecords;
