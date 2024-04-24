import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MaintainRecords.css';

function MaintainRecords() {
  const [associates, setAssociates] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [selectedAssociate, setSelectedAssociate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchParams, setSearchParams] = useState({
    customer: '',
    startDate: '',
    endDate: '',
    status: '',
  });

  useEffect(() => {
    fetchAssociates();
    fetchQuotes();
  }, []);

  const fetchAssociates = async () => {
    try {
      const response = await axios.get('/api/associates');
      setAssociates(response.data);
    } catch (error) {
      console.error('Error fetching associates:', error);
    }
  };

  const fetchQuotes = async () => {
    try {
      const response = await axios.get('/api/quotes', { params: searchParams });
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
      await axios.put(`/api/associates/${selectedAssociate._id}`, selectedAssociate);
      setShowModal(false);
      fetchAssociates();
      alert('Associate updated successfully!');
    } catch (error) {
      console.error('Error updating associate:', error);
    }
  };

  const handleDeleteAssociate = async (associateId) => {
    try {
      await axios.delete(`/api/associates/${associateId}`);
      fetchAssociates();
      alert('Associate deleted successfully!');
    } catch (error) {
      console.error('Error deleting associate:', error);
    }
  };

  const handleAddAssociate = async () => {
    try {
      await axios.post('/api/associates', selectedAssociate);
      setShowModal(false);
      fetchAssociates();
      alert('Associate added successfully!');
    } catch (error) {
      console.error('Error adding associate:', error);
    }
  };

  const handleSearchQuotes = () => {
    fetchQuotes();
  };

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
                <td>{associate.commission}</td>
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
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {quotes.length > 0 ? (
              quotes.map((quote) => (
                <tr key={quote._id}>
                  <td>{quote._id}</td>
                  <td>{quote.customer_email}</td>
                  <td>{quote.amount}</td>
                  <td>{quote.status}</td>
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
            <input
              type="text"
              placeholder="Name"
              value={selectedAssociate.name}
              onChange={(e) => setSelectedAssociate({ ...selectedAssociate, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Address"
              value={selectedAssociate.address}
              onChange={(e) => setSelectedAssociate({ ...selectedAssociate, address: e.target.value })}
            />
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
    </div>
  );
}

export default MaintainRecords;